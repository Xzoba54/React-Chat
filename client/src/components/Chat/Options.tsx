import useAuth from "../../hooks/useAuth";
import { Message } from "../../utils/types";
import { api } from "../../utils/axios";

import { CgMailForward, CgMailReply } from "react-icons/cg";
import { FaCopy } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { TbPinnedFilled } from "react-icons/tb";

type Props = {
  message: Message;
  handleReply: (reply: Message) => void;
};

const Options = ({ message, handleReply }: Props) => {
  const { auth } = useAuth();

  if (!auth) return null;

  const copy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const deleteMessage = async () => {
    try {
      await api.delete(`/message/${message.id}`);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div className="list">
      <div className="item">
        <span>Pin Message</span>
        <TbPinnedFilled />
      </div>
      <div className="separator" />
      <div className="item">
        <span>Forward</span>
        <CgMailForward />
      </div>
      <div className="item" onClick={() => handleReply(message)}>
        <span>Reply</span>
        <CgMailReply />
      </div>
      <div className="separator" />
      <div className="item" onClick={copy}>
        {message.type === "Text" ? <span>Copy</span> : <span>Copy Media Link</span>}
        <FaCopy />
      </div>

      {auth.id === message.senderId && (
        <div className="item warning" onClick={deleteMessage}>
          <span>Delete</span>
          <FaTrashCan />
        </div>
      )}
    </div>
  );
};

export default Options;
