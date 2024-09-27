import { FaCopy } from "react-icons/fa";
import { CgMailForward, CgMailReply } from "react-icons/cg";
import { FaTrashCan } from "react-icons/fa6";
import { TbPinnedFilled } from "react-icons/tb";

type Props = {
  isFromMe: boolean;
  handlePinBtn: () => void;
  handleForwardBtn: () => void;
  handleReplyBtn: () => void;
  handleCopyBtn: () => void;
  handleDeleteBtn: () => void;
};

const MessageOptions = ({ isFromMe, handleCopyBtn, handleForwardBtn, handlePinBtn, handleReplyBtn, handleDeleteBtn }: Props) => {
  return (
    <div className="dropdown">
      <div className="item-button">
        <span className="text-name">Pin Message</span>
        <TbPinnedFilled />
      </div>
      <div className="item-button">
        <span className="text-name">Forward</span>
        <CgMailForward />
      </div>
      <div className="item-button">
        <span className="text-name">Reply</span>
        <CgMailReply />
      </div>
      <div className="item-button">
        <span className="text-name">Copy</span>
        <FaCopy />
      </div>

      {isFromMe && (
        <div className="item-button button-warning" onClick={handleDeleteBtn}>
          <span className="text-name">Delete</span>
          <FaTrashCan />
        </div>
      )}
    </div>
  );
};

export default MessageOptions;
