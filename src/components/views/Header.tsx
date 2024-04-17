
import * as PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import "../../styles/views/Header.scss";
import { Link } from "react-router-dom";

/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional components have to return always something. However, they don't need a "render()" method.
 * https://react.dev/learn/your-first-component and https://react.dev/learn/passing-props-to-a-component 
 * @FunctionalComponent
 */
const Header = (props) => {

  const doLogout = async (): void => {
    try {

      const currentUserId = localStorage.currentUserId
      const requestBody = JSON.stringify({ currentUserId });
      const response = await api.put("/logout", requestBody);
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
        {/* once the login works, replace the true with: localStorage.getItem("token") !== null */}
        {true ? (
          <div className="header button-container">
            <Button className="header button" onClick={doCreateTask}>
              Create a new task
            </Button>
            <Button
              className="header button"
              onClick={doLogout}>
              Log out
            </Button>
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
