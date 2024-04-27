import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const LeaveReviewGuard = () => {
    if (localStorage.getItem("token")) {
      return <Outlet />;
    }
    
    return <Navigate to="/login" replace />;
  };
  
  LeaveReviewGuard.propTypes = {
    children: PropTypes.node
  };