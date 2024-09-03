import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginRequired = () => {
  const { auth, isLoading } = useAuth();

  if (isLoading) return null;

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default LoginRequired;
