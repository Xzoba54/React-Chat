import { Member } from "../components/Sidebar/Chats";
import useAuth from "../hooks/useAuth";

const ChatAvatar = ({ members }: { members: Member[] }) => {
  const { auth } = useAuth();

  if (!auth || !members) return null;

  if (members.length == 2) {
    return members.map((member: Member, index: number) => {
      if (member.id != auth.id) {
        return <img src={member.profile.imageUrl || "/defaultProfilePicture.jpg"} alt="profile image" className="profile-pic" key={index} />;
      }
    });
  }

  return (
    <div className="profile-pic-group">
      <img src={members[0].profile.imageUrl || "/defaultProfilePicture.jpg"} alt="profile image" className="profile-pic" />
      <div className="image-gap">
        <div className="profile-pic-container">
          <img src={members[0].profile.imageUrl || "/defaultProfilePicture.jpg"} alt="profile image" className="profile-pic" />

          <div className="status-icon-container">
            <div className="status-icon"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAvatar;
