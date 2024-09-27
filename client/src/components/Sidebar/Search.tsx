import { useEffect, useRef, useState } from "react";
import NewChat from "../Modals/NewChat";
import { Chat } from "./Chats";

type Props = {
  search: string;
  setSearch: (value: string) => void;
  handleAddChat: (newChat: Chat) => void;
};

const Search = ({ search, setSearch, handleAddChat }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        console.log("fail modalref");
      }
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        console.log("fail buttonref");
      }

      if (modalRef.current && !modalRef.current.contains(e.target as Node) && buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        console.log("close");
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="search">
      <div className="input-container">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" strokeWidth="1.9200000000000004" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
          </g>
        </svg>

        <input onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search..." type="text" className="input" />
      </div>

      <div onClick={() => setIsOpen(true)} ref={buttonRef} className="button-add cursor-pointer">
        <span>+</span>
      </div>

      {isOpen && <NewChat handleAddChat={handleAddChat} handleSetModalOpen={setIsOpen} ref={modalRef} />}
    </div>
  );
};

export default Search;
