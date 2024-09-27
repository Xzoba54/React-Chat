import useAuth from "../../hooks/useAuth";
import { Message as MessageProps } from "../../pages/Chat";
import { formatShortDate } from "../../utils/formatDate";
import { Member } from "../Sidebar/Chats";

import { MdAddReaction } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { TbDotsVertical, TbPinnedFilled } from "react-icons/tb";
import AudioPlayer from "./AudioPlayer";
import { useRef, useState } from "react";
import { axiosPrivate } from "../../utils/axios";

import ImageViewer from "../Modals/ImageViewer";

import MessageOptions from "./MessageOptions";
import ReactDOM from "react-dom";

type Props = {
  message: MessageProps;
  firstMessage: boolean;
  lastMessage: boolean;
  sender?: Member;
  handleSetReply: (message: MessageProps) => void;
};

const pickerReactions = ["❤", "😂", "😢", "🤡"];

const Message = ({ message, firstMessage, lastMessage, sender, handleSetReply }: Props) => {
  const [showReactionPicker, setShowReactionPicker] = useState<boolean>(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState<boolean>(false);

  const root = document.getElementById("modal-layer");

  const [showImage, setShowImage] = useState<boolean>(false);

  const { auth } = useAuth();

  if (!auth || !sender || !root) return null;

  const isFromMe = (senderId: string, authId: string) => {
    return senderId === authId;
  };

  const FormatReply = () => {
    if (message.isDeleted) {
      return <span className="text-name">{sender.profile.name} deleted message</span>;
    }

    if (message.type === "Voice") return <AudioPlayer message={message} />;
    if (message.type === "Image") return <img onClick={() => setShowImage(true)} className="image" src={message.content} alt="Image" />;

    return <span className="text-name">{message.content}</span>;
  };

  const Reactions = () => {
    const reactions: Map<string, number> = new Map();

    if (!message.reactions || message.reactions.length === 0) return null;

    for (const reaction of message.reactions) {
      reactions.set(reaction.emoji, (reactions.get(reaction.emoji) || 0) + 1);
    }

    return (
      <div className="reactions cursor-default no-select">
        {[...reactions.entries()].map(([reaction, count], index: number) => (
          <div className="reaction" onClick={() => handleAddReaction(reaction)} key={index}>
            <span className="emoji">{reaction}</span>
            {count > 1 && <span className="count">{count}</span>}
          </div>
        ))}
      </div>
    );
  };

  const handleAddReaction = async (reaction: string) => {
    try {
      await axiosPrivate.post(`/message/${message.id}/reaction`, {
        content: reaction,
      });

      setShowReactionPicker(false);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await axiosPrivate.delete(`/message/${message.id}`);
    } catch (e: any) {
      console.log(e);
    }
  };

  const pinBtn = () => {};

  const replyBtn = () => {};

  const forwardBtn = () => {};

  const copyBtn = () => {};

  const handleOnMouseLeave = () => {
    if (showReactionPicker) setShowReactionPicker(false);
    if (showOptionsDropdown) setShowOptionsDropdown(false);
  };

  return (
    <div className={`message ${isFromMe(message.senderId, auth.id) ? "align-end" : ""} ${message.isDeleted ? "deleted" : ""}`} onMouseLeave={handleOnMouseLeave}>
      <div className="vertical-group">
        {(message.parent || firstMessage) && (
          <div className="row row-gap">
            {message.parent && !message.isDeleted && <span className="reply text-name cursor-pointer">Reply: {message.parent.content}</span>}

            {!message.parent && firstMessage && <span className="text-name no-select">{sender.profile.name}</span>}
          </div>
        )}

        <div className="row">
          <div className="profile-pic-container">{lastMessage && <img src={sender.profile.imageUrl || "/defaultProfilePicture.jpg"} title={sender.profile.name} alt="Profile image" className="profile-pic" />}</div>

          <div className="content" title={formatShortDate(message.created_At, true)}>
            <FormatReply />

            <Reactions />
          </div>

          <div className="options">
            <div className="option" onClick={() => setShowReactionPicker((prev) => !prev)}>
              <MdAddReaction />

              {showReactionPicker && (
                <div className="reaction-picker">
                  {pickerReactions.map((reaction: string, index: number) => (
                    <div onClick={() => handleAddReaction(reaction)} className="icon cursor-default" key={index}>
                      <span>{reaction}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="option">
              <MdOutlineReply onClick={() => handleSetReply(message)} />
            </div>
            <div className="option" onClick={() => setShowOptionsDropdown((prev) => !prev)}>
              <TbDotsVertical />

              {showOptionsDropdown && <MessageOptions isFromMe={isFromMe(message.senderId, auth.id)} handleCopyBtn={copyBtn} handleDeleteBtn={handleDeleteMessage} handleForwardBtn={forwardBtn} handlePinBtn={pinBtn} handleReplyBtn={replyBtn} />}
            </div>
          </div>
        </div>
      </div>

      {showImage && message.type === "Image" && <ImageViewer message={message} handleOpen={showImage} handleSetOpen={setShowImage} />}
    </div>
  );
};

export default Message;
