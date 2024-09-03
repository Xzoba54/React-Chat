import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import Chats from "./Sidebar/Chats";

import { TbDotsVertical } from "react-icons/tb";
import { CiLogout } from "react-icons/ci";
import { IoIosSettings } from "react-icons/io";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { auth, logout } = useAuth();

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handle);

    return () => {
      window.removeEventListener("click", handle);
    };
  }, []);

  if (!auth) return null;

  return (
    <div className="sidebar">
      <div className="header">
        <div className="horizontal-group">
          <div className="profile-pic-container">
            <img src={auth.imageUrl} alt="profile image" className="profile-pic" />
            <div className="status-icon-container">
              <div className="status-icon"></div>
            </div>
          </div>

          <div className="vertical-group">
            <span className="text-name first-capitalize text-clamp">{auth.name}</span>

            <div className="status-container cursor-default">
              <div className="status">Online</div>
            </div>
          </div>
        </div>

        <div className="icons">
          <div className="icon cursor-pointer" onClick={() => setIsOpen((prev) => !prev)} ref={menuRef}>
            <TbDotsVertical />
            {isOpen && (
              <div className="menu">
                <div className="item">
                  <IoIosSettings />
                  <span className="text-name no-select">Settings</span>
                </div>
                <div className="item" onClick={logout}>
                  <CiLogout />
                  <span className="text-name no-select">Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Chats />
    </div>
  );
};

export default Sidebar;
