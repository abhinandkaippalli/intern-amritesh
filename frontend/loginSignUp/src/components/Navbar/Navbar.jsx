import React from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Navbar = ({ userInfo }) => {
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
    <div className="bg-white flex items-center justify-between px-6 drop-shadow py-4">
      <h2 className="text-xl font-bold text-blue-600">ObjectStream Inc</h2>

      {userInfo && (
        <div className="flex items-center space-x-4">
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
