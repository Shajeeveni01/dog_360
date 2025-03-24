import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const getLinkClass = (path) =>
    `px-4 py-2 rounded-lg text-lg font-semibold transition duration-300 ${
      location.pathname === path ? "bg-rose-600 text-white" : "bg-white text-gray-800 hover:bg-rose-500 hover:text-white"
    }`;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
    }
  };

  // 🔒 If not logged in, return nothing (or you can return a simplified logo)
  if (!user) return null;

  return (
    <header className="bg-rose-200 p-3 shadow-md">
      <div className="w-full flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.jpg" 
            alt="Dog360 Logo" 
            className="w-24 h-24 rounded-full border border-gray-500"
          />
          <span className="text-gray-900 font-bold text-3xl">Dog360</span>
        </div>

        <nav className="flex space-x-4">
          <Link to="/" className={getLinkClass("/")}>Home</Link>
          <Link to="/upload" className={getLinkClass("/upload")}>Skin Detection</Link>
          <Link to="/blood-report" className={getLinkClass("/blood-report")}>Blood Analysis</Link>
          <Link to="/reminders" className={getLinkClass("/reminders")}>Reminders</Link>
          <Link to="/health-records" className={getLinkClass("/health-records")}>Health Records</Link>
          <Link to="/contact" className={getLinkClass("/contact")}>Contact</Link>
          <Link to="/profile" className={getLinkClass("/profile")}>Profile</Link>
          <button 
            onClick={handleLogout} 
            className="px-5 py-2 text-lg rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition duration-300"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;