import { FaBan } from "react-icons/fa";
import { FaPaintBrush } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { Member } from "../Sidebar/Chats";
import { formatFullDate } from "../../utils/formatDate";
import { axiosPrivate } from "../../utils/axios";
import { useNavigate } from "react-router-dom";

type Props = {
  member?: Member;
  chatId: string;
};

const Sidebar = ({ member, chatId }: Props) => {
  if (!member) return null;

  const navigate = useNavigate();

  const handleDeleteChat = async () => {
    try {
      await axiosPrivate.delete(`/chat/${chatId}`);

      navigate("/");
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <img src={member.profile.imageUrl || "/defaultProfilePicture.jpg"} alt="Profile image" className="profile-pic" />
        <span className="text-name text-clamp">{member.profile.name}</span>
      </div>

      <div className="info">
        {member.profile.status && (
          <div className="section">
            <div className="headline text-name">About Me</div>
            <div className="content text-name">{member.profile.status}</div>
          </div>
        )}
        <div className="section">
          <span className="headline text-name">Member Since</span>
          <span className="content text-name">{formatFullDate(member.created_at)}</span>
        </div>
      </div>

      <div className="options">
        <div className="item-button">
          <FaPaintBrush />
          <span className="text-name no-select">Change Theme</span>
        </div>
        <div className="item-button button-warning">
          <FaBan />
          <span className="text-name no-select">Block</span>
        </div>
        <div className="item-button button-warning" onClick={handleDeleteChat}>
          <FaTrashCan />
          <span className="text-name no-select">Delete Chat</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
