import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Box, Toolbar, Typography, Paper } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as dashboardService from "../services/dashboardService";

function Dashboard() {
  const [stats, setStats] = useState({
    users: { Admin: 0, Teacher: 0, Committee: 0 },
    students: { Active: 0, Inactive: 0 },
  });

  useEffect(() => {
    async function fetchStats() {
      const [userRes, studentRes] = await Promise.all([
        dashboardService.getUserStats(),
        dashboardService.getStudentStats(),
      ]);
      setStats({
        users: userRes.data,
        students: studentRes.data,
      });
    }
    fetchStats();
  }, []);

  const chartData = [
    { name: "Admin", count: stats.users.Admin },
    { name: "Teacher", count: stats.users.Teacher },
    { name: "Committee", count: stats.users.Committee },
    { name: "Student (Active)", count: stats.students.Active },
    { name: "Student (Inactive)", count: stats.students.Inactive },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography
          variant="h4"
          fontWeight={600}
          color="#1976d2"
          fontFamily={"Kanit, sans-serif"}
        >
          รายงานการโอนนักเรียน
        </Typography>
        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            สถิติผู้ใช้งานและนักศึกษา
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" label="จำนวน (คน)" fill="#FF5733" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>
    </Box>
  );
}

export default Dashboard;
