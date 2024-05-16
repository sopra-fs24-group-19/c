import { api } from "helpers/api";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 *
 * Another way to export directly your functional component is to write 'export const' 
 * instead of 'export default' at the end of the file.
 */
export const LoginGuard = () => {
    const [isValid, setIsValid] = useState(null);
    const token = sessionStorage.getItem("token");
    const userId = sessionStorage.getItem("currentUserId");

    useEffect(() => {
        if (!token || !userId) {
            setIsValid(false);
            return;
        }

        api.get(`/auth/${userId}`, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => setIsValid(response.data))
        .catch(error => {
            console.error(`Something went wrong: ${error}`);
            setIsValid(false);
        });
    }, [token, userId]);

    if (isValid === null) {
        return null; // Or a loading spinner
    }

    if (!isValid) {
        return <Outlet />;
    }

    return <Navigate to="/homefeed" replace />;
};

LoginGuard.propTypes = {
  children: PropTypes.node
}