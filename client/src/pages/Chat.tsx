import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import { axiosPrivate } from "../utils/axios";
import useAuth from "../hooks/useAuth";

import { Chat as ChatProps } from "../components/Sidebar/Chats.tsx";

import ChatControl from "../components/ChatControl.tsx";

import Sidebar from "../components/Chat/Sidebar.tsx";
import Header from "../components/Chat/Header.tsx";
import TextMessage from "../components/Chat/Message.tsx";
import Info from "../components/Chat/Info.tsx";
import { formatFullDate } from "../utils/formatDate.ts";
import React from "react";
import SidebarList from "../components/Chat/SidebarList.tsx";

export interface Reaction {
  id: string;
  userId: string;
  messageId: string;
  emoji: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  type: string;
  parent?: Message;
  reactions?: Reaction[];
  created_At: string;
}

const Chat = () => {
  const [chat, setChat] = useState<ChatProps>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [reply, setReply] = useState<Message>();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const { auth } = useAuth();

  if (!auth) return null;
  const socket: Socket = io(import.meta.env.VITE_API_URL, { auth: { id: auth.id } });

  const joinChat = () => {
    socket.emit("join-chat", id);
  };

  const fetchChat = async () => {
    try {
      const { data } = await axiosPrivate.get(`/chat/${id}`);

      setChat(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axiosPrivate.get(`/chat/${id}/messages`);

      setMessages(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  const onTheSameDay = (date1: string, date2: string): boolean => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDay() === d2.getDay();
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scroll({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    window.document.title = `Chat | ${chat?.members.map((member) => " " + member.profile.name)}`;
  }, [chat, messages]);

  useEffect(() => {
    joinChat();

    fetchChat();
    fetchMessages();

    socket.on("receive-message", (msg: Message) => {
      const message: Message = {
        ...msg,
        created_At: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
    });

    socket.on("receive-add-reaction", (reaction: Reaction) => {
      setMessages((prev) => prev.map((message: Message) => (message.id === reaction.messageId ? { ...message, reactions: message.reactions ? [...message.reactions, reaction] : [reaction] } : message)));
    });

    socket.on("receive-remove-reaction", (reactionToRemove: Reaction) => {
      setMessages((prevMessages) => {
        const updatedMessages = prevMessages.map((message) =>
          message.id === reactionToRemove.messageId
            ? {
                ...message,
                reactions: message.reactions?.filter((reaction) => reaction.id !== reactionToRemove.id) || [],
              }
            : message,
        );
        return updatedMessages;
      });
    });

    socket.on("delete-message", (messageId: string) => {
      setMessages((prev) => prev.map((message: Message) => (message.id === messageId ? { ...message, isDeleted: true } : message)));
    });

    return () => {
      socket.off("receive-message");
      socket.off("receive-add-reaction");
      socket.off("receive-remove-reaction");
      socket.off("delete-message");
    };
  }, [id]);

  if (!chat || !messages || !id) return null;

  return (
    <div className="chat">
      <Header chat={chat} />

      <div className="layout">
        <div className="content">
          <div ref={chatContainerRef} className="messages" style={{ height: "100%" }}>
            <Info chat={chat} />

            <div className="separator">
              <span className="text-name">{formatFullDate(chat.created_at)}</span>
            </div>

            {messages.map((message: Message, index: number) => {
              const sender = chat.members.find((member) => member.id === message.senderId);
              const firstMessage = index - 1 >= 0 && messages[index - 1].senderId !== message.senderId;
              const lastMessage = (index + 1 < messages.length && message.senderId !== messages[index + 1].senderId) || messages.length === index + 1;

              if (index - 1 >= 0 && !onTheSameDay(message.created_At, messages[index - 1].created_At)) {
                return (
                  <React.Fragment key={index}>
                    <div className="separator">
                      <span className="text-name">{formatFullDate(message.created_At)}</span>
                    </div>
                    <TextMessage handleSetReply={setReply} sender={sender} firstMessage={firstMessage} lastMessage={lastMessage} message={message} />
                  </React.Fragment>
                );
              }

              return <TextMessage handleSetReply={setReply} sender={sender} firstMessage={firstMessage} lastMessage={lastMessage} message={message} key={index} />;
            })}
          </div>

          <ChatControl chatId={id} reply={reply} handleSetReply={setReply} />
        </div>

        {chat.members.length > 2 ? <SidebarList chat={chat} /> : <Sidebar chatId={id} member={chat.members.find((member) => member.id !== auth.id)} />}
      </div>
    </div>
  );
};

export default Chat;
