import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);

  // Restore previous analysis
  const [analysis, setAnalysis] = useState(
    () => sessionStorage.getItem("resumeAnalysis") || ""
  );

  // Restore previous resume filename
  const [savedFileName, setSavedFileName] = useState(
    () => sessionStorage.getItem("resumeFileName") || ""
  );

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      // Save filename
      setSavedFileName(selectedFile.name);
      sessionStorage.setItem("resumeFileName", selectedFile.name);
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      // Save analysis in React state
      setAnalysis(data.analysis);

      // Save resume data
      sessionStorage.setItem("resumeText", data.text);
      sessionStorage.setItem("resumeAnalysis", data.analysis);
      sessionStorage.setItem("resumeFileName", file.name);

      setSavedFileName(file.name);

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

          {/* Newly selected file */}
          {file && (
            <p className="mt-5 text-green-400">
              Selected: {file.name}
            </p>
          )}

          {/* Previously analyzed file */}
          {!file && savedFileName && (
            <div className="mt-5">
              <p className="text-green-400">
                ✓ Resume already analyzed
              </p>

              <p className="text-gray-400 text-sm mt-1">
                {savedFileName}
              </p>
            </div>
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

      {/* AI Analysis */}
      {analysis && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <h3 className="text-2xl font-bold mb-6">
            AI Resume Analysis 🤖
          </h3>

          <div className="text-gray-300 leading-7">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mt-6 mb-3">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-white mt-6 mb-3">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-white mt-5 mb-2">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-4">
                    {children}
                  </p>
                ),

                strong: ({ children }) => (
                  <strong className="font-bold text-white">
                    {children}
                  </strong>
                ),

                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li>
                    {children}
                  </li>
                ),

                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border-collapse border border-gray-700">
                      {children}
                    </table>
                  </div>
                ),

                th: ({ children }) => (
                  <th className="border border-gray-700 bg-gray-800 px-4 py-3 text-left text-white font-semibold">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border border-gray-700 px-4 py-3">
                    {children}
                  </td>
                ),

                hr: () => (
                  <hr className="border-gray-700 my-6" />
                ),
              }}
            >
              {analysis}
            </ReactMarkdown>

          </div>
        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;