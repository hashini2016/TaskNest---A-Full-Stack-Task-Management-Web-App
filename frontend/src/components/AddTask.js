import React, { useState } from "react";
import profileImage from "../assets/profileImage.png";
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
  ListItemText,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

const AddTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 USER INFO (same as Home)
  const admin = {
    name: "Hashi Liyo",
    email: "hashiliyo@exsample.com",
    role: "User",
    profileImage: "/profileImage.png",
  };

  const [inputs, setInputs] = useState({
    description: "",
    startDate: "",
    endDate: "",
    priority: "",
    remark: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const priorities = ["Low", "Medium", "High"];

  // 🔹 Sidebar menu
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

  const validateField = (name, value) => {
    if (!value && name !== "remark") return "This field is required";

    if (name === "startDate" && inputs.endDate && value > inputs.endDate) {
      return "Start date cannot exceed end date";
    }

    if (name === "endDate" && inputs.startDate && value < inputs.startDate) {
      return "End date cannot be before start date";
    }

    return "";
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
      setToast({
        open: true,
        message: "Please fix the errors",
        severity: "error",
      });
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      await axios.post("http://localhost:5000/api/task", {
        ...inputs,
        userId,
      });

      setToast({
        open: true,
        message: "Task created successfully!",
        severity: "success",
      });

      setInputs({
        description: "",
        startDate: "",
        endDate: "",
        priority: "",
        remark: "",
      });
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
          src={profileImage}
          alt={admin.name}
          sx={{ width: 80, height: 80, mb: 1 }}
        />

        {/* ROLE */}
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
          {localStorage.getItem("name")}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {localStorage.getItem("email")}
        </Typography>

        <Divider sx={{ bgcolor: "white", width: "100%", my: 2 }} />

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
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p}>
                {p}
              </MenuItem>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              padding: 1.5,
              backgroundColor: "#8b348e",
              "&:hover": {
                backgroundColor: "#4a1f4d",
              },
            }}
          >
            Create Task
          </Button>
        </form>
      </Box>

      {/* TOAST */}
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
