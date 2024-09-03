import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { axiosPrivate } from "../../utils/axios.ts";
import useAuth from "../../hooks/useAuth.ts";

//sidebar component
import Chat from "./Chat.tsx";
import Search from "./Search.tsx";
import Loading from "../Loading.tsx";

export interface Member {
  id: string;
  profile: {
    name: string;
    imageUrl: string;
  };
}

export interface Chat {
  id: string;
  name?: string;
  lastMessage?: Message;
  members: Member[];
  created_at: string;
}

export interface Message {
  content: string;
  type: string;
  created_At: string;
}

interface SocketMessage {
  content: string;
  type: string;
  senderId: string;
}

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { auth } = useAuth();

  if (!auth) return null;
  const socket: Socket = io("http://localhost:5000", { auth: { id: auth.id } });

  const fetchChats = async () => {
    try {
      const res = await axiosPrivate.get(`/user/${auth.id}/chats`);
      const data = res.data as Chat[];

      setChats(data);
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();

    socket.on("new-message", ({ message, chatId }: { message: SocketMessage; chatId: string }) => {
      setChats((prev) => prev.map((chat: Chat) => (chat.id === chatId ? { ...chat, lastMessage: { content: message.content, type: message.type, created_At: new Date().toISOString() } } : chat)));
    });

    return () => {
      socket.off("new-message");
    };
  }, []);

  if (!chats) return null;

  return (
    <div className="chats">
      <Search search={search} setSearch={setSearch} />

      {isLoading ? (
        <Loading />
      ) : (
        chats.map((chat, index: number) => {
          const match = chat.members.some((member) => member.profile.name.toLowerCase().includes(search.trim().toLowerCase()));

          if (match || chat.name?.toLocaleLowerCase().includes(search.trim().toLowerCase())) {
            return <Chat chat={chat} key={index} />;
          }
        })
      )}
    </div>
  );
};

export default Chats;
