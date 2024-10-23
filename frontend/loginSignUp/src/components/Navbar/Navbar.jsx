import React from "react";
import ProfileInfo from "../Cards/ProfileInfo"; 
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 drop-shadow py-4">
      <h2 className="text-xl font-bold text-blue-600">ObjectStream Inc</h2>
      
      {/* Render ProfileInfo only if userInfo is available */}
      {userInfo && (
        <div className="flex items-center space-x-4">
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
