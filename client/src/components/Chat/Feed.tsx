import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

import { Chat, Member, Message, Reaction } from "../../utils/types";
import { addMessage, addReaction, deleteMessage, removeReaction, setMessages } from "../../redux/messageSlice";
import { RootState } from "../../redux/store";
import { formatFullDate, onTheSameDay } from "../../utils/formatDate";
import { api } from "../../utils/axios";

import useAuth from "../../hooks/useAuth";

import MessageComponent from "./Message";
import Controls from "./Controls";

type Props = {
  chat: Chat;
};

const Feed = ({ chat }: Props) => {
  const messages = useSelector((action: RootState) => action.messages.messages);
  const socketRef = useRef<Socket>();

  const [reply, setReply] = useState<Message>();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const { auth } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth) return;

    socketRef.current = io(import.meta.env.VITE_API_URL, { auth: { id: auth.id } });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [auth]);

  if (!auth) return null;

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/chat/${chat.id}/messages`);

      dispatch(setMessages(data));
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!socketRef.current) return;

    socketRef.current.emit("join-chat", chat.id);

    socketRef.current.on("receive-message", (message: Message) => {
      dispatch(addMessage(message));
    });

    socketRef.current.on("receive-add-reaction", (reaction: Reaction) => {
      dispatch(addReaction(reaction));
    });

    socketRef.current.on("receive-remove-reaction", (reactionToRemove: Reaction) => {
      dispatch(removeReaction(reactionToRemove));
    });

    socketRef.current.on("delete-message", (messageId: string) => {
      dispatch(deleteMessage({ id: messageId }));
    });

    return () => {
      socketRef.current?.off("receive-message");
      socketRef.current?.off("receive-add-reaction");
      socketRef.current?.off("receive-remove-reaction");
      socketRef.current?.off("delete-message");
    };
  }, [chat.id]);

  useEffect(() => {
    handleAlignChat();
  }, [chat, messages]);

  const handleAlignChat = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scroll({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="feed">
      <div className="list" ref={messagesContainerRef}>
        {messages.map((message: Message, index: number) => {
          const sender = chat.members.find((member) => member.id === message.senderId);
          const parentSender = message.parent && chat.members.find((member) => member.id === message.parent?.senderId);
          const firstMessage = index === 0 || messages[index - 1].senderId !== message.senderId;
          const alignEnd = message.senderId === auth.id;
          const extended = firstMessage || message.type === "Image" || Boolean(message.parent);
          const separator = index != 0 && !onTheSameDay(message.created_At, messages[index - 1].created_At);

          if (!sender) return null;

          return (
            <React.Fragment key={index}>
              {separator && (
                <div className="separator">
                  <span>{formatFullDate(message.created_At)}</span>
                </div>
              )}

              <MessageComponent setReply={setReply} alignEnd={alignEnd} extended={extended || separator} message={message} sender={sender} parentSender={parentSender} key={index} />
            </React.Fragment>
          );
        })}
      </div>

      <Controls setReply={setReply} chatId={chat.id} reply={reply} sender={chat.members.find((member: Member) => member.id === reply?.senderId)} />
    </div>
  );
};

export default Feed;
