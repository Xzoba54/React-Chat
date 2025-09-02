import { NavLink, useNavigate } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

import Header from "./Header";
import Search from "./Search";
import ChatComponent from "./Chat";
import NewChat from "../Modals/NewChat";

import { Chat, SocketMessage } from "../../utils/types";
import { api } from "../../utils/axios";
import useAuth from "../../hooks/useAuth";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setChats, addChat, deleteLastMessage, updateLastMessage, deleteChat } from "../../redux/chatSlice";

import { BsPeople } from "react-icons/bs";
import { BiEnvelope } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

const Sidebar = () => {
  const [search, setSearch] = useState<string>("");
  const [createNewChat, setCreateNewChat] = useState<boolean>(false);

  const chats = useSelector((state: RootState) => state.chats.chats);

  const { auth } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!auth) return null;
  const socket: Socket = io(import.meta.env.VITE_API_URL, {
    auth: { id: auth.id },
  });

  const fetchChats = async () => {
    try {
      const res = await api.get(`/user/${auth.id}/chats`);
      const data = res.data as Chat[];

      dispatch(setChats(data));
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleAddChat = (newChat: Chat) => {
    dispatch(addChat(newChat));
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket.on("new-message", ({ message, chatId }: { message: SocketMessage; chatId: string }) => {
      dispatch(updateLastMessage({ chatId, message }));
    });

    socket.on("delete-message", (messageId: string) => {
      dispatch(deleteLastMessage(messageId));
    });

    socket.on("create-chat", (chat: Chat) => {
      dispatch(addChat(chat));
    });

    socket.on("delete-chat", (chatId: string) => {
      dispatch(deleteChat({ id: chatId }));
    });

    return () => {
      socket.off("new-message");
      socket.off("delete-message");
      socket.off("create-chat");
      socket.off("delete-chat");
    };
  }, [navigate]);

  return (
    <div className="sidebar">
      <Header />
      <List />

      <div className="search-container">
        <Search search={search} setSearch={setSearch} />
        <div className="button" onClick={() => setCreateNewChat((prev) => !prev)}>
          <IoMdAdd />
        </div>

        {createNewChat && <NewChat handleSetModalOpen={setCreateNewChat} handleAddChat={handleAddChat} />}
      </div>

      <div className="chat-list">
        {chats.map((chat: Chat, index: number) => {
          const matchChatName = chat.name?.trim().toLocaleLowerCase().includes(search.trim().toLowerCase());
          const matchUsersName = chat.members.some((member) => member.profile.name.toLowerCase().includes(search.trim().toLowerCase()));

          if (matchChatName || matchUsersName) {
            return <ChatComponent chat={chat} key={index} />;
          }
        })}
      </div>
    </div>
  );
};

interface ItemListProp {
  link: string;
  name: string;
  icon: ReactElement;
}

const itemList: ItemListProp[] = [
  {
    link: "/",
    name: "Friends",
    icon: <BsPeople />,
  },
  {
    link: "/requests",
    name: "Requests",
    icon: <BiEnvelope />,
  },
  {
    link: "/notifications",
    name: "Notifications",
    icon: <IoNotificationsOutline />,
  },
];

const List = () => {
  return (
    <div className="menu-list">
      {itemList.map((item: ItemListProp, index: number) => (
        <NavLink to={item.link} key={index}>
          <div className="item">
            {item.icon}
            <span className="name">{item.name}</span>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
