import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or <LoadingSpinner /> if you have one
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
