import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";
import formatName from "../../utils/formatName";
import ChatAvatar from "../ChatAvatar";
import { Chat } from "../Sidebar/Chats";
import useAuth from "../../hooks/useAuth";

type Props = {
  chat: Chat;
};

const Header = ({ chat }: Props) => {
  const { auth } = useAuth();

  if (!auth) return null;

  return (
    <div className="header">
      <div className="horizontal-group">
        <ChatAvatar members={chat.members} />
        <span className="text-name name first-capitalize">{formatName(chat, auth.id)}</span>
      </div>

      <div className="icons">
        <div className="icon">
          <IoIosCall />
        </div>
        <div className="icon">
          <IoVideocam />
        </div>
        <div className="icon" style={{ transform: "rotate(45deg)" }}>
          <TbPinnedFilled />
        </div>
      </div>
    </div>
  );
};

export default Header;
