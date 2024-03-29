import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddTasks from "../../views/AddTasks";
import Edit from "../../views/Edit";
import HomeFeed from "../../views/HomeFeed";
import Login from "../../views/Login";
import MyProfile from "../../views/MyProfile";
import MyTasks from "../../views/MyTasks";
import Register from "../../views/Register";
import UserProfile from "../../views/UserProfile";
import { AddTasksGuard } from "../routeProtectors/AddTasksGuard";
import { GameGuard } from "../routeProtectors/GameGuard";
import { HomeFeedGuard } from "../routeProtectors/HomeFeedGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { MyProfileGuard } from "../routeProtectors/MyProfileGuard";
import { MyTasksGuard } from "../routeProtectors/MyTasksGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
import { UserProfileGuard } from "../routeProtectors/UserProfileGuard";
import GameRouter from "./GameRouter";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial 
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      
      <Routes>
        
        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/register" element={<RegisterGuard />}>
          <Route path="/register" element={<Register/>} />
        </Route>

        {/* <Route path="/userprofile" element={<UserProfileGuard />}>
          <Route path=":id" element={<UserProfile />} />
        </Route> */}
        
        <Route path="/userprofile" element={<UserProfileGuard />}>
          <Route path=":id" element={<UserProfile />} />
          <Route path=":id/edit" element={<Edit />} />
        </Route>

        <Route path="/myprofile" element={<MyProfileGuard />}>
          <Route path="/myprofile" element={<MyProfile />} />
        </Route>

        <Route path="/mytasks" element={<MyTasksGuard />}>
          <Route path="/mytasks" element={<MyTasks />} />
        </Route>

        <Route path="/addtasks" element={<AddTasksGuard />}>
          <Route path="/addtasks" element={<AddTasks />} />
        </Route>

        <Route path="/homefeed" element={<HomeFeedGuard />}>
          <Route path="/homefeed" element={<HomeFeed />} />
        </Route>

        <Route path="/" element={
          <Navigate to="/game" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
