import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./app/store";
import { setUser, clearUser } from "./features/userSlice";

import Login from "./pages/login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Employees from "./pages/Employees/Employees";
import Tasks from "./pages/Tasks/Tasks";
import Departments from "./pages/Departments/Departments";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";
import ProfileInfo from "./components/ProfileInfo/ProfileInfo";

const AppContent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axiosInstance.get("/get-user");
        if (response.data && response.data.user) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        dispatch(clearUser());
      }
    };

    getUserInfo();
  }, [dispatch]);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          {/* Add ProfileInfo to the header */}
          <ProfileInfo />
        </header>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/employees"
            element={
              <Layout userInfo={user}>
                <Employees />
              </Layout>
            }
          />
          <Route
            path="/tasks"
            element={
              <Layout userInfo={user}>
                <Tasks />
              </Layout>
            }
          />
          <Route
            path="/departments"
            element={
              <Layout userInfo={user}>
                <Departments />
              </Layout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout userInfo={user}>
                <Home />
              </Layout>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
