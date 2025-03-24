import { useState } from "react";

const BloodReport = () => {
  const [report, setReport] = useState({
    wbc: "",
    rbc: "",
    hemoglobin: "",
    platelets: "",
  });
  const [result, setResult] = useState("");

  const referenceRanges = {
    wbc: {
      min: 4.0,
      max: 11.0,
      low: "\u26a0\ufe0f Low WBC! Possible viral infection, bone marrow disorder, or autoimmune disease.",
      high: "\u26a0\ufe0f High WBC! Possible bacterial infection, inflammation, or leukemia."
    },
    rbc: {
      min: 4.7,
      max: 6.1,
      low: "\u26a0\ufe0f Low RBC! Possible anemia, internal bleeding, or chronic illness.",
      high: "\u26a0\ufe0f High RBC! Possible dehydration, heart disease, or lung disorder."
    },
    hemoglobin: {
      min: 13.8,
      max: 17.2,
      low: "\u26a0\ufe0f Low Hemoglobin! Possible anemia, iron deficiency, or kidney disease.",
      high: "\u26a0\ufe0f High Hemoglobin! Possible lung disease, dehydration, or heart disorder."
    },
    platelets: {
      min: 150,
      max: 450,
      low: "\u26a0\ufe0f Low Platelets! Possible viral infection, leukemia, or bone marrow disorder.",
      high: "\u26a0\ufe0f High Platelets! Possible chronic inflammation, infection, or cancer risk."
    }
  };

  const analyzeReport = () => {
    let analysis = "";

    Object.keys(report).forEach((key) => {
      const value = report[key];

      if (value.includes("Low")) {
        analysis += `${referenceRanges[key].low}\n`;
      } else if (value.includes("High")) {
        analysis += `${referenceRanges[key].high}\n`;
      } else if (value === "Normal") {
        analysis += `\u2705 ${key.toUpperCase()} is within NORMAL range.\n`;
      } else {
        analysis += `\u274C ${key.toUpperCase()} is not selected.\n`;
      }
    });

    setResult(analysis);
  };

  return (
    <div
      className="relative flex flex-col min-h-screen items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/blood-report-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      <div className="relative bg-white bg-opacity-80 p-8 rounded-2xl shadow-2xl w-full max-w-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-gray-700 mb-4 text-center">🧸 Blood Report Analysis
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Select your blood test results to analyze potential infections.
        </p>

        <div className="space-y-4 mt-4">
          {Object.keys(referenceRanges).map((key) => (
            <div key={key}>
              <label className="text-gray-600 block mb-1">
                {key.toUpperCase()} (Normal: {referenceRanges[key].min} - {referenceRanges[key].max})
              </label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                value={report[key]}
                onChange={(e) => setReport({ ...report, [key]: e.target.value })}
              >
                <option value="">Select {key.toUpperCase()}</option>
                <option value="Low">Low (&lt;{referenceRanges[key].min})</option>
                <option value="Normal">
                  Normal ({referenceRanges[key].min} - {referenceRanges[key].max})
                </option>
                <option value="High">High (&gt;{referenceRanges[key].max})</option>
              </select>
            </div>
          ))}
        </div>

        <button
          onClick={analyzeReport}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg mt-4 transition font-semibold text-lg shadow-md"
        >
          Analyze Report
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-lg font-semibold">Results:</h4>
            <pre className="text-gray-700 whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodReport;
