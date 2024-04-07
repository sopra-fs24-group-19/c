import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const AddTasksGuard = () => {
    if (!localStorage.getItem("token")) {
      return <Outlet />;
    }
    
    return <Navigate to="/login" replace />;
  };
  
  AddTasksGuard.propTypes = {
    children: PropTypes.node
  };