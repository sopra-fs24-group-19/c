import { api } from "helpers/api";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


export const ToDoGuard = () => {
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
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
  
  ToDoGuard.propTypes = {
    children: PropTypes.node
  };