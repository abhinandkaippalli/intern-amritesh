import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/employees");
      setEmployees(response.data);
    } catch (err) {
      setError("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axiosInstance.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (err) {
        alert("Failed to delete employee.");
      }
    }
  };

  const handleAddEmployee = async (employeeData) => {
    try {
      console.log("Adding employee:", employeeData);
      await axiosInstance.post("/employees", employeeData);
      setShowAddModal(false);
      fetchEmployees();
    } catch (err) {
      alert("Failed to add employee.");
      console.error("Error:", err.response ? err.response.data : err);
    }
  };

  const handleEditEmployee = async (employeeData) => {
    try {
      console.log("Editing employee:", employeeData);

      if (
        !employeeData.department ||
        typeof employeeData.department !== "string"
      ) {
        alert("Department must be provided as a valid name.");
        return;
      }

      await axiosInstance.put(
        `/employees/${currentEmployee._id}`,
        employeeData
      );
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      alert("Failed to update employee.");
      console.error("Error:", err.response ? err.response.data : err);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Employees</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center"
        onClick={() => setShowAddModal(true)}
      >
        <FaPlus className="mr-2" /> Add Employee
      </button>
      {loading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Name
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Email
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Role
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Department
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{employee.fullName}</td>
                <td className="py-3 px-4">{employee.email}</td>
                <td className="py-3 px-4">{employee.role}</td>
                <td className="py-3 px-4">
                  {employee.department?.name || "N/A"}
                </td>
                <td className="py-3 px-4">
                  <button
                    className="text-blue-500 mr-2"
                    onClick={() => {
                      setCurrentEmployee(employee);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(employee._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showAddModal && (
        <EmployeeModal
          title="Add Employee"
          onClose={() => setShowAddModal(false)}
          onSave={handleAddEmployee}
        />
      )}

      {showEditModal && currentEmployee && (
        <EmployeeModal
          title="Edit Employee"
          employee={currentEmployee}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditEmployee}
        />
      )}
    </div>
  );
};

const EmployeeModal = ({ title, employee, onClose, onSave }) => {
  const [fullName, setFullName] = useState(employee ? employee.fullName : "");
  const [email, setEmail] = useState(employee ? employee.email : "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(employee ? employee.role : "employee");
  const [department, setDepartment] = useState(
    employee ? employee.department?.name : ""
  );

  const handleSubmit = () => {
    if (
      !fullName ||
      !email ||
      (!employee && !password) ||
      !role ||
      !department
    ) {
      alert("All fields are required.");
      return;
    }
    onSave({ fullName, email, password, role, department });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-box"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-box"
          />
        </div>
        {!employee && (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-box"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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

export default Employees;
