import { Chat } from "../components/Sidebar/Chats.tsx";

const formatName = (chat: Chat, authId: string) => {
  if (chat.name) {
    return chat.name;
  }

  const members = chat.members;

  return members
    .filter((member) => member.id !== authId)
    .map((member) => member.profile.name)
    .join(", ");
};

export default formatName;
