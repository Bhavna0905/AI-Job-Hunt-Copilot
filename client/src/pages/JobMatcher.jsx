import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function JobMatcher() {
  // Restore JD after route change
  const [jobDescription, setJobDescription] = useState(
    () => sessionStorage.getItem("jobDescription") || ""
  );

  // Restore previous analysis
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
    <div className="min-h-screen bg-[#050505] text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.2em] text-[#ff2d8d] mb-3">
          Job Matching
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Job Matcher
        </h1>

        <p className="text-gray-500 mt-3">
          Compare your resume with a job description using AI.
        </p>

      </div>

      {/* Job Description Card */}
      <div className="max-w-5xl bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

        <div className="mb-6">

          <h2 className="text-xl font-semibold">
            Job Description
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Paste the job description you want to match against your resume.
          </p>

        </div>

        <textarea
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Paste the job description here..."
          className="w-full min-h-[280px] bg-[#080808] border border-white/[0.08] rounded-xl p-5 text-sm text-gray-200 placeholder-gray-600 resize-y focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
        />

        {/* Character count */}
        <div className="flex justify-end mt-2">
          <span className="text-xs text-gray-700">
            {jobDescription.length} characters
          </span>
        </div>

        {/* Match Button */}
        <button
          onClick={handleMatch}
          disabled={loading || !jobDescription.trim()}
          className="mt-5 px-7 py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_25px_rgba(255,45,141,0.22)] transition-all"
        >
          {loading ? "Analyzing..." : "Match Resume with Job"}
        </button>

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
                Job Match Analysis
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
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
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

export default JobMatcher;