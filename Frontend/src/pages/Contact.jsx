import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        timestamp: Timestamp.now(),
      });

      setFormData({ fullName: "", email: "", comment: "" });
      setSuccessMessage("✅ Thank you for reaching out! We'll get back to you soon.");
    } catch (error) {
      console.error("Error saving message:", error);
      setSuccessMessage("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
    setTimeout(() => setSuccessMessage(""), 5000); // auto-hide after 5s
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/dog-contact-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 -z-10" />
      </div>

      {/* Form Card */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-2xl z-10">
          <h2 className="text-2xl font-bold text-gray-700 text-center">Contact Us 🐾</h2>
          <p className="text-gray-500 text-center mt-1">We’d love to hear from you!</p>

          {successMessage && (
            <div
              className={`mt-4 p-3 rounded-lg text-center font-semibold transition-all duration-300 ${
                successMessage.startsWith("✅")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="fullName" className="text-gray-600 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 shadow-sm"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="text-gray-600 block mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 shadow-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="comment" className="text-gray-600 block mb-1">
                Message
              </label>
              <textarea
                id="comment"
                name="comment"
                placeholder="Write your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 shadow-sm h-24"
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-lg text-lg font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
