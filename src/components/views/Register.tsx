import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import User from "models/User";
import * as PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "styles/views/Register.scss";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        className="register input"
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

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // // const token = response.data.token;
      // const token = user.token;
      const token = response.headers["authorization"];

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("currentUser", user);
      sessionStorage.setItem("currentUserId", user.id);


      // Register successfully worked --> navigate to the route /game in the GameRouter
      window.location.href = "/homefeed";
    } catch (error) {
      alert(
        "Oops, this username is already taken, please choose another one"
        //`Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="register container">
        <img src={process.env.PUBLIC_URL + "/favicon.icogit"} alt="Company Logo" className="logo" />
        <h1>Create your account</h1>
        <p>Please make sure your username is unique</p>
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={(n) => setName(n)}
          />
          <FormField
            label="Password"
            value={password}
            isPassword={true}
            onChange={(pw) => setPassword(pw)}
          />
          <div className="register button-container">
            <Button
              disabled={!username || !name || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>

          <div className="login button-container">
                <p>
                  <span style={{ color: 'black' }}>Already have an account? Click&nbsp;</span>
                  <Link to="/login" style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer' }}>
                    here
                  </Link>
                  <span style={{ color: 'black' }}>&nbsp;to login.</span>
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
export default Register;
