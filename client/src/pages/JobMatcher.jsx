import { useState } from "react";

function JobMatcher() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim()) return;

    // Get actual resume text saved by Resume Analyzer
    const resumeText = sessionStorage.getItem("resumeText");

    if (!resumeText) {
      alert("Please analyze your resume first.");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/jobs/match",
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

      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Job matching error:", error);
      alert("Failed to match resume with job.");
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => setJobDescription(e.target.value)}
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

      {analysis && (
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-8">

          <h3 className="text-2xl font-bold mb-4">
            AI Job Match Analysis 🤖
          </h3>

          <div className="text-gray-300 whitespace-pre-wrap leading-7">
            {analysis}
          </div>

        </div>
      )}

    </div>
  );
}

export default JobMatcher;