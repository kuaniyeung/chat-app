import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Contact } from "../contact/contactSlice";
import { supabase } from "../../SupabasePlugin";
import type { RootState } from "../../app/store";

interface LastMessage {
  sender_display_name: string | null;
  content: string | null;
  created_at: string | null;
}
export interface Chatroom {
  id: number;
  name?: string;
  alerted: boolean;
  members: Contact[];
  lastMessage: LastMessage;
}

interface InitialState {
  selectedChatroom: Chatroom | null;
  alertedChatrooms: number;
  loading: boolean; 
  chatrooms: Chatroom[];
  error: string;
}

interface AddNewChatroomPayload {
  name?: string;
  members: Contact[];
}

const initialState: InitialState = {
  selectedChatroom: null,
  alertedChatrooms: 0,
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

      chatrooms = chatroomsData.map((chatroomData: any) => ({
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
        const { data: memberData, error: chatroomError } = await supabase
          .from("chatrooms_members")
          .select("member_id, users!inner(display_name)")
          .eq("chatroom_id", chatroom.id);

        if (chatroomError) throw chatroomError;

        const { data: lastMessageData, error: lastMessageError } =
          await supabase
            .from("messages")
            .select("content, sender_display_name, created_at")
            .eq("chatroom_id", chatroom.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (lastMessageError) throw lastMessageError;

        if (!lastMessageData?.content) {
          const { data: chatroomData, error: chatroomError } = await supabase
            .from("chatrooms")
            .select("created_at")
            .eq("id", chatroom.id)
            .maybeSingle();

          if (chatroomError) throw chatroomError;

          return {
            id: chatroom.id,
            name: chatroom.name,
            alerted: false,
            members: memberData?.map((member: any) => ({
              id: member.member_id,
              display_name: member.users.display_name,
            })),
            lastMessage: {
              sender_display_name: null,
              content: null,
              created_at: chatroomData?.created_at,
            },
          };
        }

        return {
          id: chatroom.id,
          name: chatroom.name,
          alerted: false,
          members: memberData?.map((member: any) => ({
            id: member.member_id,
            display_name: member.users.display_name,
          })),
          lastMessage: {
            sender_display_name: lastMessageData?.sender_display_name,
            content: lastMessageData?.content,
            created_at: lastMessageData?.created_at,
          },
        };
      });

      chatrooms = await Promise.all(promises);

      return chatrooms as Chatroom[];
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Fetch last message in chatrooms
  }
);

export const addNewChatroom = createAsyncThunk(
  "chatrooms/addNewChatroom",
  async (payload: AddNewChatroomPayload, { rejectWithValue, getState }) => {
    const currentState: RootState = getState() as RootState;
    const currentChatrooms = currentState.chatroom.chatrooms;
    const membersOfCurrentChatrooms = currentChatrooms.map(
      (chatroom) => chatroom.members
    );

    const objectsEqual = (c1: Contact, c2: Contact): boolean => {
      return c1.id === c2.id && c1.display_name === c2.display_name;
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
      const doesChatroomExist = membersOfCurrentChatrooms.some((chatroom) =>
        arraysEqual(payload.members, chatroom)
      );

      if (doesChatroomExist) throw new Error("Chatroom already exists");
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Add new chatroom

    let newChatroom: Chatroom = {
      id: 0,
      name: "",
      alerted: false,
      members: [],
      lastMessage: {
        sender_display_name: null,
        content: null,
        created_at: null,
      },
    };

    try {
      const { data, error } = await supabase
        .from("chatrooms")
        .insert([{ name: payload.name }])
        .select("id, name, created_at");

      if (error) throw error;

      newChatroom = {
        ...newChatroom,
        id: data[0].id,
        name: data[0].name,
        lastMessage: {
          ...newChatroom.lastMessage,
          created_at: data[0].created_at,
        },
      };
    } catch (error) {
      return rejectWithValue(error as Error);
    }

    // Add new chatroom members

    try {
      const promises: Promise<
        | {
            member_id: any;
            users: {
              display_name: any;
            }[];
          }[]
        | null
      >[] = payload.members.map(async (member: any) => {
        const { data, error } = await supabase
          .from("chatrooms_members")
          .insert([{ chatroom_id: newChatroom.id, member_id: member.id }]);

        if (error) throw error;

        return data;
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        return console.error(error);
      }

      newChatroom = { ...newChatroom, members: payload.members };

      return newChatroom as Chatroom;
    } catch (error) {
      return console.error(error);
    }
  }
);

export const chatroomSlice = createSlice({
  name: "chatroom",
  initialState,
  reducers: {
    setSelectedChatroom: (state, action) => {
      state.selectedChatroom = action.payload;
    },
    setNewChatroom: (state, action) => {
      state.chatrooms = [...state.chatrooms, action.payload];
    },
    setAlerted: (state, action) => {
      const { chatroom_id, alerted } = action.payload;

      if (alerted) {
        state.alertedChatrooms ++
      } else {
        state.alertedChatrooms --
      }

      const chatroomIndex = state.chatrooms.findIndex(
        (chatroom) => chatroom.id === chatroom_id
      );

      if (chatroomIndex !== -1) {
        state.chatrooms[chatroomIndex] = {
          ...state.chatrooms[chatroomIndex],
          alerted,
        };
      }

      // console.log(state.chatrooms[chatroomIndex]);
    },
    setLastMessage: (state, action) => {
      const { chatroom_id, sender_display_name, content, created_at } =
        action.payload;

      const chatroomIndex = state.chatrooms.findIndex(
        (chatroom) => chatroom.id === chatroom_id
      );

      if (chatroomIndex !== -1) {
        state.chatrooms[chatroomIndex] = {
          ...state.chatrooms[chatroomIndex],
          lastMessage: {
            sender_display_name,
            content,
            created_at,
          },
        };
      }
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
      (
        state,
        action: PayloadAction<
          Chatroom | void,
          string,
          {
            arg: AddNewChatroomPayload;
            requestId: string;
            requestStatus: "fulfilled";
          },
          never
        >
      ) => {
        if (action.payload) {
          state.loading = false;
          state.chatrooms = [...state.chatrooms, action.payload];
          state.error = "";
        }
      }
    );
    builder.addCase(addNewChatroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Something went wrong";
    });
  },
});

export default chatroomSlice.reducer;
export const {
  setSelectedChatroom,
  setNewChatroom,
  setAlerted,
  setLastMessage,
} = chatroomSlice.actions;
