const EmployeeModal = ({ title, employee, onClose, onSave }) => {
  const [fullName, setFullName] = useState(employee ? employee.fullName : "");
  const [email, setEmail] = useState(employee ? employee.email : "");
  const [password, setPassword] = useState(""); 
  const [role, setRole] = useState(employee ? employee.role : "employee");
  const [department, setDepartment] = useState(
    employee ? employee.department?.name : ""
  );

  const handleSubmit = () => {
    if (!fullName || !email || !password || !role || !department) {
      alert("All fields are required");
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
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-box"
          />
        </div>
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
