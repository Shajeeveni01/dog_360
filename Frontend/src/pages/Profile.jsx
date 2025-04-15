import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    breed: "",
    color: "",
  });

  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "dogProfiles", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          name: data.name || "",
          age: data.age || "",
          breed: data.breed || "",
          color: data.color || "",
        });
        setIsEditing(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "dogProfiles", user.uid), profileData);
      alert("✅ Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error saving profile.");
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/profile-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl z-10 text-center">

        {/* 🐶 Top Static Dog Image */}
        <img
  src="/dog-group.png"
  alt="Default Dog Group"
  className="w-60 h-60 object-cover rounded-full border-4 border-rose-400 mx-auto mb-4 shadow-md"
/>




        {/* Form or Info */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
            {Object.entries(profileData).map(([field, value]) => (
              <div key={field}>
                <label htmlFor={field} className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  autoComplete="off"
                  type={field === "age" ? "number" : "text"}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-semibold"
            >
              Save Profile
            </button>
          </form>
        ) : (
          <div className="mt-4 bg-rose-50 p-6 rounded-xl shadow-md text-left space-y-3">
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Age:</strong> {profileData.age}</p>
            <p><strong>Breed:</strong> {profileData.breed}</p>
            <p><strong>Color:</strong> {profileData.color}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 font-semibold"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
