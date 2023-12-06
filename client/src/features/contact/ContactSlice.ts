import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../SupabasePlugin";
import type { RootState } from "../../app/store";

export interface Contact {
  id: string;
  display_name: string;
};

interface InitialState {
  isSelected: boolean;
  loading: boolean;
  contacts: Contact[];
  error: string;
};

interface AddNewContactPayload {
  displayName: string;
}

const initialState: InitialState = {
  isSelected: false,
  loading: false,
  contacts: [],
  error: "",
};

export const getContacts = createAsyncThunk(
  "contact/getContacts",
  async (_, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentUser = currentState.user.user;

    try {
      const { data: contactsData, error } = await supabase.rpc("get_contacts", {
        p_user_id: currentUser.id,
      });

      if (error) throw error;

      return contactsData;
    } catch (error) {
      return rejectWithValue(error as Error);
    }

  }
);

export const addNewContact = createAsyncThunk(
  "contact/addNewContact",
  async (payload: AddNewContactPayload, { rejectWithValue, getState }) => {
    let verifiedContact: Contact = {
      id: "",
      display_name: "",
    };
    const currentState: RootState = getState() as RootState;
    const currentUser = currentState.user.user;

    // Validate new contact: does it exist?

    try {
      const { data: verifiedUser, error } = await supabase
        .from("users")
        .select("id, display_name")
        .eq("display_name", payload.displayName);

      if (error) throw error;

      if (!verifiedUser.length)
        throw new Error(
          "Invalid entry. \nPlease make sure you have the correct display name."
        );

      if (verifiedUser.length === 1) {
        verifiedContact = verifiedUser[0];
      }
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Validate new contact: has it been added already?

    try {
      const { data: existingContacts, error } = await supabase.rpc(
        "get_contacts",
        {
          p_user_id: currentUser.id,
        }
      );

      if (error) throw error;

      const contactExists = existingContacts.some(
        (contact: Contact) =>
          contact.display_name === verifiedContact?.display_name
      );

      if (contactExists)
        throw new Error("Contact already exists in contact list.");
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Add new contact to contacts table

    try {
      const { error } = await supabase
        .from("contacts")
        .insert([
          {
            contact1_user_id: verifiedContact.id,
            contact2_user_id: currentUser.id,
          },
        ])
        .select();

      if (error) throw error;

      return verifiedContact;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactTabSelected: (state, action) => {
      state.isSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getContacts.fulfilled,
      (state, action: PayloadAction<Contact[]>) => {
        (state.loading = false),
          (state.contacts = action.payload),
          (state.error = "");
      }
    );
    builder.addCase(getContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(addNewContact.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addNewContact.fulfilled,
      (state, action: PayloadAction<Contact>) => {
        (state.loading = false),
          (state.contacts = [...state.contacts, action.payload]),
          (state.error = "");
      }
    );
    builder.addCase(addNewContact.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default contactSlice.reducer;
export const { setContactTabSelected } = contactSlice.actions;
