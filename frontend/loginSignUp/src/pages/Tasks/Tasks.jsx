import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FaPlus, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Tasks = ({ onTaskChange }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    employeeEmail: '',
    taskDescription: '',
    deadline: '',
  });
  const [currentTask, setCurrentTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const userResponse = await axiosInstance.get('/get-user');
      setUserRole(userResponse.data.user.role);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchTasks();
  }, []);

  // Handle showing and hiding the Add Task Modal
  const handleAddTaskModalToggle = () => {
    setShowAddTaskModal(!showAddTaskModal);
  };

  // Handle Add Task Form changes
  const handleTaskChange = (e) => {
    setTaskDetails({
      ...taskDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Add Task Submission
  const handleAddTaskSubmit = async () => {
    try {
      await axiosInstance.post('/tasks', taskDetails);
      setShowAddTaskModal(false);
      setTaskDetails({ employeeEmail: '', taskDescription: '', deadline: '' });
      fetchTasks();
      onTaskChange && onTaskChange(); // Trigger refresh on parent component
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  // Handle showing and hiding the Edit Task Modal
  const handleEditTaskModalToggle = (task = null) => {
    setShowEditTaskModal(!showEditTaskModal);
    if (task) {
      setCurrentTask(task);
      setTaskDetails({
        employeeEmail: task.employeeEmail,
        taskDescription: task.taskDescription,
        deadline: new Date(task.deadline).toISOString().split('T')[0], // Format date properly
      });
    }
  };

  // Handle Edit Task Submission
  const handleEditTaskSubmit = async () => {
    if (!currentTask) return;

    try {
      await axiosInstance.put(`/tasks/${currentTask._id}`, taskDetails);
      setShowEditTaskModal(false);
      setTaskDetails({ employeeEmail: '', taskDescription: '', deadline: '' });
      setCurrentTask(null);
      fetchTasks();
      onTaskChange && onTaskChange(); // Trigger refresh on parent component
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      fetchTasks();
      onTaskChange && onTaskChange(); // Trigger refresh on parent component
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div className="content">
      <h2 className="text-3xl font-bold mb-6">My Tasks</h2>

      {userRole === 'admin' && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 flex items-center"
          onClick={handleAddTaskModalToggle}
        >
          <FaPlus className="mr-2" /> Add Task
        </button>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Task Description
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Deadline
              </th>
              {userRole === 'admin' && (
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-100">
                <td className="py-3 px-4">{task.taskDescription}</td>
                <td className="py-3 px-4">{task.deadline}</td>
                {userRole === 'admin' && (
                  <td className="py-3 px-4 flex gap-2">
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEditTaskModalToggle(task)}
                    />
                    <FaTrashAlt
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteTask(task._id)}
                    />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Add Task</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Employee Email</label>
              <input
                type="text"
                name="employeeEmail"
                value={taskDetails.employeeEmail}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Task Description</label>
              <input
                type="text"
                name="taskDescription"
                value={taskDetails.taskDescription}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={taskDetails.deadline}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={handleAddTaskModalToggle}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleAddTaskSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Edit Task</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Employee Email</label>
              <input
                type="text"
                name="employeeEmail"
                value={taskDetails.employeeEmail}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Task Description</label>
              <input
                type="text"
                name="taskDescription"
                value={taskDetails.taskDescription}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={taskDetails.deadline}
                onChange={handleTaskChange}
                className="input-box"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => handleEditTaskModalToggle()}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleEditTaskSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
