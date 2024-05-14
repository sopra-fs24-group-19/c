import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const HomeFeedGuard = () => {
    if (sessionStorage.getItem("token")) {
      return <Outlet />;
    }
    
    return <Navigate to="/login" replace />;
  };
  
  HomeFeedGuard.propTypes = {
    children: PropTypes.node
  };
  