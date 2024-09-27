import { useEffect, useState } from "react";
import { Message } from "../../pages/Chat";
import { axiosPrivate } from "../../utils/axios";
import { IoIosArrowForward } from "react-icons/io";
import ImageViewer from "../Modals/ImageViewer";

type Props = {
  chatId: string;
  handleOpen: boolean;
  handleSetOpen: (val: boolean) => void;
};

const Attachments = ({ chatId, handleOpen, handleSetOpen }: Props) => {
  const [images, setImages] = useState<Message[]>([]);
  const [image, setImage] = useState<Message | null>(null);
  const [showImage, setShowImage] = useState<boolean>(false);

  const fetchImages = async () => {
    try {
      const { data } = await axiosPrivate.get(`/chat/${chatId}/images`);

      console.log(data);
      setImages(data as Message[]);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleShowMessage = (img: Message) => {
    setImage(img);
    setShowImage(true);
  };

  useEffect(() => {
    if (handleOpen) {
      fetchImages();
    }
  }, [handleOpen]);

  return (
    <div className={`attachments ${handleOpen ? "open" : "close"}`}>
      <div className="attachments-header">
        <div onClick={() => handleSetOpen(false)} className="icon">
          <IoIosArrowForward style={{ transform: "rotate(180deg)" }} />
        </div>
        <span className="text-name">Attachments</span>
      </div>
      {images.length > 0 ? (
        <div className="images">
          {images.map((image: Message, index: number) => (
            <div onClick={() => handleShowMessage(image)} className="item" key={index}>
              <img src={image.content} alt="Image" />
            </div>
          ))}
        </div>
      ) : (
        <div className="info">
          <span className="text-name">No attachments to show</span>
        </div>
      )}

      {image && showImage && <ImageViewer message={image} handleOpen={showImage} handleSetOpen={setShowImage} />}
    </div>
  );
};

export default Attachments;
