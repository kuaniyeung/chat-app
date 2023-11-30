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
    let chatrooms;

    // Fetch existing chatrooms

    try {
      const { data: chatroomsData, error } = await supabase
        .from("chatrooms_members")
        .select("chatroom_id, chatrooms!inner(name)")
        .eq("member_id", currentUser.id);

      if (error) throw error;

      if (chatroomsData.length === 0) return;

      chatrooms = chatroomsData.map((chatroomData) => ({
        id: chatroomData.chatroom_id,
        name: chatroomData.chatrooms.name,
        members: [],
      }));
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Fetch existing members in chatrooms

    try {
      const promises: Promise<{
        id: any;
        name: any;
        members: Array<{ id: any; display_name: any }> | undefined;
      } | null>[] = (chatrooms ?? []).map(async (chatroom) => {
        const { data } = await supabase
          .from("chatrooms_members")
          .select("member_id, users!inner(display_name)")
          .eq("chatroom_id", chatroom.id);

        return {
          id: chatroom.id,
          name: chatroom.name,
          members: data?.map((member) => ({
            id: member.member_id,
            display_name: member.users.display_name,
          })),
        };
      });

      try {
        chatrooms = await Promise.all(promises);
      } catch (error) {
        return rejectWithValue(error as Error);
      }

      return chatrooms as Chatroom[];
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const addNewChatroom = createAsyncThunk(
  "chatrooms/addNewChatroom",
  async (payload: AddNewChatroomPayload, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentChatrooms = currentState.chatroom.chatrooms;

    const objectsEqual = (c1: Contact, c2: Contact): boolean => {
      return (
        c1.id === c2.id &&
        c1.display_name === c2.display_name
      );
    };

    const arraysEqual = (a1: Contact[], a2: Contact[]) => {
      const sortedA1 = [...a1].sort((o1, o2) => o1.id.localeCompare(o2.id));
      const sortedA2 = [...a2].sort((o1, o2) => o1.id.localeCompare(o2.id));

      return (
        sortedA1.length === sortedA2.length &&
        sortedA1.every((o, idx) => objectsEqual(o, sortedA2[idx]))
      );
    };

    // Validate if new chatroom exists

    try {
      const { data: membersOfExistingChatrooms, error } = await supabase
        .from("chatrooms")
        .select("members");

      if (error) throw error;

      const doesChatroomExist = membersOfExistingChatrooms.some((chatroom) =>
        arraysEqual(payload.members, chatroom.members)
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

      const newChatroomList = [...currentChatrooms, newChatroom[0]];

      return newChatroomList as Chatroom[];
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
      (
        state,
        action: PayloadAction<
          Chatroom[] | undefined,
          string,
          { arg: void; requestId: string; requestStatus: "fulfilled" },
          never
        >
      ) => {
        (state.loading = false),
          (state.chatrooms = action.payload || []),
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
