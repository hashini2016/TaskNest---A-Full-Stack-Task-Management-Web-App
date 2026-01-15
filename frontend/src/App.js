import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Header from "./components/Header";
import Auth from "./components/Auth";
import Signup from "./components/SignUp";
import ForgotPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import ViewTask from "./components/TaskList";

import { authActions } from "./store";

/* ---------------- Protected Route ---------------- */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  /* Persist login on refresh */
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  return (
    <>
      <Header />

      <main>
        <Routes>
          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route
            path="/auth"
            element={!isLoggedIn ? <Auth /> : <Navigate to="/home" replace />}
          />

          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to="/home" replace />}
          />

          <Route
            path="/forgot-password"
            element={
              !isLoggedIn ? <ForgotPassword /> : <Navigate to="/home" replace />
            }
          />

          {/* ---------------- PROTECTED ROUTES ---------------- */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-task"
            element={
              <ProtectedRoute>
                <AddTask />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-task"
            element={
              <ProtectedRoute>
                <ViewTask />
              </ProtectedRoute>
            }
          />

          {/* ---------------- DEFAULT ROUTES ---------------- */}
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? "/home" : "/auth"} replace />}
          />

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;