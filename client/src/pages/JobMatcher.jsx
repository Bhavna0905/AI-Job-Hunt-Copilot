import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function JobMatcher() {
  // Restore JD after route change
  const [jobDescription, setJobDescription] = useState(
    () => sessionStorage.getItem("jobDescription") || ""
  );

  // Restore previous analysis too
  const [analysis, setAnalysis] = useState(
    () => sessionStorage.getItem("jobMatchAnalysis") || ""
  );

  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;

    const resumeText = sessionStorage.getItem("resumeText");

    if (!resumeText) {
      alert("Please analyze your resume first.");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/jobs/match`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText,
            jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message);
      }

      console.log("Job matching response:", data);

      // Save analysis
      setAnalysis(data.analysis);
      sessionStorage.setItem("jobMatchAnalysis", data.analysis);

      // Save JD
      sessionStorage.setItem("jobDescription", jobDescription);

    } catch (error) {
      console.error("Job matching error:", error);
      alert("Failed to match resume with job.");
    } finally {
      setLoading(false);
    }
  };

  const handleJobDescriptionChange = (e) => {
    const value = e.target.value;

    setJobDescription(value);

    // Save JD immediately
    sessionStorage.setItem("jobDescription", value);
  };

  return (
    <div className="max-w-5xl">

      <h2 className="text-3xl font-bold">
        Job Matcher 💼
      </h2>

      <p className="text-gray-400 mt-2">
        Compare your resume with a job description using AI.
      </p>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">

        <label className="block text-lg font-semibold mb-3">
          Job Description
        </label>

        <textarea
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Paste the job description here..."
          className="w-full h-64 bg-gray-950 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />

        <button
          onClick={handleMatch}
          disabled={loading}
          className="mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-8 py-3 rounded-lg font-medium transition"
        >
          {loading
            ? "Analyzing... 🤖"
            : "Match Resume with Job 🤖"}
        </button>

      </div>

      {/* AI Analysis */}
      {analysis && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <h3 className="text-2xl font-bold mb-6">
            AI Job Match Analysis 🤖
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

export default JobMatcher;