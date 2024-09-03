import { jwtDecode, JwtPayload } from "jwt-decode";
import { createContext, ReactNode, useEffect, useState } from "react";
import { axiosPrivate } from "../utils/axios";

export interface Auth extends JwtPayload {
  id: string;
  name: string;
  imageUrl: string;
}

interface AuthState {
  auth?: Auth;
  isLoading: boolean;
  setAuth: (_: Auth) => void;
  logout: () => void;
}

const defaultState: AuthState = {
  isLoading: true,
  setAuth: (_: Auth) => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthState>(defaultState);

interface Props {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: Props) => {
  const [auth, setAuth] = useState<Auth>();
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    try {
      const { data } = await axiosPrivate.post("/auth/refreshToken");
      let { id, name, imageUrl } = jwtDecode(data.token) as Auth;

      if (imageUrl == "") imageUrl = "/defaultProfilePicture.jpg";
      window.localStorage.setItem("token", data.token);

      setAuth({
        id: id,
        name: name,
        imageUrl: imageUrl,
      });
    } catch (e: any) {
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosPrivate.post("/auth/logout");

      window.localStorage.clear();
      setAuth(undefined);
    } catch (e: any) {}
  };

  useEffect(() => {
    refresh();
  }, [setAuth]);

  return <AuthContext.Provider value={{ auth, setAuth, logout, isLoading: loading }}>{children}</AuthContext.Provider>;
};
