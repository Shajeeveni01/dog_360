import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState(""); // Success/Error message
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous messages

    try {
      await login(email, password);
      setIsError(false);
      setMessage("🎉 Login successful!");

      setTimeout(() => {
        navigate("/"); // Redirect to homepage after message
      }, 1500);
    } catch (error) {
      setIsError(true);
      setMessage("❌ Login failed: " + error.message);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-rose-100 to-amber-100">
      <div className="relative flex bg-white bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl z-10">
        
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-700 text-center">Welcome Back! 🐶</h2>
          <p className="text-gray-500 text-center mb-6">Log in to continue</p>

          {/* Message Box */}
          {message && (
            <div
              className={`mb-4 text-center px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-300 ${
                isError
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition duration-200 font-semibold"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-rose-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-200 to-amber-100 items-center justify-center">
          <img
            src="/dog-login.jpg"
            alt="Dog"
            className="w-80 rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
