import { useState } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase/config"; // ✅ Make sure this matches your config export
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HealthRecords = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("Health Report");
  const [records, setRecords] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload!");
      return;
    }

    const fileId = uuidv4();
    const fileRef = ref(storage, `health-records/${category}/${fileId}_${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const newRecord = { id: fileId, name: file.name, url: fileURL, category };
      setRecords([...records, newRecord]);

      toast.success("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload failed. Try again!");
    }
  };

  const handleDelete = async (record) => {
    const fileRef = ref(storage, `health-records/${record.category}/${record.id}_${record.name}`);

    try {
      await deleteObject(fileRef);
      setRecords(records.filter((r) => r.id !== record.id));
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Error deleting file.");
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center py-10 px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📂 Pet Health Records</h2>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mb-6">
        <h3 className="text-xl font-semibold text-gray-700">Upload Health Record</h3>
        <input
          type="file"
          accept=".jpg,.png,.pdf"
          className="w-full mt-2"
          onChange={handleFileChange}
        />
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Health Report">Health Report</option>
          <option value="Prescription">Prescription</option>
          <option value="Vaccination Record">Vaccination Record</option>
        </select>
        <button
          onClick={handleUpload}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-2 rounded-lg mt-3 transition"
        >
          Upload Record
        </button>
      </div>

      {/* Uploaded Records */}
      <div className="w-full max-w-4xl">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">📑 Uploaded Records</h3>

        {["Health Report", "Prescription", "Vaccination Record"].map((cat) => (
          <div key={cat} className="mb-6">
            <h4 className="text-xl font-semibold text-gray-800">{cat}</h4>
            <div className="bg-white p-4 rounded-lg shadow-md">
              {records.filter((record) => record.category === cat).length === 0 ? (
                <p className="text-gray-600">No records found.</p>
              ) : (
                <ul>
                  {records
                    .filter((record) => record.category === cat)
                    .map((record) => (
                      <li
                        key={record.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <a
                          href={record.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {record.name}
                        </a>
                        <button
                          onClick={() => handleDelete(record)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecords;
