import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

import { axiosPrivate } from "../utils/axios";
import useAuth from "../hooks/useAuth";

import { Chat as ChatProps, Member } from "../components/Sidebar/Chats.tsx";

import ChatAvatar from "../components/ChatAvatar.tsx";
import ChatControl from "../components/ChatControl.tsx";

import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { TbPinnedFilled } from "react-icons/tb";

import formatName from "../utils/formatName.ts";
import formatDate from "../utils/formatDate.ts";

interface Reaction {
  userId: string;
  emoji: string;
}

interface Message {
  senderId: string;
  content: string;
  type: string;
  parent?: Message;
  reactions: Reaction[];
  created_At: string;
}

const AudioPlayer = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  return (
    <div className="audio-player">
      <div className="pause-stop">{isPlaying ? <FaPause onClick={pause} /> : <FaPlay onClick={play} />}</div>
      <span className="text-name time no-select">0:00</span>
      <audio ref={audioRef} src={url}></audio>
    </div>
  );
};

const Chat = () => {
  const [chat, setChat] = useState<ChatProps>();
  const [messages, setMessages] = useState<Message[]>([]);
  const { id } = useParams();

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { auth } = useAuth();

  if (!auth) return null;
  const socket: Socket = io("http://localhost:5000", { auth: { id: auth.id } });

  const joinChat = () => {
    socket.emit("join-chat", id);
  };

  const fetchChat = async () => {
    try {
      const { data } = await axiosPrivate.get(`/chat/${id}`);

      setChat(data);
    } catch (e: any) {
      console.log(e);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axiosPrivate.get(`/chat/${id}/messages`);

      setMessages(data as Message[]);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scroll({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    window.document.title = `Chat | ${chat?.members.map((member) => " " + member.profile.name)}`;
  }, [chat, messages]);

  useEffect(() => {
    joinChat();

    fetchChat();
    fetchMessages();

    socket.on("receive-message", (msg: Message) => {
      const message: Message = {
        ...msg,
        created_At: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [id]);

  if (!chat || !messages || !id) return null;

  const messageUserImage = (members: Member[], message: Message, msgIndex: number) => {
    if (msgIndex < messages.length - 1 && message.senderId === messages[msgIndex + 1].senderId) return <div className="profile-pic-container"></div>;

    return (
      <div className="profile-pic-container">
        {members.map((member: Member, index: number) => {
          if (member.id === message.senderId) {
            return <img src={member.profile.imageUrl || "/defaultProfilePicture.jpg"} title={member.profile.name} alt="profile image" className="profile-pic" key={index} />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="chat">
      <div className="header">
        <div className="horizontal-group">
          <ChatAvatar members={chat.members} />
          <span className="text-name name first-capitalize">{formatName(chat, auth.id)}</span>
        </div>

        <div className="icons">
          <div className="icon">
            <IoIosCall />
          </div>
          <div className="icon">
            <IoVideocam />
          </div>
          <div className="icon" style={{ transform: "rotate(45deg)" }}>
            <TbPinnedFilled />
          </div>
        </div>
      </div>

      <div ref={chatContainerRef} className="messages" style={{ height: "100%" }}>
        {messages.map((message: Message, index: number) => {
          return (
            <div className={`message ${message.senderId === auth.id ? "align-end" : ""}`} key={index}>
              {messageUserImage(chat.members, message, index)}
              <div className="vertical-group">
                {auth.id !== message.senderId && index < messages.length - 1 && message.senderId === messages[index + 1].senderId && <span className="text-name">{chat.members.map((member) => member.id === message.senderId && member.profile.name)}</span>}
                {message.parent && <span className="text-name">Reply to: {message.parent.content}</span>}
                <div className="content">{message.type === "Text" ? <span>{message.content}</span> : <AudioPlayer url={message.content} />}</div>
              </div>

              <span className="date text-name no-select">{formatDate(message.created_At)}</span>

              {message.reactions.map((reaction: Reaction, index: number) => (
                <span className="text-name" key={index}>
                  {reaction.emoji}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      <ChatControl chatId={id} />
    </div>
  );
};

export default Chat;
