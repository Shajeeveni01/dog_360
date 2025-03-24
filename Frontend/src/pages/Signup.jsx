import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";


const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match! ❌");
      return;
    }
  
    try {
      const userCredential = await signup(formData.email, formData.password);
      const user = userCredential.user;
  
      // ✅ Save extra user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString(),
      });
  
      alert("🎉 Account created successfully!");
      navigate("/profile");
    } catch (err) {
        console.error("Signup error:", err);
        setError(err.message);
      }
      
  };  

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 p-6">
      <div className="relative flex bg-white bg-opacity-90 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl z-10">
        
        {/* Left: Image */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-200 to-amber-100 items-center justify-center">
          <img
            src="/dog-login.jpg"
            alt="Dog"
            className="w-80 rounded-lg shadow-lg"
          />
        </div>

        {/* Right: Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-700 text-center">Create an Account 🐶</h2>
          <p className="text-gray-500 text-center mb-4">Sign up to get started</p>

          {error && (
            <p className="text-red-600 text-center bg-red-100 p-2 rounded-lg mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-gray-600 block mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg transition duration-200"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-rose-600 font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;