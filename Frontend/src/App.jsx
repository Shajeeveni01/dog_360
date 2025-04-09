import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import BloodReport from "./pages/BloodReport";
import Reminders from "./pages/Reminders";
import HealthRecords from "./pages/HealthRecords";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={2500} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />

        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <Layout><Upload /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout><Profile /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/blood-report"
          element={
            <PrivateRoute>
              <Layout><BloodReport /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <PrivateRoute>
              <Layout><Reminders /></Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/health-records"
          element={
            <PrivateRoute>
              <Layout><HealthRecords /></Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
