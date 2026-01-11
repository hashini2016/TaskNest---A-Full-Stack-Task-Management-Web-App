import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";



const AddTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Add dispatch

  const [inputs, setInputs] = useState({
    description: "",
    startDate: "",
    endDate: "",
    priority: "",
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const priorities = ["TO DO", "Development", "Done"];

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

  const validateField = (name, value) => {
    let error = "";

    if (!value && name !== "remark") {
      error = "This field is required";
    }

    if (name === "startDate" && inputs.endDate && value > inputs.endDate) {
      error = "Start date cannot exceed end date";
    }

    if (name === "endDate" && inputs.startDate && value < inputs.startDate) {
      error = "End date cannot be before start date";
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(inputs).forEach((key) => {
      if (key !== "remark") newErrors[key] = validateField(key, inputs[key]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ open: true, message: "Please fix the errors", severity: "error" });
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/task", { ...inputs,userId });

      setToast({ open: true, message: "Task created successfully!", severity: "success" });
      setInputs({ description: "", startDate: "", endDate: "", priority: "", remark: "" });
      setErrors({});
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Error occurred",
        severity: "error",
      });
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

      {/* Main content */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" mb={3}>
          Add New Task
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="description"
            label="Task Description"
            value={inputs.description}
            onChange={handleChange}
            margin="normal"
            error={Boolean(errors.description)}
            helperText={errors.description}
          />

          <TextField
            fullWidth
            name="startDate"
            label="Start Date"
            type="date"
            value={inputs.startDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate || "Select start date"}
          />

          <TextField
            fullWidth
            name="endDate"
            label="End Date"
            type="date"
            value={inputs.endDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate || "Select end date"}
          />

          <TextField
            select
            fullWidth
            name="priority"
            label="Priority"
            value={inputs.priority}
            onChange={handleChange}
            margin="normal"
            error={Boolean(errors.priority)}
            helperText={errors.priority || "Select priority"}
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            name="remark"
            label="Remark (optional)"
            value={inputs.remark}
            onChange={handleChange}
            margin="normal"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Create Task
          </Button>
        </form>
      </Box>

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
  );
};

export default AddTask;
