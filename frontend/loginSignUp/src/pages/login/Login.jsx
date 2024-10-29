import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("testuser@123");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (data && data.accessToken) {
        localStorage.setItem("token", data.accessToken);

        navigate("/dashboard");

        window.location.reload();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || "Invalid credentials.");
      } else if (error.response && error.response.status === 500) {
        setError("Internal server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please check your connection.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box"
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>
          <p className="text-sm text-center mt-4">
            Not registered yet?{" "}
            <Link to="/signup" className="font-medium text-primary underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
