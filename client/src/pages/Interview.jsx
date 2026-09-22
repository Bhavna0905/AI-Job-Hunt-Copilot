import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Interview() {
  const [jobRole, setJobRole] = useState("");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Easy");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");

  const [questionNumber, setQuestionNumber] = useState(0);
  const totalQuestions = 5;

  const [interviewData, setInterviewData] = useState([]);

  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [error, setError] = useState("");

  // Start interview
  const handleStartInterview = async () => {
    if (!jobRole.trim()) {
      setError("Please enter a job role.");
      return;
    }

    setLoading(true);
    setError("");
    setQuestion("");
    setAnswer("");
    setEvaluation("");
    setSummary("");
    setInterviewData([]);
    setQuestionNumber(0);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interview/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobRole,
            interviewType,
            difficulty,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to start interview"
        );
      }

      setQuestion(data.question);
      setQuestionNumber(1);
    } catch (error) {
      console.error("Interview error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError("Please enter your answer.");
      return;
    }

    setEvaluating(true);
    setError("");
    setEvaluation("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interview/evaluate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobRole,
            question,
            answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to evaluate answer"
        );
      }

      setEvaluation(data.evaluation);

      setInterviewData((prev) => [
        ...prev,
        {
          questionNumber,
          question,
          answer,
          evaluation: data.evaluation,
        },
      ]);
    } catch (error) {
      console.error("Evaluation error:", error);
      setError(error.message);
    } finally {
      setEvaluating(false);
    }
  };

  // Generate next question
  const handleNextQuestion = async () => {
    setNextLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interview/next`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobRole,
            interviewType,
            difficulty,
            previousQuestion: question,
            previousAnswer: answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate next question"
        );
      }

      setQuestion(data.question);
      setAnswer("");
      setEvaluation("");
      setQuestionNumber((prev) => prev + 1);
    } catch (error) {
      console.error("Next question error:", error);
      setError(error.message);
    } finally {
      setNextLoading(false);
    }
  };

  // Generate final interview summary
  const handleFinishInterview = async () => {
    setSummaryLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interview/summary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobRole,
            interviewType,
            difficulty,
            interviewData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate interview summary"
        );
      }

      setSummary(data.summary);
    } catch (error) {
      console.error("Summary error:", error);
      setError(error.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Markdown styling
  const markdownComponents = {
    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),

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
      <li>{children}</li>
    ),

    code: ({ children }) => (
      <code className="bg-white/[0.06] text-[#ff65ab] px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#ff2d8d] pl-4 my-4 text-gray-500">
        {children}
      </blockquote>
    ),

    hr: () => (
      <hr className="border-white/[0.08] my-6" />
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-6 rounded-xl border border-white/[0.08]">
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
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <p className="text-xs uppercase tracking-[0.2em] text-[#ff2d8d] mb-3">
          Interview Practice
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          AI Interview
        </h1>

        <p className="text-gray-500 mt-3">
          Practice interviews with an AI interviewer and get real-time feedback.
        </p>

      </div>

      {/* Interview Setup */}
      <div className="max-w-3xl bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

        <div className="mb-7">
          <h2 className="text-xl font-semibold">
            Interview Setup
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Configure your interview before getting started.
          </p>
        </div>

        {/* Job Role */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Role
          </label>

          <input
            type="text"
            placeholder="e.g. Full Stack Developer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          />
        </div>

        {/* Interview Type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Interview Type
          </label>

          <select
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          >
            <option className="bg-[#0b0b0b]">Technical</option>
            <option className="bg-[#0b0b0b]">Behavioral</option>
            <option className="bg-[#0b0b0b]">Mixed</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-7">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full bg-[#080808] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          >
            <option className="bg-[#0b0b0b]">Easy</option>
            <option className="bg-[#0b0b0b]">Medium</option>
            <option className="bg-[#0b0b0b]">Hard</option>
          </select>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] hover:shadow-[0_0_25px_rgba(255,45,141,0.22)] transition-all"
        >
          {loading ? "Generating Question..." : "Start Interview"}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Active Interview */}
      {question && (
        <div className="max-w-3xl mt-8">

          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              Question {questionNumber} of {totalQuestions}
            </span>

            <span className="text-sm text-[#ff2d8d]">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-7">
            <div
              className="h-full bg-[#ff2d8d] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,45,141,0.4)]"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-9 h-9 rounded-lg bg-[#ff2d8d]/10 border border-[#ff2d8d]/20 flex items-center justify-center">

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="w-5 h-5 text-[#ff2d8d]"
                >
                  <path d="M12 3a8 8 0 0 0-8 8c0 2.1.8 4 2.2 5.4L5 21l4.6-1.7A8 8 0 1 0 12 3Z" />
                  <path d="M9 11h.01M15 11h.01" />
                </svg>

              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Interview Question
                </p>

                <p className="text-xs text-gray-600">
                  {interviewType} · {difficulty}
                </p>
              </div>

            </div>

            <div className="text-gray-400 leading-7">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {question}
              </ReactMarkdown>
            </div>

            {/* Answer */}
            <div className="mt-8 pt-7 border-t border-white/[0.06]">

              <label className="block text-sm font-medium text-gray-300 mb-3">
                Your Answer
              </label>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows="7"
                className="w-full bg-[#080808] border border-white/[0.08] rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
              />

              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating}
                className="w-full mt-4 py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_18px_rgba(255,45,141,0.1)] transition-all"
              >
                {evaluating ? "Evaluating Answer..." : "Submit Answer"}
              </button>

            </div>

          </div>

          {/* Evaluation */}
          {evaluation && (
            <div className="mt-6 bg-[#0b0b0b] border border-[#ff2d8d]/15 rounded-2xl p-7">

              <div className="flex items-center gap-3 mb-6">

                <div className="w-9 h-9 rounded-lg bg-[#ff2d8d]/10 border border-[#ff2d8d]/20 flex items-center justify-center">

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

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#ff2d8d]">
                    AI Feedback
                  </p>

                  <h3 className="text-xl font-semibold mt-1">
                    Answer Evaluation
                  </h3>
                </div>

              </div>

              <div className="text-gray-400 leading-7">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {evaluation}
                </ReactMarkdown>
              </div>

              {/* Next / Finish */}
              {questionNumber < totalQuestions ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={nextLoading}
                  className="w-full mt-7 py-3 rounded-xl border border-[#ff2d8d]/30 text-[#ff2d8d] text-sm font-medium hover:bg-[#ff2d8d]/10 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  {nextLoading
                    ? "Generating Next Question..."
                    : "Next Question"}
                </button>
              ) : (
                <button
                  onClick={handleFinishInterview}
                  disabled={summaryLoading}
                  className="w-full mt-7 py-3 rounded-xl bg-[#ff2d8d] text-white text-sm font-medium hover:bg-[#ff469a] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,45,141,0.12)] transition"
                >
                  {summaryLoading
                    ? "Generating Final Report..."
                    : "Finish Interview"}
                </button>
              )}

            </div>
          )}

          {/* Final Summary */}
          {summary && (
            <div className="mt-6 bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7">

              <div className="mb-7">

                <p className="text-xs uppercase tracking-[0.15em] text-[#ff2d8d] mb-2">
                  Interview Complete
                </p>

                <h3 className="text-2xl font-bold">
                  Interview Summary
                </h3>

              </div>

              {/* Overall Score */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6 mb-4 text-center">

                <p className="text-sm text-gray-500 mb-2">
                  Overall Score
                </p>

                <p className="text-5xl font-bold text-[#ff2d8d]">
                  {summary.overallScore}
                  <span className="text-xl text-gray-600">
                    /100
                  </span>
                </p>

              </div>

              {/* Overall Performance */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6 mb-4">

                <p className="text-xs uppercase tracking-wider text-[#ff2d8d] mb-2">
                  Performance
                </p>

                <h4 className="font-semibold text-white mb-3">
                  Overall Performance
                </h4>

                <p className="text-gray-400 leading-7">
                  {summary.overallPerformance}
                </p>

              </div>

              {/* Strengths */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6 mb-4">

                <p className="text-xs uppercase tracking-wider text-[#ff2d8d] mb-2">
                  Strengths
                </p>

                <h4 className="font-semibold text-white mb-3">
                  What You Did Well
                </h4>

                <ul className="list-disc pl-5 text-gray-400 space-y-2">
                  {summary.strengths.map((strength, index) => (
                    <li key={index}>
                      {strength}
                    </li>
                  ))}
                </ul>

              </div>

              {/* Areas to Improve */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6 mb-4">

                <p className="text-xs uppercase tracking-wider text-[#ff2d8d] mb-2">
                  Improvement Areas
                </p>

                <h4 className="font-semibold text-white mb-3">
                  Areas to Improve
                </h4>

                <ul className="list-disc pl-5 text-gray-400 space-y-2">
                  {summary.areasToImprove.map((area, index) => (
                    <li key={index}>
                      {area}
                    </li>
                  ))}
                </ul>

              </div>

              {/* Hiring Recommendation */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6 mb-4">

                <p className="text-xs uppercase tracking-wider text-[#ff2d8d] mb-2">
                  Recommendation
                </p>

                <h4 className="font-semibold text-white mb-3">
                  Hiring Recommendation
                </h4>

                <p className="font-medium text-gray-300">
                  {summary.hiringRecommendation}
                </p>

              </div>

              {/* Final Feedback */}
              <div className="bg-[#080808] border border-white/[0.07] rounded-xl p-6">

                <p className="text-xs uppercase tracking-wider text-[#ff2d8d] mb-2">
                  Final Feedback
                </p>

                <h4 className="font-semibold text-white mb-3">
                  Overall Feedback
                </h4>

                <p className="text-gray-400 leading-7">
                  {summary.finalFeedback}
                </p>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Interview;