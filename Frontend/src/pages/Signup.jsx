import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase/config";

const Signup = () => {
  const { signup, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      return setMessage("❌ Passwords do not match!");
    }

    try {
      const userCredential = await signup(formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString(),
      });

      await logout();
      setIsError(false);
      setMessage("🎉 Account created successfully! Please log in.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setIsError(true);
      setMessage("❌ " + err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName || "New User",
        createdAt: new Date().toISOString(),
      });

      setIsError(false);
      setMessage("🎉 Signed up with Google!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Google Signup Error:", err);
      setIsError(true);
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-200 px-4">
      <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl flex flex-col md:flex-row overflow-hidden w-full max-w-5xl">
        <div className="md:w-1/2 w-full bg-gradient-to-br from-rose-200 to-amber-100 flex items-center justify-center p-6">
          <img src="/dog-login.jpg" alt="Dog" className="rounded-xl w-full max-w-xs" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-2">Create an Account 🐶</h2>
          <p className="text-center text-gray-500 mb-4">Sign up to get started</p>

          {message && (
            <div className={`text-center mb-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm ${
              isError ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg font-semibold">
              Sign Up
            </button>
          </form>

          <div className="my-4 text-center text-gray-500">or</div>

          <button onClick={handleGoogleSignup}
            className="w-full bg-white text-gray-700 border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Sign up with Google
          </button>

          <p className="mt-4 text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-rose-600 font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
