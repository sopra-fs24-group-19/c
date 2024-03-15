import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const FormField = (props) => {
  return (
    <div className="Register field">
      <label className="Register label">{props.label}</label>
      <input
        className="Register input"
        placeholder="enter here.."
        type={props.fieldType}
        value={props.value}
        // onChange: An event handler that triggers on input change, 
        // calling props.onChange and passing the changed value.
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

//propTypes is to ensure that the passed data is of the correct datatype.
FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  fieldType: PropTypes.string,
  onChange: PropTypes.func,
};

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>(null);
  const [password, setPassword] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      
      const response = await api.post("/users", requestBody);

      const token = response.headers["authorization"];

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Saving in local storage the user just registered in
      localStorage.setItem("userObject", JSON.stringify(user));

      // Store the token into the local storage.
      localStorage.setItem("token", token);

      // Register successfully worked --> navigate to the route /game in the GameRouter
      navigate("/game");
    } catch (error) {
      alert(
        `Something went wrong during the Register: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <div className="Register container">
        <div className="Register form">
          <FormField
            label="Username"
            value={username}
            fieldType="text"
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            fieldType="password"
            onChange={(p: string) => setPassword(p)}
          />
          <div className="Register button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
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
