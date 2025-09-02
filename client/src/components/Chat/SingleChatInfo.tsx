import { FaBan, FaImage, FaPaintBrush } from "react-icons/fa";
import { Member, Message } from "../../utils/types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import { api } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatFullDate } from "../../utils/formatDate";
import Avatar from "../Avatar";

type Props = {
  chatId: string;
  member: Member;
};

const SingleChatInfo = ({ chatId, member }: Props) => {
  const [showMedia, setShowMedia] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<Message[]>([]);

  const navigate = useNavigate();

  const deleteChat = async () => {
    try {
      await api.delete(`/chat/${chatId}`);

      navigate("/");
    } catch (e: any) {
      console.log(e);
    }
  };

  const fetchMedia = async () => {
    try {
      const { data } = await api.get(`/chat/${chatId}/images`);

      setPhotos(data as Message[]);
    } catch (e: any) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSetShowMedia = () => {
    setShowMedia((prev) => !prev);
  };

  useEffect(() => {
    if (showMedia) {
      fetchMedia();
    }
  }, [showMedia]);

  return (
    <div className="chat-sidebar">
      <div className="profile">
        <Avatar members={[member]} />
        <span className="text-clamp">{member.profile.name}</span>
      </div>

      <div className="info">
        <span className="title">About me</span>
        <p>Something about me la la lorem ipsum la la la ale nie wiem</p>

        <span className="title">Member since</span>
        <p>{formatFullDate(member.created_at)}</p>
      </div>

      <div className="actions">
        <div className="item">
          <FaPaintBrush />
          <span className="no-select">Change Theme</span>
          <IoIosArrowForward />
        </div>
        <div className="item" onClick={handleSetShowMedia}>
          <FaImage />
          <span className="no-select">Media</span>
          <IoIosArrowForward />
        </div>
        <div className="item warning">
          <FaBan />
          <span className="no-select">Block</span>
        </div>
        <div className="item warning" onClick={deleteChat}>
          <FaTrashCan />
          <span className="no-select">Delete Chat</span>
        </div>
      </div>

      <div className={`media ${showMedia ? "open" : "close"}`}>
        <div className="header">
          <div className="icon" onClick={handleSetShowMedia}>
            <IoIosArrowBack />
          </div>

          <span className="no-select">Media</span>
        </div>

        {showMedia && (
          <>
            {loading ? (
              <span className="content-info">loading...</span>
            ) : (
              <>
                {photos.length == 0 ? (
                  <span className="content-info">No images found</span>
                ) : (
                  <div className="grid">
                    {photos.map((photo: Message, index: number) => (
                      <img src={photo.content} key={index} alt="Media photo" />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SingleChatInfo;
