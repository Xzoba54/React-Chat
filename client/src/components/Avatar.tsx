import useAuth from "../hooks/useAuth";
import { Member } from "../utils/types";

type Props = {
  members: Member[];
};

const Avatar = ({ members }: Props) => {
  const { auth } = useAuth();

  if (!auth || !members) return null;

  const filteredMembers = members.filter((member) => member.id !== auth.id);
  let avatars = filteredMembers.map((member) => (member.profile.imageUrl ? member.profile.imageUrl : "/defaultProfilePicture.jpg"));

  if (members.length == 1) {
    avatars = [members[0].profile.imageUrl || "/defaultProfilePicture.jpg"];
  }

  if (members.length <= 2) {
    return (
      <div className="avatar">
        <img src={avatars[0]} alt="" />

        <div className="status" />
      </div>
    );
  }

  if (members.length >= 3) {
    return (
      <div className="avatar avatar-group">
        <img src={avatars[0]} alt="" />
        <img src={avatars[1]} alt="" />
      </div>
    );
  }
};

export default Avatar;
