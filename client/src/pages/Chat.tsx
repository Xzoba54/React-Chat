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

      setMessages(data as Message[]);
    } catch (e: any) {
      console.log(e);
    }
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

    socket.on("receive-remove-reaction", (reaction: Reaction) => {
      setMessages((prev) => prev.map((message: Message) => (message.id === reaction.messageId ? { ...message, reactions: message.reactions ? message.reactions.filter((_reaction: Reaction) => _reaction.id !== reaction.id) : [] } : message)));
    });

    return () => {
      socket.off("receive-message");
      socket.off("receive-add-reaction");
      socket.off("receive-remove-reaction");
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

              return <TextMessage handleSetReply={setReply} sender={sender} firstMessage={firstMessage} lastMessage={lastMessage} message={message} key={index} />;
            })}
          </div>

          <ChatControl chatId={id} reply={reply} handleSetReply={setReply} />
        </div>

        <Sidebar chatId={id} member={chat.members.find((member) => member.id !== auth.id)} />
      </div>
    </div>
  );
};

export default Chat;
