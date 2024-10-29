import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import axiosInstance from "../../utils/axiosInstance";

const Layout = ({ children, userInfo }) => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await axiosInstance.post("/logout");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar onLogout={onLogout} />
      <div className="flex-grow">
        <Navbar userInfo={userInfo} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
