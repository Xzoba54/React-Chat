import { axiosPrivate } from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { Auth } from "../contexts/AuthProvider";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handle = async () => {
    try {
      const { data } = await axiosPrivate.post("/auth/loginWithEmail", {
        email: email,
        password: password,
      });

      let { id, name, imageUrl } = jwtDecode(data.token) as Auth;

      if (imageUrl == "") imageUrl = "/defaultProfilePicture.jpg";
      window.localStorage.setItem("token", data.token);

      setAuth({
        id: id,
        name: name,
        imageUrl: imageUrl,
      });

      navigate("/");
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div>
      <h1>login</h1>
      <input onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} type="text" placeholder="Password" />
      <button onClick={() => handle()}>login</button>
    </div>
  );
};

export default Login;
