import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiGrid,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`sidebar bg-gray-900 text-white h-screen flex flex-col items-start p-2 transition-all duration-500 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between w-full px-2 mb-6">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <FiMenu
            className={`text-2xl ${isCollapsed ? "text-white" : "text-white"}`}
          />
        </button>
        {!isCollapsed && (
          <h2 className="text-xl font-bold ml-4 whitespace-nowrap">
            Company Portal
          </h2>
        )}
      </div>

      <nav className="flex-grow w-full">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center w-full p-3 mb-3 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <FiHome className={`mr-2 ${isCollapsed ? "text-2xl" : "text-xl"}`} />
          {!isCollapsed && <span className="text-md">Dashboard</span>}
        </NavLink>
        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center w-full p-3 mb-3 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <FiUsers className={`mr-2 ${isCollapsed ? "text-2xl" : "text-xl"}`} />
          {!isCollapsed && <span className="text-md">Employees</span>}
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center w-full p-3 mb-3 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <FiClipboard
            className={`mr-2 ${isCollapsed ? "text-2xl" : "text-xl"}`}
          />
          {!isCollapsed && <span className="text-md">Tasks</span>}
        </NavLink>
        <NavLink
          to="/departments"
          className={({ isActive }) =>
            `flex items-center w-full p-3 mb-3 rounded-md hover:bg-gray-800 ${
              isActive ? "bg-gray-800" : ""
            }`
          }
        >
          <FiGrid className={`mr-2 ${isCollapsed ? "text-2xl" : "text-xl"}`} />
          {!isCollapsed && <span className="text-md">Departments</span>}
        </NavLink>
      </nav>
      <div className="w-full">
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 mt-3 text-red-400 hover:bg-red-600 rounded-md"
        >
          <FiLogOut
            className={`mr-2 ${isCollapsed ? "text-2xl" : "text-xl"}`}
          />
          {!isCollapsed && <span className="text-md">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
