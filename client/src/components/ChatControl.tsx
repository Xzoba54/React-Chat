import { useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../utils/axios";
import useAuth from "../hooks/useAuth";

import { ImAttachment } from "react-icons/im";
import { IoTrashSharp } from "react-icons/io5";
import formatTime from "../utils/formatTime";
import { Message } from "../pages/Chat";
import { RiCloseLine } from "react-icons/ri";
import { BsArrowReturnRight } from "react-icons/bs";

const SendIcon = () => {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_iconCarrier">
        <path d="M7.39999 6.32003L15.89 3.49003C19.7 2.22003 21.77 4.30003 20.51 8.11003L17.68 16.6C15.78 22.31 12.66 22.31 10.76 16.6L9.91999 14.08L7.39999 13.24C1.68999 11.34 1.68999 8.23003 7.39999 6.32003Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
        <path d="M10.11 13.6501L13.69 10.0601" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
      </g>
    </svg>
  );
};

type Props = {
  chatId: string;
  handleSetReply: (message: Message | undefined) => void;
  reply?: Message;
};

const ChatControl = ({ chatId, reply, handleSetReply }: Props) => {
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [seconds, setSeconds] = useState<number>(0);
  const timerRef = useRef<number>(0);

  const { auth } = useAuth();

  if (!auth) return null;

  const sendMessage = async () => {
    if (!isRecording && !message.trim()) return;
    if (isRecording) {
      await stopRecording();
    }

    try {
      const data = new FormData();

      if (audioChunks.current.length > 0) {
        const audio = new Blob(audioChunks.current, { type: "audio/wav" });

        data.append("type", "Voice");
        data.append("file", audio, "audio.wav");
      } else {
        data.append("type", "Text");
        data.append("content", message);
      }

      data.append("chatId", chatId);
      data.append("senderId", auth.id);

      if (reply) {
        data.append("replyId", reply.id);
      }

      await axiosPrivate.post("/message", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("");
      handleSetReply(undefined);
      audioChunks.current = [];
    } catch (e: any) {
      console.log(e);
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    setMediaRecorder(recorder);

    recorder.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    recorder.start();
    setIsRecording(true);

    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = async (): Promise<void> => {
    if (mediaRecorder && isRecording) {
      return new Promise<void>((resolve) => {
        mediaRecorder.onstop = () => {
          mediaRecorder.stream.getTracks().forEach((track) => track.stop());
          resolve();
        };

        clearInterval(timerRef.current);
        mediaRecorder.stop();

        setIsRecording(false);
        setSeconds(0);
      });
    }
  };

  const deleteRecording = async () => {
    await stopRecording();
    audioChunks.current = [];
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="bottom-section">
      {reply && (
        <div className="reply">
          <div className="content">
            <BsArrowReturnRight />
            <span className="text-name">{reply.content}</span>
          </div>

          <div className="icon" onClick={() => handleSetReply(undefined)}>
            <RiCloseLine />
          </div>
        </div>
      )}
      <div className="controls">
        {!isRecording && (
          <div className="button attachment">
            <div className="icon">
              <ImAttachment />
            </div>
          </div>
        )}

        {isRecording && (
          <div className="button delete" onClick={() => deleteRecording()}>
            <div className="icon">
              <IoTrashSharp />
            </div>
          </div>
        )}

        <div className={`button mic ${isRecording ? "active" : ""}`}>
          {!isRecording && (
            <div className="icon" onClick={() => startRecording()}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="0.00024000000000000003">
                <g id="SVGRepo_iconCarrier">
                  <path d="M8 5C8 2.79086 9.79086 1 12 1C14.2091 1 16 2.79086 16 5V12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12V5Z"></path>
                  <path d="M6.25 11.8438V12C6.25 13.525 6.8558 14.9875 7.93414 16.0659C9.01247 17.1442 10.475 17.75 12 17.75C13.525 17.75 14.9875 17.1442 16.0659 16.0659C17.1442 14.9875 17.75 13.525 17.75 12V11.8438C17.75 11.2915 18.1977 10.8438 18.75 10.8438H19.25C19.8023 10.8438 20.25 11.2915 20.25 11.8437V12C20.25 14.188 19.3808 16.2865 17.8336 17.8336C16.5842 19.0831 14.9753 19.8903 13.25 20.1548V22C13.25 22.5523 12.8023 23 12.25 23H11.75C11.1977 23 10.75 22.5523 10.75 22V20.1548C9.02471 19.8903 7.41579 19.0831 6.16637 17.8336C4.61919 16.2865 3.75 14.188 3.75 12V11.8438C3.75 11.2915 4.19772 10.8438 4.75 10.8438H5.25C5.80228 10.8438 6.25 11.2915 6.25 11.8438Z"></path>
                </g>
              </svg>
            </div>
          )}

          {isRecording && (
            <div className="content">
              <div className="pin"></div>
              <span className="text-name">{formatTime(seconds)}</span>
              <div className="track"></div>
            </div>
          )}
        </div>

        {!isRecording && (
          <div className="container">
            <input onChange={(e) => setMessage(e.target.value)} ref={inputRef} type="text" placeholder="Send a message..." value={message} />
          </div>
        )}

        <div className="button send">
          <div className="icon" onClick={() => sendMessage()}>
            <SendIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatControl;
