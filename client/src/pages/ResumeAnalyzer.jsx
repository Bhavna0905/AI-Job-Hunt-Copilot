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

  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      setSavedFileName(selectedFile.name);
      sessionStorage.setItem("resumeFileName", selectedFile.name);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);

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

      setAnalysis(data.analysis);

      sessionStorage.setItem("resumeText", data.text);
      sessionStorage.setItem("resumeAnalysis", data.analysis);
      sessionStorage.setItem("resumeFileName", file.name);

      setSavedFileName(file.name);
    } catch (error) {
      console.error("Error analyzing resume:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.2em] text-[#ff2d8d] mb-3">
          Resume
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Resume Analyzer
        </h1>

        <p className="text-gray-500 mt-3">
          Upload your resume and get AI-powered feedback and improvement suggestions.
        </p>

      </div>

      {/* Upload Card */}
      <div className="max-w-4xl bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

        <div className="mb-6">

          <h2 className="text-xl font-semibold">
            Upload Resume
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Upload a PDF to analyze your resume.
          </p>

        </div>

        {/* Drop Area */}
        <div className="border border-dashed border-white/[0.12] rounded-2xl p-12 text-center bg-[#080808] hover:border-[#ff2d8d]/30 transition">

          {/* Icon */}
          <div className="w-14 h-14 mx-auto rounded-2xl border border-[#ff2d8d]/25 bg-[#ff2d8d]/5 flex items-center justify-center">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="w-7 h-7 text-[#ff2d8d]"
            >
              <path d="M6 3h9l4 4v14H6z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6" />
              <path d="M9 17h4" />
            </svg>

          </div>

          <h3 className="text-lg font-semibold mt-5">
            Upload your resume
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            PDF files only
          </p>

          <label className="inline-block mt-6">

            <span className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium cursor-pointer hover:bg-[#ff469a] shadow-[0_0_20px_rgba(255,45,141,0.15)] hover:shadow-[0_0_25px_rgba(255,45,141,0.25)] transition-all">
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
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff2d8d]/5 border border-[#ff2d8d]/15">

              <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d8d] shadow-[0_0_7px_#ff2d8d]" />

              <p className="text-sm text-gray-300">
                {file.name}
              </p>

            </div>
          )}

          {/* Previously analyzed file */}
          {!file && savedFileName && (
            <div className="mt-6">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#ff2d8d]/5 border border-[#ff2d8d]/15">

                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2d8d] shadow-[0_0_7px_#ff2d8d]" />

                <span className="text-sm text-[#ff2d8d]">
                  Resume analyzed
                </span>

              </div>

              <p className="text-xs text-gray-600 mt-2">
                {savedFileName}
              </p>

            </div>
          )}

        </div>

        {/* Analyze Button */}
        {file && (
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-6 px-7 py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_25px_rgba(255,45,141,0.22)] transition-all"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        )}

      </div>

      {/* AI Analysis */}
      {analysis && (
        <div className="max-w-5xl mt-8 bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

          {/* Analysis Header */}
          <div className="flex items-center justify-between mb-7">

            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[#ff2d8d] mb-2">
                AI Analysis
              </p>

              <h2 className="text-2xl font-semibold">
                Resume Review
              </h2>
            </div>

            <div className="w-10 h-10 rounded-xl border border-[#ff2d8d]/20 bg-[#ff2d8d]/5 flex items-center justify-center">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="w-5 h-5 text-[#ff2d8d]"
              >
                <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
                <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
              </svg>

            </div>

          </div>

          {/* Markdown */}
          <div className="text-gray-400 leading-7">

            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{

                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-white mt-8 mb-4">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-white mt-8 mb-4">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-white mt-6 mb-3">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-4">
                    {children}
                  </p>
                ),

                strong: ({ children }) => (
                  <strong className="font-semibold text-white">
                    {children}
                  </strong>
                ),

                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-5 space-y-2">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-5 space-y-2">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="pl-1">
                    {children}
                  </li>
                ),

                table: ({ children }) => (
                  <div className="overflow-x-auto my-7 rounded-xl border border-white/[0.08]">
                    <table className="w-full border-collapse">
                      {children}
                    </table>
                  </div>
                ),

                th: ({ children }) => (
                  <th className="border-b border-white/[0.08] bg-[#111111] px-4 py-3 text-left text-white font-semibold text-sm">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border-b border-white/[0.06] px-4 py-3 text-sm text-gray-400">
                    {children}
                  </td>
                ),

                hr: () => (
                  <hr className="border-white/[0.08] my-7" />
                ),

                code: ({ children }) => (
                  <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#ff65ab] text-sm">
                    {children}
                  </code>
                ),

                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-[#ff2d8d] pl-4 my-5 text-gray-500">
                    {children}
                  </blockquote>
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