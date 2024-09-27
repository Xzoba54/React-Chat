import { Chat, Member } from "../Sidebar/Chats";

type Props = {
  chat: Chat;
};

const SidebarList = ({ chat }: Props) => {
  return (
    <div className="chat-sidebar">
      <div className="list-header">
        <div className="separator">
          <span className="text-name">Online - {chat.members.length}</span>
        </div>
      </div>
      <div className="list">
        {chat.members.map((member: Member, index: number) => (
          <div className="item" key={index}>
            <img src={member.profile.imageUrl ? member.profile.imageUrl : "/defaultProfilePicture.jpg"} className="profile-pic" alt="Profile image" />
            <span className="text-name text-clamp">{member.profile.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarList;
