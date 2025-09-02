import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { api } from "../../utils/axios";

import { Member, Message } from "../../utils/types";

import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { IoIosReturnRight } from "react-icons/io";
import { RiCloseLine } from "react-icons/ri";

const SendIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_iconCarrier">
        <path
          d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path d="M10.11 13.6501L13.69 10.0601" stroke="var(--color-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );
};

type Props = {
  reply?: Message;
  sender?: Member;
  chatId: string;
  setReply: (reply: Message | undefined) => void;
};

const Controls = ({ reply, sender, chatId, setReply }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const messageInputRef = useRef<HTMLInputElement | null>(null);
  const attachInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_FILES = 4;

  const { auth } = useAuth();

  const sendMessage = async () => {
    console.log(`sending with id: ${chatId}`);
    if (files.length <= 0 && !messageInputRef.current?.value) return;
    if (!auth) return;

    const data = new FormData();

    if (files.length > 0) {
      data.append("type", "Image");
      data.append("file", files[0]);
    } else {
      data.append("type", "Text");

      if (!messageInputRef.current?.value) return;
      data.append("content", messageInputRef.current.value);
    }

    data.append("chatId", chatId);
    data.append("senderId", auth.id);

    if (reply) {
      data.append("replyId", reply.id);
    }

    try {
      await api.post("/message", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (messageInputRef.current) {
        messageInputRef.current.value = "";
      }
      if (attachInputRef.current) {
        attachInputRef.current.value = "";
      }
      setReply(undefined);
      setFiles([]);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!messageInputRef.current) return;

    messageInputRef.current.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        sendMessage();
      }

      if (e.key === "Escape") {
        cancelAction();
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      const clipboardItems = e.clipboardData?.items;
      if (!clipboardItems) return;

      for (const item of clipboardItems) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            setFiles((prev) => [...prev, file]);
          }
        }
      }
    };

    messageInputRef.current.addEventListener("keydown", handleKeyDown);
    messageInputRef.current.addEventListener("paste", handlePaste);

    return () => {
      messageInputRef.current?.removeEventListener("keydown", handleKeyDown);
      messageInputRef.current?.removeEventListener("paste", handlePaste);
    };
  }, [reply, files, chatId, auth]);

  const handleOnClickAttachFile = () => {
    if (files.length >= MAX_FILES) return;

    if (attachInputRef.current) {
      attachInputRef.current.click();
    }
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      setFiles((prev) => (prev ? [...prev, ...selectedFiles] : [...selectedFiles]));
      messageInputRef.current?.focus();
    }
  };

  const getFileURL = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const cancelAction = () => {
    setFiles([]);
    setReply(undefined);

    if (attachInputRef.current) {
      attachInputRef.current.value = "";
    }
  };

  const removeFile = (file: File) => {
    setFiles((prev) => prev.filter((item: File) => item !== file));
  };

  return (
    <div className="controls">
      {((sender && reply) || files.length > 0) && (
        <div className="action">
          <div className="col">
            {sender && reply && (
              <div className="col">
                <div className="title">
                  <span>
                    Replying to: <strong>{sender.profile.name}</strong>
                  </span>
                </div>

                <div className="content">
                  <IoIosReturnRight />
                  <span>{reply.content}</span>
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div className="list">
                {files.map((file: File, index: number) => (
                  <div className="item" key={index}>
                    <div className="content">
                      <img src={getFileURL(file)} alt={file.name} />

                      <div onClick={() => removeFile(file)} className="icon">
                        <RiCloseLine />
                      </div>

                      <span className="name text-clamp">{file.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div onClick={cancelAction} className="icon">
            <RiCloseLine />
          </div>
        </div>
      )}

      <div className="inputs">
        <div className="icons">
          <div className="icon" onClick={handleOnClickAttachFile}>
            <ImAttachment />

            <input ref={attachInputRef} onChange={handleFileOnChange} multiple type="file" />
          </div>
          <div className="icon">
            <FaMicrophone />
          </div>
        </div>

        <label htmlFor="message-input">
          <div className="input-container">
            <input ref={messageInputRef} id="message-input" autoComplete="off" type="text" placeholder="Send a message..." />
          </div>
        </label>

        <div onClick={sendMessage} className="icon mic">
          <SendIcon />
        </div>
      </div>
    </div>
  );
};

export default Controls;
