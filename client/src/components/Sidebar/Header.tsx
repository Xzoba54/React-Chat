import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import { TbDotsVertical } from "react-icons/tb";
import { IoIosSettings } from "react-icons/io";
import { CiLogout } from "react-icons/ci";

import ContextMenu from "../Modals/ContextMenu";
import Avatar from "../Avatar";
import { api } from "../../utils/axios";
import { Member } from "./Chats";

type MenuProps = {
  logout: () => void;
};

const Menu = ({ logout }: MenuProps) => {
  return (
    <div className="list">
      <NavLink to="/settings/account">
        <div className="item">
          <span className="text-name">Settings</span>
          <IoIosSettings />
        </div>
      </NavLink>
      <div className="separator" />
      <div className="item warning" onClick={logout}>
        <span className="text-name">Logout</span>
        <CiLogout />
      </div>
    </div>
  );
};

const Header = () => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [me, setMe] = useState<Member | null>();

  const { auth, logout } = useAuth();

  if (!auth) return null;

  const copyUsername = () => {
    navigator.clipboard.writeText(auth.name);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/user/me");

      setMe(data as Member);
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  if (!me) return null;

  return (
    <div className="header">
      <Avatar members={[me]} />
      <div className="col">
        <span className="name text-clamp" onClick={copyUsername}>
          {auth.name}
        </span>

        <div className="status">
          <span>Online</span>
        </div>
      </div>

      <div ref={buttonRef} className="button" onClick={handleClick}>
        <TbDotsVertical />
      </div>

      {showMenu && (
        <ContextMenu setOpen={setShowMenu} buttonRef={buttonRef}>
          <Menu logout={logout} />
        </ContextMenu>
      )}
    </div>
  );
};

export default Header;
