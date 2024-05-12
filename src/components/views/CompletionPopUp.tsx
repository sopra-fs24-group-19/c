import React from 'react';
import ReactDOM from 'react-dom';
import { FaRegThumbsUp } from "react-icons/fa";
import "styles/views/CompletionPopUp.scss";

const Popup = ({ onClose, userStatus }) => {
  return ReactDOM.createPortal(
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content">
        <FaRegThumbsUp size={35} className="CompletionPopUp icon"/>
        <br/>
        <br/>
        {userStatus === 'Helper' ? (
          <p>Good job! Thank you for helping out in your community!</p>
        ) : (
          <>
          <p>Great! You task is finished</p>
          <p>Return the favor and help other neighbors in your community!</p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
