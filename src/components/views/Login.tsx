import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import User from "models/User";
import * as PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "styles/views/Login.scss";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        type={props.isPassword ? "password" : "text"}
        placeholder="enter here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  isPassword: PropTypes.bool
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.put("/users", requestBody, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Debugging: Log the received token
      // console.log("Received token:", response.data.token);
      // console.log("Received token:", user.token);
      console.log("Name of logged in user:", user.name);


      // Store the token into the local storage.
      // localStorage.setItem("token", user.token);
      // console.log("Header:", response.headers);

      // const token = response.data.token;
      const token = response.headers["authorization"];

      // Debugging: Log before saving the token
      console.log("Token from header:", token);

      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", user);
      localStorage.setItem("currentUserId", user.id);

      
      

      // Login successfully worked --> navigate to the route /game in the GameRouter
      window.location.href = "/homefeed";
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <img src="HHlogo.png" alt="Company Logo" className="logo" />
        <h1>Hi there!</h1>
        <h5>Please enter your credentials</h5>
        <div className="login form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            isPassword={true}
            onChange={(pw) => setPassword(pw)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        <div className="login button-container">
              <p>
                <span style={{ color: 'black' }}>Not a member yet? Click&nbsp;</span>
                <a href="/register" style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer' }}>
                  here
                </a>
                <span style={{ color: 'black' }}>&nbsp;to register.</span>
              </p>
            </div>
        </div>
      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
