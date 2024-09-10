import { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { Message } from "../../pages/Chat";

type Props = {
  message: Message;
};

const AudioMessage = ({ message }: Props) => {
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
      <audio ref={audioRef} src={message.content}></audio>
    </div>
  );
};

export default AudioMessage;
