import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Contact } from "../contact/ContactSlice";
import { supabase } from "../../SupabasePlugin";
import type { RootState } from "../../app/store";

type Chatroom = {
  id: number;
  name?: string;
  members: Contact[];
};

type InitialState = {
  isSelected: boolean;
  loading: boolean;
  chatrooms: Chatroom[];
  error: string;
};

interface AddNewChatroomPayload {
  name?: string;
  members: Contact[];
}

const initialState: InitialState = {
  isSelected: true,
  loading: false,
  chatrooms: [],
  error: "",
};

export const getChatrooms = createAsyncThunk(
  "chatrooms/getChatrooms",
  async (_, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentUser = currentState.user.user;

    try {
      const { data: existingChatrooms, error } = await supabase
        .from("chatrooms")
        .select("*");

      if (error) throw error;

      const filteredChatrooms = existingChatrooms.filter((chatroom) =>
        chatroom.members.some(
          (member: { email: string }) => member.email === currentUser.email
        )
      );

      return filteredChatrooms as Chatroom[];
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const addNewChatroom = createAsyncThunk(
  "chatrooms/addNewChatroom",
  async (payload: AddNewChatroomPayload, { rejectWithValue }) => {
    // Validate if this chatroom exists

    try {
      const { data: membersOfExistingChatrooms, error } = await supabase
        .from("chatrooms")
        .select("members");

      if (error) throw error;

      const doesChatroomExist = membersOfExistingChatrooms.some((chatroom) =>
        chatroom.members.every((member: Contact) =>
          payload.members.some(
            (payloadMember) =>
              payloadMember.id === member.id &&
              payloadMember.email === member.email &&
              payloadMember.display_name === member.display_name
          )
        )
      );

      if (doesChatroomExist) throw new Error("Chatroom already exists");
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Add new chatroom

    try {
      const { data: newChatroom, error } = await supabase
        .from("chatrooms")
        .insert([{ name: payload.name, members: payload.members }])
        .select();

      if (error) throw error;

      return newChatroom as Chatroom[];
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    setChatroomTabSelected: (state, action) => {
      state.isSelected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChatrooms.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getChatrooms.fulfilled,
      (state, action: PayloadAction<Chatroom[]>) => {
        (state.loading = false),
          (state.chatrooms = action.payload),
          (state.error = "");
      }
    );
    builder.addCase(getChatrooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(addNewChatroom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addNewChatroom.fulfilled,
      (state, action: PayloadAction<Chatroom[]>) => {
        (state.loading = false),
          (state.chatrooms = action.payload),
          (state.error = "");
      }
    );
    builder.addCase(addNewChatroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default chatroomSlice.reducer;
export const { setChatroomTabSelected } = chatroomSlice.actions;
