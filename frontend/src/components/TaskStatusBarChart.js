import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import { Box, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartDataLabels
);

const TaskStatusBarChart = () => {
  const [counts, setCounts] = useState({
    Low: 0,
    Medium: 0,
    High: 0
  });

  useEffect(() => {
  axios
    .get("http://localhost:5000/api/task/statusCount")
    .then((res) => setCounts(res.data))
    .catch((err) => console.error(err));
}, []);


  const data = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Task Count",
        data: [counts.Low, counts.Medium, counts.High],
        backgroundColor: ["#f57c00", "#1976d2", "#388e3c"]
      }
    ]
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false, // 🔴 REQUIRED
  scales: {
    y: {
      beginAtZero: true
    }
  }
};


  return (
    <Box
  sx={{
    bgcolor: "#fff",
    p: 2,
    borderRadius: 1,
    width: 800,           // chart width
    height: 400,          // chart height
    mx: "auto",           // horizontal center
    display: "flex",      // flex container
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"  // vertical center inside Box
  }}
>
  <Typography variant="h6" mb={1}>
    Task Progress
  </Typography>

  <Bar data={data} options={options} />
</Box>

  );
};

export default TaskStatusBarChart;