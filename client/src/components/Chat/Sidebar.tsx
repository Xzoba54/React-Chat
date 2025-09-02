import useAuth from "../../hooks/useAuth";
import { Member } from "../Sidebar/Chats";
import SingleChatInfo from "./SingleChatInfo";

type Props = {
  members: Member[];
  chatId: string;
};

const Sidebar = ({ members, chatId }: Props) => {
  const { auth } = useAuth();

  if (!auth) return null;

  const member = members.find((member) => member.id != auth.id);
  if (!member) {
    return null;
  }

  return <SingleChatInfo key={chatId} chatId={chatId} member={member} />;
};

export default Sidebar;
