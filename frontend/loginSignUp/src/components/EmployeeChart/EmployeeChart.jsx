import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EmployeeChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={500}> {/* Adjust height for a bigger chart */}
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="department" />
        <YAxis domain={[0, 50]} /> {/* Set Y-axis domain from 0 to 50 */}
        <Tooltip />
        <Legend />
        <Bar dataKey="employees" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { EmployeeChart };
