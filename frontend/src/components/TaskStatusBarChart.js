import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";
import { Box, Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskStatusBarChart = () => {
  const [counts, setCounts] = useState({
    todo: 0,
    development: 0,
    done: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/task/status-count"
        );
        setCounts(res.data);
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["TO DO", "Development", "Done"],
    datasets: [
      {
        label: "Task Count",
        data: [counts.todo, counts.development, counts.done],
        backgroundColor: ["#f57c00", "#1976d2", "#388e3c"]
      }
    ]
  };

  return (
    <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>
        Task Progress
      </Typography>
      <Bar data={data} />
    </Box>
  );
};

export default TaskStatusBarChart;
