import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo"; 
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar"; 

const Navbar = ({ userInfo }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    // Search logic here
  };

  const onClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 drop-shadow py-4">
      <h2 className="text-xl font-medium text-black">Notes</h2>
      
      {/* SearchBar should take up the available space */}
      <div className="flex-1 mx-4">
        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />
      </div>
      
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
