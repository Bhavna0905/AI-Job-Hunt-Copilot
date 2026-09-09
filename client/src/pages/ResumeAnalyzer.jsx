import { useState } from "react";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(""); 

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/resume/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

        setAnalysis(data.analysis);

        sessionStorage.setItem("resumeText", data.text);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    }
  };

  return (
    <div className="max-w-5xl">

      <h2 className="text-3xl font-bold">
        Resume Analyzer 📄
      </h2>

      <p className="text-gray-400 mt-2">
        Upload your resume and let AI analyze it.
      </p>

      {/* Upload Box */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-10">

        <div className="border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">

          <div className="text-5xl mb-4">
            📄
          </div>

          <h3 className="text-xl font-semibold">
            Upload your resume
          </h3>

          <p className="text-gray-400 mt-2">
            PDF files only
          </p>

          <label className="inline-block mt-6">

            <span className="cursor-pointer bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-medium">
              Choose PDF
            </span>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

          </label>

          {file && (
            <p className="mt-5 text-green-400">
              Selected: {file.name}
            </p>
          )}



        </div>

      </div>

      {/* Analyze Button */}
      {file && (
        <button
          onClick={handleAnalyze}
          className="mt-6 bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-medium transition"
        >
          Analyze Resume with AI ✨
        </button>
      )}

            {analysis && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">
            AI Resume Analysis 🤖
          </h3>

          <div className="text-gray-300 whitespace-pre-wrap leading-7">
            {analysis}
          </div>
        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;