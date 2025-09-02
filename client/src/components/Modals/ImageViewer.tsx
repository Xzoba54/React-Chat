import ReactDOM from "react-dom";
import { Message } from "../../utils/types";

type Props = {
  handleSetOpen: (val: boolean) => void;
  message: Message;
};

const ImageViewer = ({ message, handleSetOpen }: Props) => {
  const modalRoot = document.getElementById("modal-layer");

  const openImageInNewTab = () => {
    if (message.type === "Image") {
      window.open(message.content);
    }

    handleSetOpen(false);
  };

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modal-container" onClick={() => handleSetOpen(false)}>
      <div className="image-viewer" onClick={(e) => e.stopPropagation()}>
        <img src={message.content} alt="Image" />
        <span onClick={openImageInNewTab}>Open in new tab</span>
      </div>
    </div>,
    modalRoot,
  );
};

export default ImageViewer;
