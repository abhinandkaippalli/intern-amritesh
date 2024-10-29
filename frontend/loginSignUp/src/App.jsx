import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";

import Login from "./pages/login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Employees from "./pages/Employees/Employees";
import Tasks from "./pages/Tasks/Tasks";
import Departments from "./pages/Departments/Departments";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";

const App = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
      }
    };

    getUserInfo();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/employees"
          element={
            <Layout userInfo={userInfo}>
              <Employees />
            </Layout>
          }
        />
        <Route
          path="/tasks"
          element={
            <Layout userInfo={userInfo}>
              <Tasks />
            </Layout>
          }
        />
        <Route
          path="/departments"
          element={
            <Layout userInfo={userInfo}>
              <Departments />
            </Layout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout userInfo={userInfo}>
              <Home />
            </Layout>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
