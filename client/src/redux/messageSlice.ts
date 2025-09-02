import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, Reaction } from "../utils/types";

interface MessagesState {
  messages: Message[];
}

const initialState: MessagesState = {
  messages: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },
    deleteMessage: (state, action: PayloadAction<{ id: string }>) => {
      state.messages = state.messages.map((message: Message) =>
        message.id === action.payload.id
          ? {
              ...message,
              isDeleted: true,
              parent: undefined,
            }
          : message,
      );
    },
    addReaction: (state, action: PayloadAction<Reaction>) => {
      state.messages = state.messages.map((message: Message) =>
        message.id === action.payload.messageId
          ? {
              ...message,
              reactions: message.reactions ? [...message.reactions, action.payload] : [action.payload],
            }
          : message,
      );
    },
    removeReaction: (state, action: PayloadAction<Reaction>) => {
      state.messages = state.messages.map((message: Message) =>
        message.id === action.payload.messageId
          ? {
              ...message,
              reactions: message.reactions?.filter((reaction: Reaction) => reaction.id !== action.payload.id) || [],
            }
          : message,
      );
    },
  },
});

export const { setMessages, addMessage, deleteMessage, addReaction, removeReaction } = messageSlice.actions;
export default messageSlice.reducer;
