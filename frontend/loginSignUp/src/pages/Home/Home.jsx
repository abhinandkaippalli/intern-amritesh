import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Home = () => {
  const [userInfo, setUserInfo] = useState(null); // State to store user info
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Set the fetched user info
        console.log(response.data.user); // Debugging line to ensure `userInfo` is correctly fetched
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getUserInfo(); // Fetch the user info when the component mounts
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} /> {/* Passing userInfo to Navbar */}
      
      <div className="container mx-auto mt-8">
        {/* Display user's full name as a heading if userInfo is available */}
        {userInfo && (
          <h1 className="text-3xl font-bold">
            Welcome, {userInfo.fullName}!
          </h1>
        )}
      </div>
    </>
  );
};

export default Home;
