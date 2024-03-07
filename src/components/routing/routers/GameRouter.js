import React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Game from "../../views/Game";
import UserDetails from "../../views/UserDetails";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <div /* style={{ display: "flex", flexDirection: "column" } }*/>
      <Routes>
{/*         QUESTION: che significa? The index={true} prop in a React Router component is used to specify that a route should only be active when the location is exactly matched. This is useful when you want a component to be rendered only when the location is exactly the same as the route's path
 */}        <Route path="/dashboard" element={<Game />} index={true} />
{/*         in this way we bind the id in the url 
*/}        <Route path="/user/:id" element={<UserDetails />} />

        {/* Wild card used to navigate back to root page in case of wrong URL*/}
        <Route path="*" element={<Navigate to="dashboard" replace />} />


      </Routes>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
