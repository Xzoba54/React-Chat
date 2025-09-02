import { useState } from "react";
import { Chat } from "../../utils/types";

import formatName from "../../utils/formatChatName";
import useAuth from "../../hooks/useAuth";

import { IoIosCall } from "react-icons/io";
import { IoVideocam, IoPersonAddSharp } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";

import Search from "../Sidebar/Search";
import Avatar from "../Avatar";

import { HiDotsCircleHorizontal } from "react-icons/hi";

type Props = {
  chat: Chat;
  handleToggleSidebar: () => void;
};

const Header = ({ chat, handleToggleSidebar }: Props) => {
  const [search, setSearch] = useState<string>("");

  const { auth } = useAuth();

  if (!auth) return null;

  return (
    <div className="header">
      <Avatar members={chat.members} />
      <span className="chat-name">{formatName(chat, auth.id)}</span>

      <div className="icons">
        <div className="item">
          <IoIosCall />
        </div>
        <div className="item">
          <IoVideocam />
        </div>
        <div className="item">
          <TbPinnedFilled style={{ transform: "rotate(45deg)" }} />
        </div>
        <div className="item">
          <IoPersonAddSharp />
        </div>
      </div>

      <Search search={search} setSearch={setSearch} />
      <div className="icons">
        <div className="item" onClick={handleToggleSidebar}>
          <HiDotsCircleHorizontal />
        </div>
      </div>
    </div>
  );
};

export default Header;

// import { IoIosCall } from "react-icons/io";
// import { IoVideocam } from "react-icons/io5";
// import { TbPinnedFilled } from "react-icons/tb";
// import formatName from "../../utils/formatChatName";
// import ChatAvatar from "../ChatAvatar";
// import { Chat } from "../Sidebar/Chats";
// import useAuth from "../../hooks/useAuth";

// type Props = {
//   chat: Chat;
// };

// const Header = ({ chat }: Props) => {
//   const { auth } = useAuth();

//   if (!auth) return null;

//   return (
//     <div className="header">
//       <div className="horizontal-group">
//         <ChatAvatar members={chat.members} />
//         <span className="text-name name first-capitalize">{formatName(chat, auth.id)}</span>
//       </div>

//       <div className="icons">
//         <div className="icon">
//           <IoIosCall />
//         </div>
//         <div className="icon">
//           <IoVideocam />
//         </div>
//         <div className="icon" style={{ transform: "rotate(45deg)" }}>
//           <TbPinnedFilled />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;
