import React from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/Admin/AdminPanel";
import SubmittedApplications from "./pages/Admin/SubmittedApplications";
import Apply from "./pages/User/Apply";
import MyApplications from "./pages/User/MyApplication";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply/:serviceId"
              element={
                <ProtectedRoute>
                  <Apply />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submitted-applications"
              element={<ProtectedRoute>
                  <SubmittedApplications />
                </ProtectedRoute>}
            />
          </Routes>
        </Container>
      </main>
    </div>
  );
}

export default App;
