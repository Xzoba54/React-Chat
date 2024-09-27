import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import { axiosPrivate } from "../../utils/axios.ts";
import useAuth from "../../hooks/useAuth.ts";

import Chat from "./Chat.tsx";
import Search from "./Search.tsx";
import Loading from "../Loading.tsx";
import { useNavigate } from "react-router-dom";

export interface Member {
  id: string;
  created_at: string;
  profile: {
    name: string;
    imageUrl: string;
    status?: string;
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
  id: string;
  senderId: string;
  content: string;
  isDeleted: boolean;
  type: string;
  created_At: string;
}

interface SocketMessage {
  id: string;
  content: string;
  type: string;
  senderId: string;
}

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { auth } = useAuth();
  const navigate = useNavigate();

  if (!auth) return null;
  const socket: Socket = io(import.meta.env.VITE_API_URL, { auth: { id: auth.id } });

  const sortChats = (chats: Chat[]): Chat[] => {
    return chats.sort((a, b) => {
      const aDate = a.lastMessage ? new Date(a.lastMessage.created_At) : new Date(a.created_at);
      const bDate = b.lastMessage ? new Date(b.lastMessage.created_At) : new Date(b.created_at);

      return bDate.getTime() - aDate.getTime();
    });
  };

  const fetchChats = async () => {
    try {
      const res = await axiosPrivate.get(`/user/${auth.id}/chats`);
      const data = res.data as Chat[];

      const chats = sortChats(data as Chat[]);

      setChats(chats);
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };

  const addChat = (newChat: Chat) => {
    setChats((prev) => {
      const chats = sortChats([newChat, ...prev]);

      return chats;
    });
  };

  useEffect(() => {
    fetchChats();

    socket.on("new-message", ({ message, chatId }: { message: SocketMessage; chatId: string }) => {
      setChats((prev) => {
        const updatedChats = prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                lastMessage: {
                  id: message.id,
                  content: message.content,
                  isDeleted: false,
                  senderId: message.senderId,
                  type: message.type,
                  created_At: new Date().toISOString(),
                },
              }
            : chat,
        );

        return sortChats(updatedChats);
      });
      setChats((prev) => prev.map((chat: Chat) => (chat.id === chatId ? { ...chat, lastMessage: { id: message.id, content: message.content, senderId: message.senderId, type: message.type, isDeleted: false, created_At: new Date().toISOString() } } : chat)));
    });

    socket.on("delete-message", (messageId: string) => {
      setChats((prev) => prev.map((chat: Chat) => (chat.lastMessage?.id === messageId ? { ...chat, lastMessage: { ...chat.lastMessage, isDeleted: true } } : chat)));
    });

    return () => {
      socket.off("new-message");
      socket.off("delete-message");
    };
  }, [navigate]);

  if (!chats) return null;

  return (
    <div className="chats">
      <Search handleAddChat={addChat} search={search} setSearch={setSearch} />

      {isLoading ? (
        <Loading />
      ) : (
        <div className="list">
          {chats.map((chat, index: number) => {
            const match = chat.members.some((member) => member.profile.name.toLowerCase().includes(search.trim().toLowerCase()));

            if (match || chat.name?.toLocaleLowerCase().includes(search.trim().toLowerCase())) {
              return <Chat chat={chat} key={index} />;
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Chats;
