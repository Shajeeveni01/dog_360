import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import BloodReport from "./pages/BloodReport";
import Reminders from "./pages/Reminders";
import HealthRecords from "./pages/HealthRecords";
import Contact from "./pages/Contact";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <Layout>
              <Upload />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/blood-report"
        element={
          <PrivateRoute>
            <Layout>
              <BloodReport />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/reminders"
        element={
          <PrivateRoute>
            <Layout>
              <Reminders />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/health-records"
        element={
          <PrivateRoute>
            <Layout>
              <HealthRecords />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
