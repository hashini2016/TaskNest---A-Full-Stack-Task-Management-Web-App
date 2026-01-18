import { Box, Button, TextField, Typography, Link } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signupImage from "../assets/signupimg.png";

const Signup = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validateField = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (name === "password" && value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  
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


  const validateForm = () => {
    const newErrors = {
      name: validateField("name", inputs.name),
      email: validateField("email", inputs.email),
      password: validateField("password", inputs.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  
  const sendSignupRequest = async () => {
    const res = await axios.post("http://localhost:5000/api/user/signup", {
      name: inputs.name,
      email: inputs.email,
      password: inputs.password,
    });
    return res.data;
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
      const data = await sendSignupRequest();

      if (data?.user?._id) {
        setToast({
          open: true,
          message: "Signup successful! Please login.",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/auth");
        }, 1500);
      }
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || "Signup failed",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "90vh", display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "white",
          padding: 4,
        }}
      >
        <Box
          maxWidth={400}
          width="100%"
          boxShadow="10px 10px 20px rgba(19, 17, 20, 0.3)"
          padding={4}
          borderRadius={5}
        >
          <Typography variant="h4" textAlign="center" mb={2}>
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Full Name"
              margin="normal"
              required
              error={Boolean(errors.name)}
              helperText={errors.name}
            />

            <TextField
              fullWidth
              name="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Email"
              margin="normal"
              required
              error={Boolean(errors.email)}
              helperText={errors.email}
            />

            <TextField
              fullWidth
              name="password"
              type="password"
              value={inputs.password}
              onChange={handleChange}
              placeholder="Password"
              margin="normal"
              required
              error={Boolean(errors.password)}
              helperText={errors.password}
            />

            <Box display="flex" justifyContent="flex-end" mt={1} mb={2}>
                          <Typography
                            variant="body2"
                            textAlign="center"
                            mt={2}
                            sx={{ cursor: "pointer", color: "#8b348e" }}
                            onClick={() => navigate("/auth")}
                          >
                            Already have an account? Login
                          </Typography>
              
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 3,
                padding: 1.5,
                backgroundColor: "#8b348e",
                "&:hover": {
                  backgroundColor: "#4a1f4d",
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${signupImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      />

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

export default Signup;
