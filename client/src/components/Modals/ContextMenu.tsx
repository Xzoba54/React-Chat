import { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type Props = {
  children: ReactNode | ReactNode[];
  buttonRef: React.RefObject<HTMLDivElement>;
  setOpen: (val: boolean) => void;
};

const ContextMenu = ({ children, buttonRef, setOpen }: Props) => {
  const root = document.getElementById("modal-layer");
  const menuRef = useRef<HTMLDivElement | null>(null);

  const bounding = buttonRef.current?.getBoundingClientRect();

  if (!bounding || !root) return null;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      e.stopPropagation();

      if (!menuRef.current) return;

      if (!menuRef.current.contains(e.target as Node) && !buttonRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("mousedown", handleClick);
    };
  }, [setOpen]);

  return ReactDOM.createPortal(
    <div onClick={() => setOpen(false)} ref={menuRef} style={{ position: "absolute", left: bounding.left + bounding.width, top: bounding.top }} className="context-menu">
      {children}
    </div>,
    root
  );
};

export default ContextMenu;
