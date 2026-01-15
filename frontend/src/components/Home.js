import React, { useEffect, useState } from "react";
import TaskStatusBarChart from "../components/TaskStatusBarChart";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [recentTasks, setRecentTasks] = useState([]);

  // User info (can later fetch from API)
  const admin = {
    name: "Hashi Liyo",
    email: "hashiliyo@exsample.com",
    role: "User",
    profileImage: "/profileImage.png",
  };

  const menuItems = [
    { text: "Dashboard", path: "/home" },
    { text: "All Task", path: "/view-task" },
    { text: "Add Task", path: "/add-task" },
    { text: "Logout", path: "/auth" },
  ];

  const handleNavigation = (path) => {
    if (path === "/auth") {
      localStorage.removeItem("userId");
      dispatch(authActions.logout());
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  // Fetch recent tasks
  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/tasks?limit=3"
        );
        setRecentTasks(res.data.tasks);
      } catch (error) {
        console.error("Failed to load recent tasks", error);
      }
    };

    fetchRecentTasks();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Box
        sx={{
          width: 260,
          bgcolor: "#7b337e",
          color: "white",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* PROFILE */}
        <Avatar
          src={admin.profileImage}
          alt={admin.name}
          sx={{ width: 80, height: 80, mb: 1 }}
        />

        {/* ROLE BUTTON */}
        <Button
          variant="contained"
          size="small"
          sx={{
            mb: 1,
            bgcolor: "#a44db2",
            borderRadius: 2,
            fontSize: "12px",
            px: 2,
          }}
        >
          {admin.role}
        </Button>

        <Typography variant="subtitle1" fontWeight="bold">
          {admin.name}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {admin.email}
        </Typography>

        <Divider sx={{ bgcolor: "white", width: "100%", mt: 2, mb: 2 }} />

        {/* MENU */}
        <List sx={{ width: "100%" }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#5e2860" },
              }}
            >
              <ListItemText primary={item.text} sx={{ pl: 1 }} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" mb={2}>Welcome to TaskNest!</Typography>
        <TaskStatusBarChart />
        <Typography variant="h5" mb={2}>
          Recent Tasks
        </Typography>

        <Grid container spacing={2}>
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <Grid item xs={12} md={4} key={task._id}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                      {task.description}
                    </Typography>

                    <Chip
                      label={task.status}
                      color={
                        task.status === "Completed" ? "success" : "warning"
                      }
                      size="small"
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No recent tasks available.</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
