import "./styles/index.css";
import "./styles/sidebar.css";
import "./styles/chat.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthProvider";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import LoginRequired from "./utils/LoginRequired";
import Sidebar from "./components/Sidebar";
import Welcome from "./pages/Welcome";

const ChatLayout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <div className="app">
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<LoginRequired />}>
              <Route element={<ChatLayout />}>
                <Route path="/" element={<Welcome />} />
                <Route path="/chat/:id" element={<Chat />}></Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
