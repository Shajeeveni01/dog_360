import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const getLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-lg font-semibold transition duration-300 ${
      location.pathname === path
        ? "bg-rose-600 text-white"
        : "bg-white text-gray-800 hover:bg-rose-500 hover:text-white"
    }`;

  const confirmLogout = async () => {
    await logout();
    setShowLogoutMessage(true);
    setShowConfirmLogout(false);
    setTimeout(() => {
      setShowLogoutMessage(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <header className="bg-rose-200 p-3 shadow-md relative z-50">
      {/* ✅ Logout success message */}
      {showLogoutMessage && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 bg-green-100 border border-green-400 text-green-700 px-6 py-2 rounded-lg text-center font-medium shadow-lg z-20">
          👋 You have been signed out successfully!
        </div>
      )}

      {/* ✅ Logout confirmation modal */}
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Confirm Sign Out</h2>
            <p className="text-gray-600">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowConfirmLogout(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Main Navigation Bar */}
      <div className="w-full flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="Dog360 Logo"
            className="w-24 h-24 rounded-full border border-gray-500"
          />
          <span className="text-gray-900 font-bold text-3xl">Dog360</span>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-4 items-center">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/contact" className={getLinkClass("/contact")}>Contact</Link>

          {!user ? (
            <>
              <Link to="/signup" className={getLinkClass("/signup")}>Sign Up</Link>
              <Link
                to="/login"
                className="px-5 py-2 text-lg rounded-lg bg-rose-500 text-white font-semibold hover:bg-rose-600 transition duration-300"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link to="/upload" className={getLinkClass("/upload")}>Skin Disease </Link>
              <Link to="/blood-report" className={getLinkClass("/blood-report")}>Blood Report </Link>
              <Link to="/reminders" className={getLinkClass("/reminders")}>Reminders</Link>
              <Link to="/health-records" className={getLinkClass("/health-records")}>Health Records</Link>
              <Link to="/profile" className={getLinkClass("/profile")}>Profile</Link>
              <button
                onClick={() => setShowConfirmLogout(true)}
                className="px-5 py-2 text-lg rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-100"
              >
                Sign Out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
