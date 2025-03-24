import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-rose-600">
        🐾 Dog360
      </Link>

      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-600 font-medium">👋 {user.email}</span>
            <Link to="/profile" className="text-rose-600 hover:underline font-semibold">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-rose-600 hover:underline font-semibold">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;