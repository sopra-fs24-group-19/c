import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddTasks from "../../views/AddTasks";
import Candidates from "../../views/Candidates";
import Leaderboard from "../../views/Leaderboard";
import Header from "../../views/Header";
import HomeFeed from "../../views/HomeFeed";
import LeaveReview from "../../views/LeaveReview";
import Login from "../../views/Login";
import MyApplications from "../../views/MyApplications";
import MyProfile from "../../views/MyProfile";
import MyTasks from "../../views/MyTasks";
import Register from "../../views/Register";
import ToDo from "../../views/ToDo";
import UserProfile from "../../views/UserProfile";
import { AddTasksGuard } from "../routeProtectors/AddTasksGuard";
import { HomeFeedGuard } from "../routeProtectors/HomeFeedGuard";
import { LeaveReviewGuard } from "../routeProtectors/LeaveReviewGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { MyProfileGuard } from "../routeProtectors/MyProfileGuard";
import { MyTasksGuard } from "../routeProtectors/MyTasksGuard";
import { RegisterGuard } from "../routeProtectors/RegisterGuard";
import { ToDoGuard } from "../routeProtectors/ToDoGuard";
import { UserProfileGuard } from "../routeProtectors/UserProfileGuard";

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
    <Header height="100" />
      <Routes>
        

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/register" element={<RegisterGuard />}>
          <Route path="/register" element={<Register/>} />
        </Route>
        
        <Route path="/userprofile" element={<UserProfileGuard />}>
          <Route path=":id" element={<UserProfile />} />
        </Route>

        <Route path="/myprofile" element={<MyProfileGuard />}>
          <Route path="/myprofile" element={<MyProfile />} />
        </Route>

        <Route path="/mytasks" element={<MyTasksGuard />}>
          <Route path="/mytasks" element={<MyTasks />} />
        </Route>

        <Route path="/myapplications" element={<MyTasksGuard />}>
          <Route path="/myapplications" element={<MyApplications />} />
        </Route>

        <Route path="/candidates" element={<MyTasksGuard />}>
          <Route path="/candidates" element={<Candidates />} />
        </Route>

        <Route path="/addtasks" element={<AddTasksGuard />}>
          <Route path="/addtasks" element={<AddTasks />} />
        </Route>

        <Route path="/homefeed" element={<HomeFeedGuard />}>
          <Route path="/homefeed" element={<HomeFeed />} />
        </Route>
        <Route path="/leaderboard" element={<MyProfileGuard />}>
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>

        {/* <Route path="/leavereview" element={<LeaveReviewGuard />}>
          <Route path="/leavereview" element={<LeaveReview />} />
        </Route> */}

        <Route path="/leavereview/:id/:taskId" element={<LeaveReviewGuard />}>
            <Route path="/leavereview/:id/:taskId" element={<LeaveReview />} />
        </Route>

        <Route path="/todo" element={<ToDoGuard />}>
          <Route path=":taskId" element={<ToDo />} />
        </Route>

        <Route path="/" element={
          <Navigate to="/login" replace />
        }/>

        <Route path="/*" element={
          <Navigate to="/login" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
