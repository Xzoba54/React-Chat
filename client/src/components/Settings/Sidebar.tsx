import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="settings-sidebar">
      <div className="list">
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/settings/account">
          <div className="item">
            <span className="name">My Account</span>
          </div>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/settings/appearance">
          <div className="item">
            <span className="name">Appearance</span>
          </div>
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/settings/privacy">
          <div className="item">
            <span className="name">Privacy</span>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
