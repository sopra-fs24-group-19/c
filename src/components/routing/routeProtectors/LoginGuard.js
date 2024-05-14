import PropTypes from "prop-types";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */
export const LoginGuard = () => {
  if (!sessionStorage.getItem("token")) {
    
    return <Outlet />;
  }
  
  return <Navigate to="/homefeed" replace />;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}