
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import PublicProfile from "./pages/PublicProfile";
import CareerInsights from "./pages/CareerInsights";
import JobMatch from "./pages/JobMatch";
import Community from "./pages/Community";
// Route protection
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const location = useLocation();

  // Hide Navbar on auth/welcome pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/welcome";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Show Navbar only when logged in */}
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-builder"
            element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career-insights"
            element={
              <ProtectedRoute>
                <CareerInsights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-match"
            element={
              <ProtectedRoute>
                <JobMatch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            }
          />  
          <Route
            path="/u/:slug"
            element={
              <ProtectedRoute>
                <PublicProfile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </main>
    </div>
  );
}