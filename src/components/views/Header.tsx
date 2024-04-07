
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
    localStorage.removeItem("token");
    try {

      //const currentUserId = localStorage.currentUserId
      //Mock object:
      const currentUserId = 1
      const requestBody = JSON.stringify({ currentUserId });
      //const response = await api.put("/logout", requestBody);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
    };


    return(
      <div className="header container" style={{ height: props.height }}>
        <img src="HHlogo.png" alt="Company Logo" className="logo" style={{ width: '80px', height: 'auto', margin: '10px' }} />
        <h1 className="header title">Helping Hands</h1>
        {/* once the login works, replace the true with: localStorage.getItem("token") !== null */}
        {true && (
            <Button
            style={{color: "#ebe8e5", background: "#553842", width: "120px"}}
            onClick={doLogout}>
                Log out
            </Button>
           )}
      </div>
    )
};

Header.propTypes = {
  height: PropTypes.string,
  //navigate: PropTypes.func.isRequired
};

export default Header;
