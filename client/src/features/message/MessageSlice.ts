import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { supabase } from "../../SupabasePlugin";

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
  lastMessages: [number, string | null, string][];
  error: string;
}

interface AddMessagePayload {
  content: string;
}

const initialState: InitialState = {
  loading: false,
  messages: [],
  lastMessages: [],
  error: "",
};

export const getMessagesByChatroom = createAsyncThunk(
  "messages/getMessagesByChatroom",
  async (_, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentSelectedChatroom = currentState.chatroom.selectedChatroom;

    try {
      const { data: messages, error } = await supabase
        .from("messages")
        .select("id, content, sender_display_name, chatroom_id, created_at")
        .eq("chatroom_id", currentSelectedChatroom?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return messages;
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const getLastMessagesByChatroom = createAsyncThunk(
  "messages/getLastMessagesByChatroom",
  async (_, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentChatrooms = currentState.chatroom.chatrooms;

    try {
      const promises = currentChatrooms.map(async (chatroom) => {
        const { data: messages, error } = await supabase
          .from("messages")
          .select("content, sender_display_name")
          .eq("chatroom_id", chatroom.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        const result: [number, string | null, string] = [
          chatroom.id,
          messages?.sender_display_name,
          messages?.content,
        ];

        return result;
      });

      const lastMessages = await Promise.all(promises);

      return lastMessages;
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
    builder.addCase(getLastMessagesByChatroom.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getLastMessagesByChatroom.fulfilled,
      (state, action: PayloadAction<[number, string | null, string][]>) => {
        state.loading = false;
        state.lastMessages = action.payload;
        state.error = "";
      }
    );
    builder.addCase(getLastMessagesByChatroom.rejected, (state, action) => {
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
