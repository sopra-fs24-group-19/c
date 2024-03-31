import NavBar from 'components/ui/NavBar';
import Header from 'components/ui/Header';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "models/User"
import "styles/views/MyProfile.scss";

const FormField = (props) => {
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <input
        className="myprofile input"
        type={"text"}
        placeholder={props.placeholder}
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
  placeholder: PropTypes.string
};

const RadiusDropdown = (props) => {
  const handleChange = (event) => {
    props.onChange(parseInt(event.target.value));
  };
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <div className="myprofile dropdown-container">
        <select
          className="myprofile input"
          value={props.value !== null ? props.value : ''}
          onChange={handleChange}
          style={{width: '410px', color: props.value === null ? '#999999' : '#553842'}}
        >
          <option value="" disabled >{props.placeholder}</option>
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="3">3 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="15">15 km</option>
          <option value="20">20 km</option>
          <option value="21">see all tasks</option>
        </select>
      </div>
    </div>
  );
};
RadiusDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};


const MyProfile = () => {
  const navigate = useNavigate();

  // Once we are connected to the backend, use the actual current user
  //const currentUser = localStorage.getItem("currentUser")
  const currentUser = new User({
    id: 1,
    name: "testname",
    username: "testusername",
    token: "some-token",
    status: "online"
  });


  // Define variables for the attributes that can be changed
  const [username, setUsername] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [phonenumber, setPhonenumber] = useState<string>(null);
  const [address, setAddress] = useState<string>(null);
  const [radius, setRadius] = useState<int>(null);


  const doSaveUpdates = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, phonenumber, address, radius});
      const response = await api.put(`/users/${currentUser.id}`, requestBody);
      // Get the returned user and update a new object.
      const updatedUser = new User(response.data);

    } catch (error) {
      alert(
        `Your updates could not be saved: \n${handleError(error)}`
      );
    }
  };

  return (
        <>
          <NavBar />
          <div className="myprofile container">
            <h1 >My profile</h1>
            <p>Here, you can edit your profile</p>
            <div className="myprofile form">

              {/*Define all needed attributes for a new task*/}
              <FormField
                label="Username"
                placeholder={currentUser.username}
                value={username}
                onChange={(u: string) => setUsername(u)}
              />
              <FormField
                label="Name"
                placeholder={currentUser.name}
                value={name}
                onChange={(n: string) => setName(n)}
              />
              <FormField
                label="Phone Number"
                placeholder={currentUser.phonenumber ? currentUser.phonenumber: "Add your phone number"}
                value={phonenumber}
                onChange={(pn: string) => setPhonenumber(pn)}
              />
              <FormField
                label="Address"
                placeholder={currentUser.address ? currentUser.address : "Add your location"}
                value={address}
                onChange={(a: string) => setAddress(a)}
              />
              <RadiusDropdown
                label="Radius in which to look for tasks"
                placeholder={currentUser.radius ? currentUser.radius : "Choose radius"}
                value={radius}
                onChange={(r: int) => setRadius(r)}
              />

              <div className="addtasks button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
                  onClick={() => navigate("/homefeed")}
                >
                  Back to homefeed
                </Button>
                <Button
                  width="100%"
                  disabled={!username && !name && !phonenumber && !address && !radius}
                  onClick={() => doSaveUpdates()}
                 >
                  Save changes
                </Button>
              </div>

            </div>
          </div>
         </>
  );
};

export default MyProfile;
