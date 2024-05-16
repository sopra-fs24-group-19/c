import { api } from "helpers/api";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";


/**
 * routeProtectors interfaces can tell the router whether or not it should allow navigation to a requested route.
 * They are functional components. Based on the props passed, a route gets rendered.
 * In this case, if the user is authenticated (i.e., a token is stored in the local storage)
 * <Outlet /> is rendered --> The content inside the <GameGuard> in the App.js file, i.e. the user is able to access the main app.
 * If the user isn't authenticated, the components redirects to the /login screen
 * @Guard
 * @param props
 */

export const UserProfileGuard = () => {
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
  
UserProfileGuard.propTypes = {
  children: PropTypes.node
};

