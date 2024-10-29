import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/create-account", {
        fullName: name,
        email,
        password,
        role,
      });
      if (data.error) {
        setError(data.message);
        return;
      }
      navigate("/login");
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl mb-7">Sign Up</h4>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box"
          />
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
          <select
            className="input-box"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
          <button type="submit" className="btn-primary">
            Create Account
          </button>
          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
