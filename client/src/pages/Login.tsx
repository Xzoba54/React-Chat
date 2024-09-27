import { axiosPrivate } from "../utils/axios";
import { jwtDecode } from "jwt-decode";
import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { Auth } from "../contexts/AuthProvider";
import { useEffect, useRef, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [emailError, setEmailError] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleBtnLogin = async () => {
    try {
      if (!email || !password) return;

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
      setPassword("");
      setFormError("Invalid password or email address");

      console.log(e);
    }
  };

  const handleBtnNext = () => {
    if (email.trim()) {
      setCurrentStep((prev) => prev + 1);
      setEmailError(false);
    } else {
      console.log("true");
      setEmailError(true);
    }
  };

  const handleBtnBack = () => {
    setCurrentStep((prev) => prev - 1);
    setPassword("");
    setFormError("");
  };

  useEffect(() => {
    document.title = "Chat - Login";
  }, []);

  useEffect(() => {
    /*
      0 - Login step
      1 - Password step
    */
    if (currentStep === 0) {
      emailInputRef.current?.focus();
    } else if (currentStep === 1) {
      passwordInputRef.current?.focus();
    }
  }, [currentStep]);

  return (
    <div className="form-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="content">
          {currentStep === 0 && (
            <div className="wizard">
              <div className="group">
                <span className="title">Login</span>
                <span className="step">Step 1 of 2</span>
              </div>

              <label htmlFor="input">
                <div className={`input-container ${emailError ? "error" : ""}`}>
                  <input id="input" ref={emailInputRef} onKeyDown={(e) => e.key === "Enter" && handleBtnNext()} onChange={(e) => setEmail(e.target.value)} value={email} type="email" inputMode="email" autoComplete="email" placeholder="Email" />
                </div>
              </label>

              <button onClick={handleBtnNext} type="button" className="btn-next">
                Next
              </button>

              <div className="separator center">
                <span className="text-name">Or</span>
              </div>

              <div className="list">
                <div role="button" tabIndex={0} className="item">
                  <img src="/icons/google.svg" alt="Google icon" />
                  <span className="text-name">Log in with Google</span>
                </div>
              </div>

              <NavLink role="link" to="/signup">
                <span tabIndex={0} className="link">
                  Sign up
                </span>
              </NavLink>
            </div>
          )}

          {currentStep === 1 && (
            <div className="wizard">
              <div className="group">
                <span className="title">Login</span>
                <span className="step">Step 2 of 2</span>
              </div>

              <label htmlFor="input">
                <span className="text-name">Email: {email}</span>
                <div className="input-container">
                  <input id="input" ref={passwordInputRef} onKeyDown={(e) => e.key === "Enter" && handleBtnLogin()} onChange={(e) => setPassword(e.target.value)} type="password" inputMode="text" autoComplete="new-password" placeholder="Password" />
                </div>
                <span className="text-name error">{formError}</span>
              </label>

              <div className="group">
                <button onClick={handleBtnLogin} type="button" className="btn-next">
                  Log in
                </button>

                <span onKeyDown={(e) => e.key === "Enter" && handleBtnBack()} onClick={handleBtnBack} role="button" tabIndex={0} className="text-name link">
                  Back
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="side-image">
          <img src="/login_side_image.png" alt="Side image" />
        </div>
      </form>
    </div>
  );
};

export default Login;
