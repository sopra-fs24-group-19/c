import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/views/Edit.scss";

const FormField = (props) => {
  return (
    <div className="edit field">
      <label className="edit label">{props.label}</label>
      <input
        className="edit input"
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
};

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");

  const backToOverview = (): void => {
    navigate("/game");
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem("token");

      await api.put(`/users/${id}`, {
        username: username ? username : undefined,
        birthday: birthday ? birthday : undefined,
      }, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      navigate(`/userprofile/${id}`);
    } catch (error) {
      alert(
        `Something went wrong during the edit: \n${handleError(error)}`
      );
    }
  };
  
  return (
    <BaseContainer>
      <div className="edit container">
        <h1>Edit Profile</h1>
        <h5>Disclaimer: you will be able to click SAVE only if it is your profile</h5>
        <div className="edit form">
          <FormField
            label="New Username"
            value={username}
            onChange={(un) => setUsername(un)}
          />
          <FormField
            label="Birthday (use YYYY-MM-DD format)"
            value={birthday}
            onChange={(bd) => setBirthday(bd)}
          />
          <div className="edit button-container">
            <Button
              disabled={!username && !birthday}
              width="100%"
              onClick={handleSubmit}
            >
                Save
            </Button>
          </div>
          <div className="edit button-container">
            <Button width="100%" onClick={() => backToOverview()}>
                  Back to users overview
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};
  
export default Edit;