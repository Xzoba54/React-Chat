import ReactDOM from "react-dom";
import { Message } from "../../pages/Chat";

type Props = {
  handleOpen: boolean;
  handleSetOpen: (val: boolean) => void;
  message: Message;
};

const ImageViewer = ({ message, handleOpen, handleSetOpen }: Props) => {
  const modalRoot = document.getElementById("modal-layer");

  const openImageInNewTab = () => {
    if (message.type === "Image") {
      window.open(message.content);
    }
  };

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-container" onClick={() => handleSetOpen(false)}>
      <div className="image-viewer">
        <div className="image-viewer-header"></div>
        <img src={message.content} alt="Image" />
        <span className="text-name" onClick={openImageInNewTab}>
          Open in new tab
        </span>
      </div>
    </div>,
    modalRoot,
  );
};

export default ImageViewer;
