import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../SupabasePlugin";
import { RootState } from "../../app/store";

export interface Message {
  id: number | null;
  content: string;
  sender_display_name: string;
  chatroom_id: number;
  created_at: string;
}

interface InitialState {
  loading: boolean;
  messages: Message[];
  error: string;
}

interface AddMessagePayload {
  content: string;
}

interface GetMessagesByChatroomPayload {
  chatroom_id: number
}

const initialState: InitialState = {
  loading: false,
  messages: [],
  error: "",
};

export const getMessagesByChatroom = createAsyncThunk(
  "messages/getMessagesByChatroom",
  async (payload: GetMessagesByChatroomPayload, { rejectWithValue }) => {

    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("id, content, sender_display_name, chatroom_id, created_at")
        .eq("chatroom_id", payload.chatroom_id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return messages;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const addNewMessage = createAsyncThunk(
  "messages/addNewMessage",
  async (payload: AddMessagePayload, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentUser = currentState.user.user;
    const currentSelectedChatroom = currentState.chatroom.selectedChatroom;

    try {
      if (!currentSelectedChatroom) throw new Error("Select a chatroom.");

      const { error } = await supabase.from("messages").insert([
        {
          content: payload.content,
          sender_display_name: currentUser.display_name,
          chatroom_id: currentSelectedChatroom.id,
        },
      ]);

      if (error) throw error;

      return;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setNewMessage: (state, action) => {
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessagesByChatroom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getMessagesByChatroom.fulfilled,
      (state, action: PayloadAction<Message[]>) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = "";
      }
    );
    builder.addCase(getMessagesByChatroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
    builder.addCase(addNewMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewMessage.fulfilled, (state) => {
      (state.loading = false), (state.error = "");
    });
    builder.addCase(addNewMessage.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default messageSlice.reducer;
export const { setNewMessage } = messageSlice.actions;
