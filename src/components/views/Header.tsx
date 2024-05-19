import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import * as PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { SlTrophy } from "react-icons/sl";
import { TbCoins } from "react-icons/tb";
import { TiUser } from "react-icons/ti";
import { Link } from "react-router-dom";
import "../../styles/views/Header.scss";

const Header = (props) => {
  const currentUserId = sessionStorage.getItem("currentUserId");
  const [currentUser, setCurrentUser] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const token = sessionStorage.getItem("token");

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //           const response = await api.get(`/users/${currentUserId}`);
  //           await new Promise((resolve) => setTimeout(resolve, 1000));
  //           setCurrentUser(response.data)
  //     } catch (error) {
  //       console.error("Details:", error);
  //     }
  //   };
  //   fetchUserData();
  //   if (sessionStorage.getItem("token")) {
  //   const intervalId = setInterval(fetchUserData, 1000);
  //   return () => clearInterval(intervalId);}
  // }, []);
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

    const validateTokenAndUserId = async () => {
      try {
        const response = await api.get(`/auth/${currentUserId}`, {
          headers: {
            'Authorization': token
          }
        });
        setIsValid(response.data);
      } catch (error) {
        console.error(`Something went wrong: ${error}`);
        setIsValid(false);
      }
    };

    if (token && currentUserId) {
      fetchUserData();
      validateTokenAndUserId();
      const intervalId = setInterval(fetchUserData, 1000);
      return () => clearInterval(intervalId);
    } else {
      setIsValid(false);
    }
  }, [token, currentUserId]);

  const doLogout = async () => {
    try {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUserId");
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
        <img src="/favicon.ico" alt="Company Logo" style={{width: "50px", borderRadius: "0.75em"}}/>
        {isValid && sessionStorage.getItem("token") !== null && currentUser !== null ? (
        <>
        <Link to="/leaderboard" className="header-trophy-button">
          <SlTrophy size={35} className="header-trophy-icon"/> 
        </Link>
        <Button className="header button" onClick={doCreateTask}>
          Create new task
        </Button>
        </>
        ) : null}
      </div>
      <h1 className="header title">Helping Hands</h1>

      {isValid && sessionStorage.getItem("token") !== null && currentUser !== null ? (
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
