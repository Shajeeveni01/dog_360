import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaPrint } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const HealthRecords = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Health Report");
  const [records, setRecords] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const fileInputRef = useRef(null);

  const CLOUD_NAME = "dpcshviz6";
  const UPLOAD_PRESET = "unsigned_preset";

  const fetchRecords = async () => {
    try {
      const q = query(collection(db, "healthRecords"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file!");

    toast.info("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, formData);
      const fileURL = res.data.secure_url;

      const docRef = await addDoc(collection(db, "healthRecords"), {
        fileName: file.name,
        url: fileURL,
        category,
        userId: user.uid,
        timestamp: Timestamp.now(),
      });

      setRecords((prev) => [
        ...prev,
        {
          id: docRef.id,
          fileName: file.name,
          url: fileURL,
          category,
        },
      ]);

      toast.success("Uploaded successfully!");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed.");
    }
  };

  const handleDelete = async (record) => {
    await deleteDoc(doc(db, "healthRecords", record.id));
    setRecords((prev) => prev.filter((r) => r.id !== record.id));
    toast.success("Record deleted.");
  };

  const handlePrint = (url) => {
    const win = window.open(url, "_blank");
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  const toggleShowMore = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📂 Pet Health Records</h2>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Upload Health Record</h3>
        <input
          type="file"
          accept=".jpg,.png,.pdf"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="w-full mt-2"
        />
        <select
          className="w-full px-4 py-2 border rounded-lg mt-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Health Report">Health Report</option>
          <option value="Prescription">Prescription</option>
          <option value="Vaccination Record">Vaccination Record</option>
        </select>
        <button
          onClick={handleUpload}
          className="w-full bg-rose-500 text-white mt-4 py-2 rounded-lg hover:bg-rose-600"
        >
          Upload Record
        </button>
      </div>

      {/* Records Section */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">📁 Your Records</h3>

        {["Health Report", "Prescription", "Vaccination Record"].map((cat) => {
          const filtered = records.filter((r) => r.category === cat);
          const isExpanded = expandedCategories[cat];
          const visibleRecords = isExpanded ? filtered : filtered.slice(0, 3);

          return (
            <div key={cat} className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800">{cat}</h4>
              <div className="bg-white p-4 rounded-lg shadow-md">
                {filtered.length === 0 ? (
                  <p className="text-gray-600">No records found.</p>
                ) : (
                  <>
                    <ul>
                      {visibleRecords.map((r) => (
                        <li key={r.id} className="flex justify-between items-center mb-2">
                          <div className="flex items-center space-x-4">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {r.fileName}
                            </a>
                            <button
                              onClick={() => handlePrint(r.url)}
                              className="flex items-center gap-1 text-gray-600 hover:text-rose-600"
                            >
                              <FaPrint />
                              <span className="text-sm">Print</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleDelete(r)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                    {filtered.length > 3 && (
                      <button
                        onClick={() => toggleShowMore(cat)}
                        className="text-sm text-rose-500 mt-2 hover:underline"
                      >
                        {isExpanded ? "Show Less ▲" : "Show More ▼"}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HealthRecords;
