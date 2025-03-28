import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!image) {
      toast.error("Please select an image first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult({
        label: res.data.prediction,
        confidence: res.data.confidence,
        image: preview, // show the preview image with result
      });

      setImage(null); // clear current input
      setPreview(null);
    } catch (err) {
      toast.error("Prediction failed. Try again.");
      console.error(err);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/dog-upload-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      <div className="relative bg-white bg-opacity-90 p-8 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-lg z-10">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">
          📸 Upload Dog Skin Image
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Upload a dog skin image to detect potential diseases.
        </p>

        {/* Show preview image if selected */}
        {preview && (
          <div className="relative mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-56 object-cover rounded-lg border border-gray-300 shadow-md"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload button */}
        {!result && (
          <>
            <label className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-pointer text-center hover:bg-gray-200 transition block">
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <button
              onClick={handleDetect}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition duration-300 text-white mt-4 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-rose-500 hover:bg-rose-600"
              }`}
            >
              {loading ? "Detecting..." : "Detect Disease"}
            </button>
          </>
        )}

        {/* Show prediction result */}
        {result && (
          <div className="mt-6 bg-rose-100 border border-rose-300 rounded-lg p-4 text-center relative">
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-rose-700 mb-2">
              Prediction Result
            </h3>
            <img
              src={result.image}
              alt="Predicted"
              className="w-full h-56 object-cover rounded-lg border border-gray-300 shadow mb-4"
            />
            <p className="text-xl font-semibold text-red-600">
              🩺 {result.label}
            </p>
            <p className="text-gray-700">
              Confidence: {result.confidence.toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
