import Header from "./components/Header";
import Auth from "./components/Auth";
import Signup from "./components/SignUp";
import ForgotPassword from "./components/ForgetPassword";
import ViewTask from "./components/TaskList"
import Home from "./components/Home";
import AddTask from "./components/AddTask";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store";

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      <Header />

      <main>
        <Routes>
          {/* Auth route: only accessible if NOT logged in */}
          <Route
            path="/auth"
            element={!isLoggedIn ? <Auth /> : <Navigate to="/home" />}
          />

          {/* Signup route */}
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to="/home" />}
          />

          {/* Forgot Password */}
          <Route
            path="/forgot-password"
            element={!isLoggedIn ? <ForgotPassword /> : <Navigate to="/home" />}
          />

          {/* Home */}
          <Route
            path="/home"
            element={isLoggedIn ? <Home /> : <Navigate to="/auth" />}
          />

           <Route
            path="/add-task"
            element={isLoggedIn ? <AddTask /> : <Navigate to="/auth" />}
          />

            <Route
            path="/view-task"
            element={isLoggedIn ? <ViewTask /> : <Navigate to="/auth" />}
          />


          {/* Default redirect */}
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/auth" />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
