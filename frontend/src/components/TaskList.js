import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";


const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // For edit
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Sidebar menu items
  const menuItems = [
    { text: "Dashboard", path: "/blogs" },
    { text: "All Task", path: "/view-task" },
    { text: "Add Task", path: "/add-task" },
    { text: "Logout", path: "/auth" },
  ];

  const handleNavigation = (path) => {
    if (path === "/auth") {
      localStorage.removeItem("userId");
      dispatch(authActions.logout()); // <-- fix applied
      navigate("/auth");
    } else {
      navigate(path);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/task"); // Backend route
      setTasks(res.data.tasks); // <-- access tasks array correctly
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Error fetching tasks", severity: "error" });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${id}`);
      setToast({ open: true, message: "Task deleted successfully", severity: "success" });
      fetchTasks(); // Refresh table
    } catch (err) {
      console.error(err);
      setToast({ open: true, message: "Error deleting task", severity: "error" });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper: format ISO date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toISOString().split("T")[0];
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

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" mb={3}>
          Task Dashboard
        </Typography>

        {/* Add/Edit Task form */}
     

        {/* Task Table */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell>{task.description}</TableCell>
                    <TableCell>{formatDate(task.startDate)}</TableCell>
                    <TableCell>{formatDate(task.endDate)}</TableCell>
                    <TableCell>{task.priority}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleEdit(task)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(task._id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tasks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={toast.severity}
            variant="filled"
            onClose={() => setToast({ ...toast, open: false })}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default TaskList;
