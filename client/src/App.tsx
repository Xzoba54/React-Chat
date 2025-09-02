import "./styles/index.css";
import "./styles/sidebar.css";
import "./styles/chat.css";
import "./styles/form.css";
import "./styles/settings.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Provider } from "react-redux";

import { AuthContextProvider } from "./contexts/AuthProvider";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import LoginRequired from "./utils/LoginRequired";
import Sidebar from "./components/Sidebar/Sidebar";
import Friends from "./pages/Friends";
import Requests from "./pages/Requests";
import Notifications from "./pages/Notifications";
import SettingsSidebar from "./components/Settings/Sidebar";
import Account from "./pages/Settings/Account";
import Appearance from "./pages/Settings/Appearance";
import Privacy from "./pages/Settings/Privacy";
import { useEffect } from "react";
import { store } from "./redux/store";

const ChatLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const SettingsLayout = () => {
  return (
    <div className="settings">
      <SettingsSidebar />
      <Outlet />
    </div>
  );
};

function App() {
  useEffect(() => {
    const value = localStorage.getItem("transparent-background");

    if (value === "true") document.body.classList.add("background-image");
  }, []);

  return (
    <div className="app">
      <AuthContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route element={<LoginRequired />}>
                <Route element={<ChatLayout />}>
                  <Route path="/settings" element={<SettingsLayout />}>
                    <Route path="account" element={<Account />} />
                    <Route path="appearance" element={<Appearance />} />
                    <Route path="privacy" element={<Privacy />} />
                  </Route>

                  <Route path="/" element={<Friends />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/notifications" element={<Notifications />} />

                  <Route path="/chat/:id" element={<Chat />}></Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </AuthContextProvider>
    </div>
  );
}

export default App;
