import NavBar from 'components/ui/NavBar';
import Header from 'components/ui/Header';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/AddTasks.scss";



const FormField = (props) => {
  return (
    <div className="register field">
      <label className="register label">{props.label}</label>
      <input
        className="register input"
        type={props.isPassword ? "password" : "text"}
        placeholder="enter here.."
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


const AddTasks = () => {
  return (
    <>
      <NavBar />
        <h2>Add Tasks Page</h2>
        <p>This is a placeholder for the Add Tasks page content.</p>
      
    </>
    <BaseContainer>
          <div className="register container">
            <h1>Create a new task</h1>
            <p>Ask your community for help by creating a task that you need help with</p>
            <div className="login form">
              <FormField
                label="Title of task"
                value={"username"}
                //onChange={(un: string) => setUsername(un)}
              />
              <FormField
                label="Description"
                placeholder="Please be as detailed as possible"
                value={"name"}
                //onChange={(n) => setName(n)}
              />
              <FormField
                label="Compensation"
                value={"How many coins will you offer for‚"}
                isPassword={true}
                //onChange={(pw) => setPassword(pw)}
              />
              <div className="register button-container">
                <Button
                  width="100%"
                  //onClick={() => doRegister()}
                >
                  Register
                </Button>
              </div>

              <div className="login button-container">
                    <p>
                      <span style={{ color: 'black' }}>Already have an account? Click&nbsp;</span>
                      <a href="/login" style={{ textDecoration: 'underline', color: '#007bff', cursor: 'pointer' }}>
                        here
                      </a>
                      <span style={{ color: 'black' }}>&nbsp;to login.</span>
                    </p>
                  </div>

            </div>
          </div>
        </BaseContainer>
  );
};

export default AddTasks;