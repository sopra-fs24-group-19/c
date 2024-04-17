import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */
export const RegisterGuard = () => {
  if (!localStorage.getItem("token")) {
    
    return <Outlet />;
  }
  
  return <Navigate to="/homefeed" replace />;
};

RegisterGuard.propTypes = {
  children: PropTypes.node
}