import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat, SocketMessage } from "../utils/types";

interface ChatsState {
  chats: Chat[];
}

const initialState: ChatsState = {
  chats: [],
};

const sortChats = (chats: Chat[]): Chat[] => {
  return chats.sort((a, b) => {
    const aDate = a.lastMessage ? new Date(a.lastMessage.created_At) : new Date(a.created_at);
    const bDate = b.lastMessage ? new Date(b.lastMessage.created_At) : new Date(b.created_at);

    return bDate.getTime() - aDate.getTime();
  });
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;

      state.chats = sortChats(state.chats);
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats = [action.payload, ...state.chats];
    },
    updateLastMessage: (state, action: PayloadAction<{ chatId: String; message: SocketMessage }>) => {
      state.chats = state.chats.map((chat: Chat) =>
        chat.id === action.payload.chatId
          ? {
              ...chat,
              lastMessage: {
                id: action.payload.message.id,
                content: action.payload.message.content,
                isDeleted: false,
                senderId: action.payload.message.senderId,
                type: action.payload.message.type,
                created_At: new Date().toISOString(),
              },
            }
          : chat
      );

      state.chats = sortChats(state.chats);
    },
    deleteLastMessage: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.map((chat: Chat) => (chat.lastMessage?.id === action.payload ? { ...chat, lastMessage: { ...chat.lastMessage, isDeleted: true } } : chat));

      state.chats = sortChats(state.chats);
    },
    deleteChat: (state, action: PayloadAction<{ id: string }>) => {
      state.chats = state.chats.filter((chat: Chat) => chat.id !== action.payload.id);
    },
  },
});

export const { setChats, addChat, updateLastMessage, deleteLastMessage, deleteChat } = chatsSlice.actions;
export default chatsSlice.reducer;
