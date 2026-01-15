import React, { useEffect, useState } from "react";
import profileImage from "../assets/profileImage.png";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Avatar,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store";

const priorities = ["Low", "Medium", "High"];

const TaskList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🔹 USER INFO (same as other pages)
  const admin = {
    name: "Hashi Liyo",
    email: "hashiliyo@exsample.com",
    role: "User",
    profileImage: "/profileImage.png",
  };

  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Edit popup state
  const [openEdit, setOpenEdit] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [inputs, setInputs] = useState({
    description: "",
    startDate: "",
    endDate: "",
    priority: "",
    remark: "",
  });
  const [errors, setErrors] = useState({});

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

  // ================= API =================
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/task");
      setTasks(res.data.tasks);
    } catch {
      setToast({
        open: true,
        message: "Error fetching tasks",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/task/${id}`);
      setToast({
        open: true,
        message: "Task deleted successfully",
        severity: "success",
      });
      fetchTasks();
    } catch {
      setToast({
        open: true,
        message: "Error deleting task",
        severity: "error",
      });
    }
  };

  // ================= EDIT =================
  const handleEditOpen = (task) => {
    setEditTaskId(task._id);
    setInputs({
      description: task.description,
      startDate: task.startDate?.split("T")[0],
      endDate: task.endDate?.split("T")[0],
      priority: task.priority,
      remark: task.remark || "",
    });
    setErrors({});
    setOpenEdit(true);
  };

  const validateField = (name, value) => {
    if (!value && name !== "remark") return "Required";
    if (name === "startDate" && inputs.endDate && value > inputs.endDate)
      return "Start date cannot exceed end date";
    if (name === "endDate" && inputs.startDate && value < inputs.startDate)
      return "End date cannot be before start date";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: validateField(name, value) }));
  };

  const handleUpdate = async () => {
    const newErrors = {};
    Object.keys(inputs).forEach(
      (k) => k !== "remark" && (newErrors[k] = validateField(k, inputs[k]))
    );
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    try {
      await axios.put(`http://localhost:5000/api/task/${editTaskId}`, inputs);
      setToast({
        open: true,
        message: "Task updated successfully",
        severity: "success",
      });
      setOpenEdit(false);
      fetchTasks();
    } catch {
      setToast({
        open: true,
        message: "Error updating task",
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

      {/* CONTENT */}
      <Box sx={{ flex: 1, p: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="h4" mb={3}>
          All Tasks
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task._id}>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.startDate?.split("T")[0]}</TableCell>
                  <TableCell>{task.endDate?.split("T")[0]}</TableCell>
                  <TableCell>{task.priority}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* EDIT DIALOG */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={inputs.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              margin="normal"
            />

            <TextField
              fullWidth
              type="date"
              name="startDate"
              label="Start Date"
              value={inputs.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.startDate}
              helperText={errors.startDate}
              margin="normal"
            />

            <TextField
              fullWidth
              type="date"
              name="endDate"
              label="End Date"
              value={inputs.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate}
              margin="normal"
            />

            <TextField
              select
              fullWidth
              name="priority"
              label="Priority"
              value={inputs.priority}
              onChange={handleChange}
              margin="normal"
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
              label="Remark"
              value={inputs.remark}
              onChange={handleChange}
              margin="normal"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button   sx={{ cursor: "pointer", bgcolor: "#8b348e" }} variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* TOAST */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={() => setToast({ ...toast, open: false })}
        >
          <Alert severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default TaskList;
