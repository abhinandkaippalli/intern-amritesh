import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ProfileInfo from "../ProfileInfo/ProfileInfo"; // Ensure this path is correct

const Navbar = () => {
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
      <div className="flex items-center space-x-4">
        <ProfileInfo />
        <button
          onClick={onLogout}
          className="text-sm text-red-500 underline ml-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
