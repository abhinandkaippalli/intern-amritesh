import React, { useEffect, useState } from "react";
import Home from "./Home";
import Tasks from "./Tasks";
import axiosInstance from "../../utils/axiosInstance";

const DashboardContainer = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [inProgressTasks, setInProgressTasks] = useState(0);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState("John Doe");
  const [recentActivities, setRecentActivities] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user role
    const fetchUserRole = async () => {
      try {
        const userResponse = await axiosInstance.get("/get-user");
        setUserRole(userResponse.data?.user?.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    fetchUserRole().then(() => {
      if (userRole === "admin" || userRole === "manager") {
        fetchDashboardData();
      }
    });
  }, [userRole]);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      const employeeResponse = await axiosInstance.get("/employees");
      setTotalEmployees(employeeResponse?.data?.length || 0);

      const departmentResponse = await axiosInstance.get("/departments");
      setTotalDepartments(departmentResponse?.data?.length || 0);

      const taskResponse = await axiosInstance.get("/tasks");
      const tasks = taskResponse?.data || [];

      setPendingTasks(tasks.filter((task) => task.status === "Pending").length);
      setCompletedTasks(tasks.filter((task) => task.status === "Completed").length);
      setInProgressTasks(tasks.filter((task) => task.status === "In Progress").length);

      setTasksCompletedToday(
        tasks.filter(
          (task) =>
            task.status === "Completed" &&
            new Date(task.completedAt).toDateString() === new Date().toDateString()
        ).length
      );

      // Update employee of the month and recent activities (dummy data)
      setEmployeeOfTheMonth("John Doe");
      setRecentActivities([
        "Task 'Create Sales Report' marked as completed by Sarah.",
        "Department 'Finance' added by Admin.",
        "Employee 'Mark Spencer' promoted to Manager.",
        "Task 'Update HR Policies' assigned to David.",
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <div>
      <Home
        totalEmployees={totalEmployees}
        totalDepartments={totalDepartments}
        pendingTasks={pendingTasks}
        completedTasks={completedTasks}
        inProgressTasks={inProgressTasks}
        tasksCompletedToday={tasksCompletedToday}
        employeeOfTheMonth={employeeOfTheMonth}
        recentActivities={recentActivities}
        userRole={userRole}
      />
      <Tasks fetchDashboardData={fetchDashboardData} userRole={userRole} />
    </div>
  );
};

export default DashboardContainer;
