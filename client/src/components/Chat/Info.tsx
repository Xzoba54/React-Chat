import useAuth from "../../hooks/useAuth";
import { formatFullDate } from "../../utils/formatDate";
import formatName from "../../utils/formatName";
import ChatAvatar from "../ChatAvatar";
import { Chat } from "../Sidebar/Chats";

type Props = {
  chat: Chat;
};

const Info = ({ chat }: Props) => {
  const { auth } = useAuth();

  if (!auth) return null;

  return (
    <div className="info">
      <ChatAvatar members={chat.members} />

      <span className="text-name">{formatName(chat, auth.id)}</span>
      <span className="text-name date">Chat created on {formatFullDate(chat.created_at)}</span>
    </div>
  );
};

export default Info;
