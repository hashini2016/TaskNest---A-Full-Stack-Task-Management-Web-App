import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginimg.png";

const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSignup, setIsSignup] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  
  // Admin info (can later fetch from API)
  const admin = {
    name: "Hashi Liyo",
    email: "hashiliyo@exsample.com",
    role: "User",
    profileImage: "/profileImage.png", // path to your uploaded image
  };

  // 🔹 Field validation
  const validateField = (name, value) => {
    if (!value.trim()) return "This field is required";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Invalid email address";
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

  // 🔹 Validate form before submit
  const validateForm = () => {
    const newErrors = {
      email: validateField("email", inputs.email),
      password: validateField("password", inputs.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  // 🔹 API call
  const sendRequest = async (type = "login") => {
    const res = await axios.post(
      `http://localhost:5000/api/user/${type}`,
      inputs
    );
    return res.data;
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

    if (isSignup) {
      navigate("/signup");
      return;
    }

    try {
      const data = await sendRequest();

      if (data?.user?._id) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("name",data.user.name);
        localStorage.setItem("email",data.user.email);
        dispatch(authActions.login());

        setToast({
          open: true,
          message: "Login successful",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/home");
        }, 1200);
      }
    } catch (err) {
      setToast({
        open: true,
        message:
          err.response?.data?.message || "Invalid email or password",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ minHeight: "90vh", display: "flex" }}>
      
      {/* LEFT SIDE – FORM */}
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
          boxShadow="10px 10px 20px rgba(0,0,0,0.3)"
          padding={4}
          borderRadius={5}
        >
          <Typography variant="h4" textAlign="center" mb={2}>
            Login
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
              placeholder="Password"
              margin="normal"
              value={inputs.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
            />

            <Box display="flex" justifyContent="space-between" mt={1} mb={2}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                sx={{ cursor: "pointer", color: "#8b348e" }}
              >
                Forgot Password?
              </Link>

              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/signup")}
                sx={{ cursor: "pointer", color: "#8b348e" }}
              >
                Create Account
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ borderRadius: 3, padding: 1.5 , mt: 2,
                padding: 1.5,
                backgroundColor: "#8b348e",
                "&:hover": {
                  backgroundColor: "#4a1f4d",
                },
              }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Box>

      {/* RIGHT SIDE – IMAGE */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* TOASTER */}
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

export default Auth;
