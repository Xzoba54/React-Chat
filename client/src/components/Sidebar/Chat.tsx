import { NavLink } from "react-router-dom";
import { Chat as ChatProps, Message } from "./Chats";

import ChatAvatar from "../ChatAvatar";
import { formatShortDate } from "../../utils/formatDate";
import formatName from "../../utils/formatName";
import useAuth from "../../hooks/useAuth";

const Chat = ({ chat }: { chat: ChatProps }) => {
  const { auth } = useAuth();

  if (!auth) return null;

  const formatLastMessage = (lastMessage: Message | undefined) => {
    let content = lastMessage ? lastMessage.content : "Started a new chat";

    const user = lastMessage ? chat.members.find((member) => member.id === lastMessage.senderId) : null;

    if (lastMessage && lastMessage.type === "Voice") content = `${user ? user.profile.name : ""} sent a voice message`;
    if (lastMessage && lastMessage.type === "Image") content = `${user ? user.profile.name : ""} sent an image`;
    if (lastMessage && lastMessage.isDeleted) content = `${user ? user.profile.name : ""} deleted message`;

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
          <span className="date text-name">{chat.lastMessage && formatShortDate(chat.lastMessage.created_At)}</span>
          <div className="pin">
            <span></span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default Chat;
