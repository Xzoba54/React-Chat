import { NavLink } from "react-router-dom";

import { Chat as ChatProps, Message } from "../../utils/types";
import { formatShortDate } from "../../utils/formatDate";
import formatChatName from "../../utils/formatChatName";

import useAuth from "../../hooks/useAuth";

import Avatar from "../Avatar";

type Props = {
  chat: ChatProps;
};

const FormatLastMessage = ({ chat, message }: { chat: ChatProps; message: Message }) => {
  const user = chat.members.find((member) => member.id === message.senderId);
  if (!user) return message.content;

  const prefix = `${user.profile.name}: `;
  let action = message.content;

  if (message.isDeleted) {
    action = "Deleted message";
  }
  if (message.type === "Voice") {
    action = "Sent a voice message";
  }
  if (message.type === "Image") {
    action = "Sent an image";
  }

  return (
    <>
      <strong>{prefix}</strong>
      <span>{action}</span>
    </>
  );
};

const Chat = ({ chat }: Props) => {
  const { auth } = useAuth();

  if (!auth) return null;

  return (
    <NavLink className={({ isActive }) => (isActive ? "active" : "")} to={`/chat/${chat.id}`}>
      <div className="item">
        <Avatar members={chat.members} />

        <div className="col">
          <span className="name text-clamp">{formatChatName(chat, auth.id)}</span>
          {chat.lastMessage && (
            <span className="last-message text-clamp">
              <FormatLastMessage chat={chat} message={chat.lastMessage} />
            </span>
          )}
        </div>

        <div className="details">
          {chat.lastMessage && <span className="date">{formatShortDate(chat.lastMessage.created_At)}</span>}
          <div className="pin" />
        </div>
      </div>
    </NavLink>
  );
};

export default Chat;
