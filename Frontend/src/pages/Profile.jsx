import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const CLOUD_NAME = "dpcshviz6";
const UPLOAD_PRESET = "unsigned_preset"; // ✅ must match your Cloudinary setting


const Profile = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    breed: "",
    color: "",
  });

  const [profileImage, setProfileImage] = useState("");
  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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
        setProfileImage(data.imageUrl || "");
        setIsEditing(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      const imageUrl = res.data.secure_url;
      setProfileImage(imageUrl);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      alert("❌ Image upload failed. Try again.");
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("");
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await setDoc(doc(db, "dogProfiles", user.uid), {
        ...profileData,
        imageUrl: profileImage,
      });
      alert("✅ Profile saved successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Error saving profile.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: "url('/profile-background.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl z-10 text-center">
        <div
          className="relative w-40 h-40 rounded-full border-4 border-rose-400 shadow-md mx-auto overflow-hidden"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Photo</div>
          )}

          {hover && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center gap-3">
              <label className="text-white bg-white text-sm px-3 py-1 rounded cursor-pointer hover:bg-gray-200">
                Edit
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {profileImage && (
                <button onClick={handleDeleteImage} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            {Object.entries(profileData).map(([field, value]) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 capitalize mb-1" htmlFor={field}>
                  {field}
                </label>
                <input
                  id={field}
                  name={field}
                  type={field === "age" ? "number" : "text"}
                  value={value}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
                  placeholder={`Enter dog's ${field}`}
                  required
                />
              </div>
            ))}
            <button type="submit" className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition font-semibold">
              Save Profile
            </button>
          </form>
        ) : (
          <div className="mt-6 bg-rose-50 p-6 rounded-xl shadow-md text-left space-y-3">
            <p><strong>Name:</strong> {profileData.name}</p>
            <p><strong>Age:</strong> {profileData.age}</p>
            <p><strong>Breed:</strong> {profileData.breed}</p>
            <p><strong>Color:</strong> {profileData.color}</p>
            <button onClick={() => setIsEditing(true)} className="mt-4 bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 font-semibold">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
