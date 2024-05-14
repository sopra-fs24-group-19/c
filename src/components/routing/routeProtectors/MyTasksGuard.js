import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const MyTasksGuard = () => {
    if (sessionStorage.getItem("token")) {
      return <Outlet />;
    }
    
    return <Navigate to="/login" replace />;
  };
  
  MyTasksGuard.propTypes = {
    children: PropTypes.node
  };