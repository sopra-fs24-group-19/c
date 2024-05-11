import { SlTrophy } from "react-icons/sl";
import * as PropTypes from "prop-types";
import { Button } from "components/ui/Button";
import { Link } from "react-router-dom";
import "../../styles/views/Header.scss";
import { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { TiUser } from "react-icons/ti";
import { TbCoins } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";

const Header = (props) => {
  const currentUserId = localStorage.getItem("currentUserId");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${currentUserId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Details:", error);
      }
    };
    fetchUserData();
  }, []);

  const doLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentUserId");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const doCreateTask = async () => {
    window.location.href = "/addtasks";
  };

  return (
    <div className="header container">
      <div className="header logo">
        <img src="HHlogo.png" alt="Company Logo" style={{width: "50px", borderRadius: "0.75em"}}/>
        <Link to="/leaderboard" className="header-trophy-button"> 
          <SlTrophy size={35} className="header-trophy-icon"/> 
        </Link>

        <Button className="header button" onClick={doCreateTask}>
          Create new task
        </Button>



      </div>
      <h1 className="header title">Helping Hands</h1>

      {localStorage.getItem("token") !== null && currentUser !== null ? (
        <div className="header user-container">
          <div className="header icon-column">
            <TiUser className="header icons" size={35}/>
            <TbCoins className="header icons" size={35}/>
          </div>
          <div className="header text-column">
            <p className="header text">{currentUser.username}</p>
            <p className="header text">{currentUser.coinBalance}</p>
          </div>
          <div className="header button-column">
            <Button to="/leaderboard" className="header-trophy-button" onClick={doLogout}>
              <FiLogOut className="header-trophy-icon"/>
            </Button>
          </div>
        </div>
      ) : (
        <div className="header button-container"></div>
      )}
    </div>
  )
};

Header.propTypes = {
  height: PropTypes.string,
  navigate: PropTypes.func.isRequired
};

export default Header;
