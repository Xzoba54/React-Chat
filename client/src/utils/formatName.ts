import { Chat } from "../components/Sidebar/Chats.tsx";

const formatName = (chat: Chat, authId: string) => {
  if (chat.name) {
    return chat.name;
  }

  const members = chat.members;
  if (members.length == 2) {
    return members.map((member) => member.id !== authId && member.profile.name);
  }

  return members.map((member) => member.profile.name).join(", ");
};

export default formatName;
