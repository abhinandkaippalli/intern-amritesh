import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const Departments = () => {
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null); // Track user's role
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);

  const fetchDepartment = async () => {
    setLoading(true);
    try {
      // Fetch the user's information to get their role
      const userResponse = await axiosInstance.get("/get-user");
      setRole(userResponse.data.user.role);
  
      // Fetch the departments
      const response = await axiosInstance.get("/departments");
      console.log("Departments response data:", response.data); // Log response for debugging
  
      if (userResponse.data.user.role === "employee") {
        // Employees only have one department
        setDepartment(response.data.length > 0 ? response.data[0] : null);
      } else {
        // Admin or manager can see all departments
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching department:", error); // Log the detailed error
      setError("Failed to fetch department information.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDepartment();
  }, []);

  if (loading) {
    return <p>Loading department information...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (role === "employee") {
    // Show department details only for employees
    return (
      <div className="content">
        <h2 className="text-3xl font-bold mb-6">My Department</h2>
        {department ? (
          <div className="bg-white p-6 shadow-md rounded-lg">
            <h3 className="text-xl font-bold mb-4">{department.name}</h3>
            <p className="mb-2">
              <strong>Description:</strong> {department.description}
            </p>
            <p className="mb-2">
              <strong>Manager:</strong> {department.manager ? department.manager.fullName : "N/A"}
            </p>
          </div>
        ) : (
          <p>No department information available.</p>
        )}
      </div>
    );
  }

  // Admin and Manager view with add/edit/delete capabilities
  return (
    <div className="content">
      <h2 className="text-3xl font-bold mb-6">Departments</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center"
        onClick={() => setShowAddModal(true)}
      >
        <FaPlus className="mr-2" /> Add Department
      </button>
      {loading ? (
        <p>Loading departments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Department Name
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Description
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{dept.name}</td>
                <td className="py-3 px-4">{dept.description}</td>
                <td className="py-3 px-4 flex gap-4">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => handleEdit(dept)}
                  />
                  <FaTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(dept._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <AddDepartmentModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDepartment}
        />
      )}

      {showEditModal && currentDepartment && (
        <EditDepartmentModal
          department={currentDepartment}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

// AddDepartmentModal Component
const AddDepartmentModal = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!name || !description) {
      alert("All fields are required");
      return;
    }

    onSave({ name, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-2xl font-bold mb-4">Add Department</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            Department Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-box"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

// EditDepartmentModal Component
const EditDepartmentModal = ({ department, onClose, onSave }) => {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(department.description);

  const handleSubmit = () => {
    if (!name || !description) {
      alert("All fields are required");
      return;
    }

    onSave({ ...department, name, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-2xl font-bold mb-4">Edit Department</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">
            Department Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-box"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-box"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Departments;
