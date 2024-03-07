import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/UserDetails.scss";
import { User } from "types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        //added type field to make it dynamic depending on the type of the data displayed
        type={props.fieldType}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  fieldType: PropTypes.string
};

const Player = ({ user, setUser }: { user: User, setUser: any }) => {
  // const [userToEdit, setUserToEdit] = useState<User>(user);
  return <>
    <div className="playerDetails container" >
      <span>ID:</span>
      <span>{user.id}</span>
    </div>
    <div className="playerDetails container">
      <FormField
        label="Username"
        value={user.username}
        //three dots spread the user in the JSON file. with ", username" i'm updating the username
        onChange={(un: string) => setUser({ ...user, username: un })}
      />
    </div>
    <div className="playerDetails container">
      <FormField
        label="Birthday date"
        value={user.birthdayDate}
        //here is declared the type date to put the calendar icon
        fieldType="date"
        //three dots spread the user in the JSON file. with ", username" i'm updating the username
        onChange={(un: string) => setUser({ ...user, birthdayDate: un })}
      />
    </div>
    <div className="playerDetails container">
      <span>Status:</span>
      <span>{user.status}</span>
    </div>
    <div className="playerDetails container">
      <span>Creation date:</span>
      <span>{user.creationDate}</span>
    </div>
  </>
};

Player.propTypes = {
  user: PropTypes.object,
};

const UserDetails = () => {

  const navigate = useNavigate();
  //with useParams() i get all the parameters present in the URL(in this case the id)
  const routeParams = useParams();

  const [user, setUser] = useState<User>(null);


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        //GET request to backand. here i get the  specific user thanks to the id. also i put the token in the headers.
        const response = await api.get("/users/" + routeParams.id, { headers: { "Authorization": localStorage.getItem("token") } });

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUser(response.data);

        // See here to get more data.
        console.log(response);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the users: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }

    fetchData();
  }, []);

  const updateUser = async () => {
    try {
      //here i'm creating the request to send to the backend. dataToUpdate is the UserPutDTO, then is passed
      //as a pameter in the request
      const dataToUpdate = { username: user.username, birthdayDate: user.birthdayDate };
      await api.put("/users/" + user.id, dataToUpdate, { headers: { "Authorization": localStorage.getItem("token") } });
    } catch (error) {
      console.error(
        `Something went wrong while updating the users: \n${handleError(
          error
        )}`
      );
      console.error("Details:", error);
      alert(
        "Something went wrong while updating the user! See the console for details."
      );
    }

  }

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="userDetails">
        {/* displays the user previously defined at the beginning */}
        <Player user={user} setUser={setUser} />
      </div>
    );
  }
  //what i print on the webpage
  return (
    <BaseContainer className="userDetails container">
      <h2>User details</h2>
      <p className="userDetails paragraph">
        These are the details:
      </p>
      {content}
      {/* if the user is not loaded the save button is grayed out */}
      <Button disabled={user && !user.username} onClick={updateUser}>Save</Button>
      <Button onClick={() => navigate("/game/dashboard")}>Go back to dashboard</Button>
    </BaseContainer>
  );
};

export default UserDetails;
