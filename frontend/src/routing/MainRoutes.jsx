import React from 'react'
import { Routes, Route} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardWrapper from "../components/DashboardWrapper";
import Calculator from "../components/Calculator";
import Challenges from "../components/Challenges";
import AddChallenge from "../components/AddChallenge";
import ViewRegistrations from "../components/ViewRegistrations";
import ManageQuiz from "../components/ManageQuiz";
import ScheduleDrive from '../pages/ScheduleDrive';
import ManageUsers from '../components/ManageUsers';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CleanupDrive from "../pages/CleanupDrive";
import Quiz from "../pages/Quiz";
import AboutUs from "../pages/About";

const MainRoutes = () => {
  return (
    <Routes>

<Route path="/" element={<Home/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>
<Route path="/dashboard" element={<DashboardWrapper/>}/>
<Route path="/calculator" element={<Calculator/>}/>
<Route path="/challenges" element={<Challenges/>}/>
<Route path="/manage-users" element={<ManageUsers/>}/>
<Route path="/add-challenge" element={<AddChallenge/>}/>
<Route path="/view-registrations" element={<ViewRegistrations/>}/>
<Route path="/manage-quiz" element={<ManageQuiz/>}/>
<Route path="/schedule-drive" element={<ScheduleDrive/>}/>
<Route path="/user-dashboard" element={<UserDashboard/>}/>
<Route path="/admin-dashboard" element={<AdminDashboard/>}/>
<Route path="/CleanupDrive" element={<CleanupDrive/>}/>
<Route path="/quiz" element={<Quiz/>}/>
<Route path="/aboutus" element={<AboutUs/>}/>

</Routes>

  )
}

export default MainRoutes
