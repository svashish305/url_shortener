import React, { useState, useEffect } from "react";
import { API } from "../api-service";
import { useCookies } from "react-cookie";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const [token, setToken] = useCookies(["jp-token"]);

  useEffect(() => {
    if (token["jp-token"]) window.location.href = "/jobs";
  }, [token]);

  const loginClicked = () => {
    API.loginUser({ email, password })
      .then((resp) => setToken("jp-token", resp.jwtToken))
      .catch((error) => console.log(error));
  };

  const registerClicked = () => {
    API.registerUser({ email, password })
      .then(() => loginClicked())
      .catch((error) => console.log(error));
  };

  const isDisabled = email.length === 0 || password.length === 0;

  return (
    <div className="App">
      <header className="App-header">
        {isLoginView ? <h1>Login</h1> : <h1>Register</h1>}
      </header>
      <div className="login-container">
        <label htmlFor="email">Email</label>
        <br />
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <br />
        {isLoginView ? (
          <button
            className="pointer-cursor"
            onClick={loginClicked}
            disabled={isDisabled}
          >
            Login
          </button>
        ) : (
          <button
            className="pointer-cursor"
            onClick={registerClicked}
            disabled={isDisabled}
          >
            Register
          </button>
        )}
        {isLoginView ? (
          <p className="pointer-cursor" onClick={() => setIsLoginView(false)}>
            You don't have an account, Register here!
          </p>
        ) : (
          <p className="pointer-cursor" onClick={() => setIsLoginView(true)}>
            You already have an account, Login here!
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
