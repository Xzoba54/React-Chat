import { NavLink } from "react-router-dom";
import { Chat as ChatProps, Message } from "./Chats";

import ChatAvatar from "../ChatAvatar";
import formatDate from "../../utils/formatDate";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";

const Chat = ({ chat }: { chat: ChatProps }) => {
  const { auth } = useAuth();

  if (!auth) return null;

  const formatLastMessage = (lastMessage: Message | undefined) => {
    let content = lastMessage ? lastMessage.content : "Started a new chat";
    if (lastMessage && lastMessage.type === "Voice") content = "Sent a voice message";

    return <span className="text-name last-message text-clamp">{content}</span>;
  };

  return (
    <NavLink className={({ isActive }) => (isActive ? "active" : "")} to={`/chat/${chat.id}`}>
      <div className="listItem cursor-pointer">
        <ChatAvatar members={chat.members} />

        <div className="vertical-group">
          <span className="text-name name first-capitalize">{formatName(chat, auth.id)}</span>
          {formatLastMessage(chat.lastMessage)}
        </div>

        <div className="details">
          <span className="date text-name">{chat.lastMessage && formatDate(chat.lastMessage.created_At)}</span>
          <div className="pin">
            <span></span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Chat;
