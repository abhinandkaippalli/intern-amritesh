import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axiosInstance from "../../utils/axiosInstance";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [employeesByDepartment, setEmployeesByDepartment] = useState({});
  const [userRole, setUserRole] = useState(null);

  // Fetch User Role
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userResponse = await axiosInstance.get("/get-user");
        setUserRole(userResponse.data.user.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };
    fetchUserRole();
  }, []);

  // Fetch Dashboard Data
  const fetchDashboardData = async () => {
    try {
      const employeeResponse = await axiosInstance.get("/employees");
      const employees = employeeResponse.data;
      setTotalEmployees(employees.length);

      const departmentResponse = await axiosInstance.get("/departments");
      const departments = departmentResponse.data;
      setTotalDepartments(departments.length);

      // Count employees by department
      const departmentEmployeeCounts = departments.reduce((acc, department) => {
        acc[department.name] = employees.filter(
          (employee) => employee.department._id === department._id
        ).length;
        return acc;
      }, {});

      setEmployeesByDepartment(departmentEmployeeCounts);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  // Fetch data initially and when tasks change
  useEffect(() => {
    if (userRole === "admin" || userRole === "manager") {
      fetchDashboardData();
    }
  }, [userRole]);

  const departmentNames = Object.keys(employeesByDepartment);
  const departmentEmployeeCounts = Object.values(employeesByDepartment);

  const employeeDepartmentData = {
    labels: departmentNames,
    datasets: [
      {
        label: "Employees by Department",
        data: departmentEmployeeCounts,
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 50, // Set the maximum value to 50
        ticks: {
          stepSize: 5, // Set the step size to 5 for better visualization
          precision: 0, // Ensure only whole numbers are shown.
        },
      },
      x: {
        ticks: {
          autoSkip: false, // Prevents skipping labels, useful if there are a few departments.
          maxRotation: 0, // Ensures the labels are horizontal.
          minRotation: 0,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 8,
        },
      },
      title: {
        display: false,
      },
    },
  };

  return (
    <div className="p-2 max-w-screen-lg mx-auto h-full flex flex-col gap-2">
      <h2 className="text-lg font-bold text-center mb-2">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
        {userRole === "admin" || userRole === "manager" ? (
          <>
            <div className="widget bg-white p-2 shadow-md rounded-md text-center h-20 flex flex-col justify-center">
              <h3 className="text-xs font-semibold mb-1">Employees</h3>
              <p className="text-lg font-bold">{totalEmployees}</p>
            </div>
            <div className="widget bg-white p-2 shadow-md rounded-md text-center h-20 flex flex-col justify-center">
              <h3 className="text-xs font-semibold mb-1">Departments</h3>
              <p className="text-lg font-bold">{totalDepartments}</p>
            </div>
          </>
        ) : null}
      </div>

      <div
        className="flex-1 bg-white p-4 shadow-md rounded-md mb-4 flex items-center justify-center w-full"
        style={{ height: "65vh" }} // Adjusted the height to take up 65% of the viewport height
      >
        <div className="w-full h-full">
          <Bar data={employeeDepartmentData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Home;