import { useRef, useState } from "react";

import useAuth from "../../hooks/useAuth";
import { api } from "../../utils/axios";
import { formatFullDate, formatShortDate } from "../../utils/formatDate";
import { formatTime } from "../../utils/time";
import { Member, Message as MessageProps } from "../../utils/types";

import { TbDots } from "react-icons/tb";
import { MdAddReaction, MdEmojiEmotions, MdOutlineReply } from "react-icons/md";
import { IoReturnUpForward } from "react-icons/io5";

import Options from "./Options";
import ContextMenu from "../Modals/ContextMenu";
import ImageViewer from "../Modals/ImageViewer";
import { FaImage } from "react-icons/fa6";

type Props = {
  message: MessageProps;
  sender: Member;
  parentSender?: Member;
  extended: boolean;
  alignEnd: boolean;
  setReply: (reply: MessageProps) => void;
};

const EMOJI_LIST = ["❤", "😂", "😢", "🤡"];

const Message = ({ message, extended, sender, parentSender, alignEnd, setReply }: Props) => {
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [emojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

  const addReactionRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);

  const { auth } = useAuth();

  if (!auth) return null;

  const Content = () => {
    if (message.isDeleted) {
      return <span>{sender.profile.name} deleted message</span>;
    }

    if (message.type === "Image") {
      return <img onClick={openImageViewer} src={message.content} alt="image" />;
    }
    if (message.type === "Voice") {
      return <span>voice</span>;
    }

    return <span>{message.content}</span>;
  };

  const Reactions = () => {
    const reactions: Map<string, number> = new Map();

    if (!message.reactions || message.reactions.length === 0) return null;

    let active = false;
    for (const reaction of message.reactions) {
      if (reaction.userId === auth.id) active = true;

      reactions.set(reaction.emoji, (reactions.get(reaction.emoji) || 0) + 1);
    }

    return (
      <div className="reactions-layout">
        <div className="margin"></div>

        <div className="reactions">
          {[...reactions.entries()].map(([reaction, count], index: number) => (
            <div className={`reaction ${active ? "active" : ""}`} onClick={() => addReaction(reaction)} key={index}>
              <span>{reaction}</span>
              {count > 1 && <span className="count">{count}</span>}
            </div>
          ))}

          <div onClick={() => setEmojiPicker(true)} className="reaction">
            <MdEmojiEmotions />
          </div>
        </div>
      </div>
    );
  };

  const addReaction = async (reaction: string) => {
    try {
      await api.post(`/message/${message.id}/reaction`, {
        content: reaction,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const openImageViewer = () => {
    setShowImageViewer(true);
  };

  const handleToggleEmojiPicker = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEmojiPicker((prev) => !prev);
  };

  const handleToggleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContextMenu((prev) => !prev);
  };

  const handleOnMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEmojiPicker(false);
  };

  const Reply = () => {
    if (!message.parent) return null;

    if (message.parent.isDeleted) {
      return (
        <span>
          <strong>{parentSender?.profile.name}:</strong> Message deleted
        </span>
      );
    }

    if (message.parent.type === "Image") {
      return (
        <span>
          <strong>{parentSender?.profile.name}:</strong> <FaImage /> Image
        </span>
      );
    }

    return (
      <span>
        <strong>{parentSender?.profile.name}:</strong> {message.content}
      </span>
    );
  };

  return (
    <div onMouseLeave={handleOnMouseLeave} className={`message ${alignEnd ? "alignEnd" : ""} ${message.isDeleted ? "deleted" : ""}`}>
      {message.parent && (
        <div className="row">
          <div className="margin">
            <IoReturnUpForward />
          </div>

          <div className="name">
            <img className="image" src={parentSender?.profile.imageUrl ? parentSender.profile.imageUrl : "/defaultProfilePicture.jpg"} alt="Profile image" />
            <Reply />
          </div>
        </div>
      )}

      <div className="message-layout">
        <div className="margin">
          {extended ? (
            <div title={sender.profile.name} className="image-xl">
              <img src={sender.profile.imageUrl ? sender.profile.imageUrl : "/defaultProfilePicture.jpg"} alt="Profile image" />
            </div>
          ) : (
            <span className="date">{formatTime(message.created_At)}</span>
          )}
        </div>

        <div className="col">
          {extended && (
            <div className="row">
              <span className="name">{sender.profile.name}</span>
              <div className="circle" />
              <span className="date">{formatShortDate(message.created_At)}</span>
            </div>
          )}
          <div className="row">
            <div className="content" title={formatFullDate(message.created_At) + " at " + formatTime(message.created_At)}>
              <Content />
            </div>

            <div className="options">
              <div className="item" onClick={handleToggleEmojiPicker} ref={addReactionRef}>
                <MdAddReaction />
              </div>
              <div onClick={() => setReply(message)} className="item">
                <MdOutlineReply />
              </div>
              <div className="item" onClick={handleToggleContextMenu} ref={contextMenuRef}>
                <TbDots />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Reactions />

      {showImageViewer && <ImageViewer handleSetOpen={setShowImageViewer} message={message} />}
      {emojiPicker && (
        <ContextMenu setOpen={setEmojiPicker} buttonRef={addReactionRef}>
          <div className="reaction-picker">
            {EMOJI_LIST.map((reaction: string, index: number) => (
              <div onClick={() => addReaction(reaction)} className="reaction" key={index}>
                <span>{reaction}</span>
              </div>
            ))}
          </div>
        </ContextMenu>
      )}
      {showContextMenu && (
        <ContextMenu setOpen={setShowContextMenu} buttonRef={contextMenuRef}>
          <Options message={message} handleReply={setReply} />
        </ContextMenu>
      )}
    </div>
  );
};

export default Message;

// import { BsArrowReturnRight } from "react-icons/bs";
// import { formatShortDate } from "../../utils/formatDate";
// import { Member, Message as MessageProps } from "../../utils/types";

// type Props = {
//   message: MessageProps;
//   sender: Member;
//   firstMessage: boolean;
//   lastMessage: boolean;
//   alignEnd: boolean;
// };

// const Message = ({ message, sender, lastMessage, firstMessage, alignEnd }: Props) => {
//   return (
//     <div className={`message ${alignEnd ? "align-end" : ""}`}>
//       <div className="margin">
//         {firstMessage && (
//           <div className="image-xl">
//             <img src="/defaultProfilePicture.jpg" alt="Profile image" />
//           </div>
//         )}
//         {!firstMessage && <span className="margin-date">{formatShortDate(message.created_At)}</span>}
//       </div>

//       <div className="message-layout">
//         <div className="row">
//           {message.parent && (
//             <span className="reply">
//               <BsArrowReturnRight />
//               <span>{message.parent.content}</span>
//             </span>
//           )}
//           {!message.parent && firstMessage && <span className="reply">{sender.profile.name}</span>}
//           {firstMessage && <span className="date">{formatShortDate(message.created_At)}</span>}
//         </div>
//         <div className="row">
//           <div className="content">
//             <span>{message.content}</span>
//           </div>
//           xd
//         </div>
//         {/* {message.parent && lastMessage && <span className="date">{formatShortDate(message.created_At)}</span>} */}
//       </div>
//     </div>
//   );
// };

// export default Message;

// import useAuth from "../../hooks/useAuth";
// import { Message as MessageProps } from "../../utils/types";
// import { formatShortDate } from "../../utils/formatDate";
// import { Member } from "../Sidebar/Chats";

// import { MdAddReaction } from "react-icons/md";
// import { MdOutlineReply } from "react-icons/md";
// import { TbDotsVertical, TbPinnedFilled } from "react-icons/tb";
// import AudioPlayer from "./AudioPlayer";
// import { useRef, useState } from "react";
// import { api } from "../../utils/axios";

// import ImageViewer from "../Modals/ImageViewer";

// import MessageOptions from "./MessageOptions";
// import ReactDOM from "react-dom";

// type Props = {
//   message: MessageProps;
//   firstMessage: boolean;
//   lastMessage: boolean;
//   sender?: Member;
//   handleSetReply: (message: MessageProps) => void;
// };

// const pickerReactions = ["❤", "😂", "😢", "🤡"];

// const Message = ({ message, firstMessage, lastMessage, sender, handleSetReply }: Props) => {
//   const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
//   const [showOptionsDropdown, setShowOptionsDropdown] = useState<boolean>(false);

//   const root = document.getElementById("modal-layer");

//   const [showImage, setShowImage] = useState<boolean>(false);

//   const { auth } = useAuth();

//   if (!auth || !sender || !root) return null;

//   const isFromMe = (senderId: string, authId: string) => {
//     return senderId === authId;
//   };

//   const FormatReply = () => {
//     if (message.isDeleted) {
//       return <span className="text-name">{sender.profile.name} deleted message</span>;
//     }

//     if (message.type === "Voice") return <AudioPlayer message={message} />;
//     if (message.type === "Image") return <img onClick={() => setShowImage(true)} className="image" src={message.content} alt="Image" />;

//     return <span className="text-name">{message.content}</span>;
//   };

//   const Reactions = () => {
//     const reactions: Map<string, number> = new Map();

//     if (!message.reactions || message.reactions.length === 0) return null;

//     for (const reaction of message.reactions) {
//       reactions.set(reaction.emoji, (reactions.get(reaction.emoji) || 0) + 1);
//     }

//     return (
//       <div className="reactions cursor-default no-select">
//         {[...reactions.entries()].map(([reaction, count], index: number) => (
//           <div className="reaction" onClick={() => handleAddReaction(reaction)} key={index}>
//             <span className="emoji">{reaction}</span>
//             {count > 1 && <span className="count">{count}</span>}
//           </div>
//         ))}
//       </div>
//     );
//   };

// const handleAddReaction = async (reaction: string) => {
//   try {
//     await api.post(`/message/${message.id}/reaction`, {
//       content: reaction,
//     });

//     setShowReactionPicker(false);
//   } catch (e: any) {
//     console.log(e);
//   }
// };

//   const handleDeleteMessage = async () => {
//     try {
//       await api.delete(`/message/${message.id}`);
//     } catch (e: any) {
//       console.log(e);
//     }
//   };

//   const pinBtn = () => {};

//   const replyBtn = () => {};

//   const forwardBtn = () => {};

//   const copyBtn = () => {};

//   const handleOnMouseLeave = () => {
//     if (showReactionPicker) setShowReactionPicker(false);
//     if (showOptionsDropdown) setShowOptionsDropdown(false);
//   };

//   return (
//     <div className={`message ${isFromMe(message.senderId, auth.id) ? "align-end" : ""} ${message.isDeleted ? "deleted" : ""}`} onMouseLeave={handleOnMouseLeave}>
//       <div className="vertical-group">
//         {(message.parent || firstMessage) && (
//           <div className="row row-gap">
//             {message.parent && !message.isDeleted && <span className="reply text-name cursor-pointer">Reply: {message.parent.content}</span>}

//             {!message.parent && firstMessage && <span className="text-name no-select">{sender.profile.name}</span>}
//           </div>
//         )}

//         <div className="row">
//           <div className="profile-pic-container">{lastMessage && <img src={sender.profile.imageUrl || "/defaultProfilePicture.jpg"} title={sender.profile.name} alt="Profile image" className="profile-pic" />}</div>

//           <div className="content" title={formatShortDate(message.created_At, true)}>
//             <FormatReply />

//             <Reactions />
//           </div>

//           <div className="options">
//             <div className="option" onClick={() => setShowReactionPicker((prev) => !prev)}>
//               <MdAddReaction />

//               {showReactionPicker && (
//                 <div className="reaction-picker">
//                   {pickerReactions.map((reaction: string, index: number) => (
//                     <div onClick={() => handleAddReaction(reaction)} className="icon cursor-default" key={index}>
//                       <span>{reaction}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="option">
//               <MdOutlineReply onClick={() => handleSetReply(message)} />
//             </div>
//             <div className="option" onClick={() => setShowOptionsDropdown((prev) => !prev)}>
//               <TbDotsVertical />

//               {showOptionsDropdown && <MessageOptions isFromMe={isFromMe(message.senderId, auth.id)} handleCopyBtn={copyBtn} handleDeleteBtn={handleDeleteMessage} handleForwardBtn={forwardBtn} handlePinBtn={pinBtn} handleReplyBtn={replyBtn} />}
//             </div>
//           </div>
//         </div>
//       </div>

//       {showImage && message.type === "Image" && <ImageViewer message={message} handleOpen={showImage} handleSetOpen={setShowImage} />}
//     </div>
//   );
// };

// export default Message;
