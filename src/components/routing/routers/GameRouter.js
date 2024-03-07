import React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import Game from "../../views/Game";
import UserDetails from "../../views/UserDetails";
import PropTypes from "prop-types";

const GameRouter = () => {
  return (
    <div /* style={{ display: "flex", flexDirection: "column" } }*/>
      <Routes>
        <Route path="/dashboard" element={<Game />} index={true} />
        <Route path="/user/:id" element={<UserDetails />} />
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