
import * as PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "../../styles/views/Header.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { TiUser } from "react-icons/ti";
import { TbCoins } from "react-icons/tb";/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component
 * @FunctionalComponent
 */
const Header = (props) => {
  const currentUserId = localStorage.getItem("currentUserId");
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    const fetchUserData = async () => {
    try {
        const response = await api.get(`/users/${currentUserId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Details:", error);
      }
    };
    fetchUserData();
  }, []);

  const doLogout = async (): void => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserId");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
    };
  const doCreateTask = async (): void => {
    window.location.href = "/addtasks";
    };


    return(
        <div className="header container">
        <div className="header logo">
        <img src="HHlogo.png" alt="Company Logo" style={{width: "80px"}}/>
        </div>
        <h1 className="header title">Helping Hands</h1>


        {localStorage.getItem("token") !== null && currentUser !== null? (
          <div className="header user-container">

            <div className="header icon-column">
                <TiUser class="header icons" size={35}/>
                <TbCoins class="header icons" size={35}/>
            </div>
            <div className="header text-column">
              <p className="header text">{currentUser.username}</p>
              <p className="header text">{currentUser.coinBalance}</p>
            </div>

            <div className="header button-column">
              <Button
                className="header button"
                onClick={doLogout}>
                Log out
              </Button>
              <Button className="header button" onClick={doCreateTask}>
                Create a new task
              </Button>
            </div>


          </div>
        ) : (
          <div className="header button-container"></div> // Render an empty div when condition is false
        )}


      </div>
    )
};

Header.propTypes = {
  height: PropTypes.string,
  navigate: PropTypes.func.isRequired
};

export default Header;
