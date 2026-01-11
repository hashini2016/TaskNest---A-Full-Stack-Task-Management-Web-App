import {
  Box,
  Button,
  TextField,
  Typography
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import forgetPasswordImage from "../assets/forgetPasswordimg.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🔹 Field-level validation
  const validateField = (name, value) => {
    if (!value.trim()) return "This field is required";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email address";
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        return "Password must be at least 6 characters";
      }
    }

    if (name === "confirmPassword") {
      if (value !== inputs.password) {
        return "Passwords do not match";
      }
    }

    return "";
  };

  // 🔹 Handle typing
  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  // 🔹 Validate full form
  const validateForm = () => {
    const newErrors = {
      email: validateField("email", inputs.email),
      password: validateField("password", inputs.password),
      confirmPassword: validateField("confirmPassword", inputs.confirmPassword),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // 🔹 Submit
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
      const res = await axios.put(
        "http://localhost:5000/api/user/forgot-password",
        {
          email: inputs.email,
          password: inputs.password,
        }
      );

      setToast({
        open: true,
        message: res.data.message || "Password updated successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      
      {/* LEFT SIDE – FORM */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
        }}
      >
        <Box
          width={400}
          boxShadow="10px 10px 20px rgba(0,0,0,0.3)"
          padding={4}
          borderRadius={5}
        >
          <Typography variant="h5" textAlign="center" mb={2}>
            Reset Password
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="email"
              placeholder="Email"
              margin="normal"
              value={inputs.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
            />

            <TextField
              fullWidth
              name="password"
              type="password"
              placeholder="New Password"
              margin="normal"
              value={inputs.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />

            <TextField
              fullWidth
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              margin="normal"
              value={inputs.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, padding: 1.5 }}
            >
              Update Password
            </Button>

            {/* 🔹 Back to login */}
            <Typography
              variant="body2"
              textAlign="center"
              mt={2}
              sx={{ cursor: "pointer", color: "primary.main" }}
              onClick={() => navigate("/auth")}
            >
              Back to Login
            </Typography>
          </form>
        </Box>
      </Box>

      {/* RIGHT SIDE – IMAGE */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${forgetPasswordImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* 🔔 TOAST */}
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

export default ForgotPassword;
