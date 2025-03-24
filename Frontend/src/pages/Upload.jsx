import { useState } from "react";
import { storage } from "../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }

    setLoading(true);
    const storageRef = ref(storage, `dog-skin-images/${Date.now()}_${image.name}`); // timestamp to avoid name clash
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => {
        toast.error("Upload failed: " + error.message);
        setLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        toast.success("Image uploaded successfully!");
        console.log("Download URL:", downloadURL);
        setImage(null);
        setPreview(null);
        setProgress(0);
        setLoading(false);
      }
    );
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/dog-upload-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      <div className="relative bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-lg">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">📸 Upload Dog Skin Image
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Upload an image of your dog's skin to analyze potential conditions.
        </p>

        {preview && (
          <div className="relative mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-lg border border-gray-300 shadow-md"
            />
            <button
              onClick={() => {
                setPreview(null);
                setImage(null);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
            >
              ✕
            </button>
          </div>
        )}

        <label className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-pointer text-center hover:bg-gray-200 transition block">
          Select Image
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-md h-2 mt-4">
            <div
              className="bg-blue-500 h-2 rounded-md transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          onClick={handleUpload}
          className={`w-full py-3 rounded-lg font-semibold transition duration-300 text-white mt-4 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
    </div>
  );
};

export default Upload;