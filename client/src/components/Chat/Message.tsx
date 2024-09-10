import useAuth from "../../hooks/useAuth";
import { Message as MessageProps, Reaction } from "../../pages/Chat";
import { formatShortDate } from "../../utils/formatDate";
import { Member } from "../Sidebar/Chats";

import { MdAddReaction } from "react-icons/md";
import { MdOutlineReply } from "react-icons/md";
import { TbDotsVertical } from "react-icons/tb";
import AudioPlayer from "./AudioPlayer";
import { useState } from "react";
import { axiosPrivate } from "../../utils/axios";
import { FaTrashCan } from "react-icons/fa6";

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

  const { auth } = useAuth();

  if (!auth || !sender) return null;

  const isFromMe = (senderId: string, authId: string) => {
    return senderId === authId;
  };

  const FormatReply = () => {
    if (message.type === "Voice") return <AudioPlayer message={message} />;

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

  const handleOnMouseLeave = () => {
    if (showReactionPicker) setShowReactionPicker(false);
    if (showOptionsDropdown) setShowOptionsDropdown(false);
  };

  return (
    <div className={`message ${isFromMe(message.senderId, auth.id) ? "align-end" : ""}`} onMouseLeave={handleOnMouseLeave}>
      <div className="vertical-group">
        {(message.parent || firstMessage) && (
          <div className="row row-gap">
            {message.parent && <span className="reply text-name cursor-pointer">Reply: {message.parent.content}</span>}

            {!message.parent && firstMessage && <span className="text-name no-select">{sender.profile.name}</span>}
          </div>
        )}

        <div className="row">
          <div className="profile-pic-container">{lastMessage && <img src={sender.profile.imageUrl || "/defaultProfilePicture.jpg"} title={sender.profile.name} alt="Profile image" className="profile-pic" />}</div>

          <div className="content" title={formatShortDate(message.created_At)}>
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

              {showOptionsDropdown && (
                <div className="dropdown">
                  <div className="item-button button-warning" onClick={handleDeleteMessage}>
                    <FaTrashCan />
                    <span className="text-name">Delete</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
