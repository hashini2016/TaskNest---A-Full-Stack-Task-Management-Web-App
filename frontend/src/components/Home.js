import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch

  const menuItems = [
    { text: "Dashboard", path: "/blogs" },
    { text: "All Task", path: "/view-task" },
    { text: "Add Task", path: "/add-task" },
    { text: "Logout", path: "/auth" }, 
  ];

  const handleNavigation = (path) => {
    if (path === "/auth") {
      localStorage.removeItem("userId"); // Remove from localStorage
      dispatch(authActions.logout());     // Update Redux state
      navigate("/auth");                  // Navigate to login
    } else {
      navigate(path);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          bgcolor: "#7b337e",
          color: "white",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Typography variant="h5" mb={3} textAlign="center">
          TaskNest
        </Typography>
        <Divider sx={{ bgcolor: "white", mb: 2 }} />

        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              sx={{ mb: 1, borderRadius: 1, "&:hover": { bgcolor: "#5e2860" } }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" mb={3}>
          Welcome to TaskNest
        </Typography>
        <Typography>
          This is your home page. Use the sidebar to navigate through your dashboard, my blogs, add new blog, or logout.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
