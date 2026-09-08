import { useState } from "react";

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
        "http://localhost:5000/api/interview/start",
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
        "http://localhost:5000/api/interview/evaluate",
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

      // Save this question, answer and evaluation
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
        "http://localhost:5000/api/interview/next",
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
        "http://localhost:5000/api/interview/summary",
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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        AI Interview 🎤
      </h1>

      <p className="text-gray-400 mb-8">
        Practice interviews with an AI interviewer.
      </p>

      <div className="max-w-xl bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-black">
          Interview Setup
        </h2>

        {/* Job Role */}
        <label className="block mb-2 font-medium text-black">
          Job Role
        </label>

        <input
          type="text"
          placeholder="e.g. Full Stack Developer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
        />

        {/* Interview Type */}
        <label className="block mb-2 font-medium text-black">
          Interview Type
        </label>

        <select
          value={interviewType}
          onChange={(e) => setInterviewType(e.target.value)}
          className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
        >
          <option>Technical</option>
          <option>Behavioral</option>
          <option>Mixed</option>
        </select>

        {/* Difficulty */}
        <label className="block mb-2 font-medium text-black">
          Difficulty
        </label>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border rounded-lg p-3 mb-6 text-black bg-white"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        {/* Start Interview */}
        <button
          onClick={handleStartInterview}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? "Generating Question..."
            : "Start Interview"}
        </button>

        {/* Error */}
        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {/* Interview */}
        {question && (
          <div className="mt-6">

            {/* Question Counter */}
            <p className="text-sm text-gray-500 mb-2">
              Question {questionNumber} / {totalQuestions}
            </p>

            {/* Question */}
            <div className="p-5 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-black mb-2">
                AI Interviewer 🤖
              </h3>

              <p className="text-black whitespace-pre-line">
                {question}
              </p>
            </div>

            {/* Answer */}
            <div className="mt-5">
              <label className="block mb-2 font-medium text-black">
                Your Answer
              </label>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows="6"
                className="w-full border rounded-lg p-3 text-black bg-white resize-none"
              />

              <button
                onClick={handleSubmitAnswer}
                disabled={evaluating}
                className="w-full mt-4 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {evaluating
                  ? "Evaluating Answer..."
                  : "Submit Answer"}
              </button>
            </div>

            {/* Evaluation */}
            {evaluation && (
              <div className="mt-6 p-5 bg-gray-100 rounded-lg">
                <h3 className="font-semibold text-black mb-3">
                  AI Feedback 🤖
                </h3>

                <p className="text-black whitespace-pre-line">
                  {evaluation}
                </p>

                {/* Next / Finish */}
                {questionNumber < totalQuestions ? (
                  <button
                    onClick={handleNextQuestion}
                    disabled={nextLoading}
                    className="w-full mt-5 bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {nextLoading
                      ? "Generating Next Question..."
                      : "Next Question →"}
                  </button>
                ) : (
                  <button
                    onClick={handleFinishInterview}
                    disabled={summaryLoading}
                    className="w-full mt-5 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {summaryLoading
                      ? "Generating Final Report..."
                      : "Finish Interview ✓"}
                  </button>
                )}
              </div>
            )}

            {/* Final Summary */}
            {summary && (
  <div className="mt-6 p-5 bg-gray-100 rounded-lg">
    <h3 className="text-2xl font-bold text-black mb-6">
      🎉 Interview Completed
    </h3>

    {/* Overall Score */}
    <div className="bg-white rounded-lg p-5 mb-4 text-center">
      <p className="text-gray-500 mb-2">
        Overall Score
      </p>

      <p className="text-4xl font-bold text-black">
        {summary.overallScore}/100
      </p>
    </div>

    {/* Overall Performance */}
    <div className="bg-white rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-black mb-2">
        📊 Overall Performance
      </h4>

      <p className="text-gray-700">
        {summary.overallPerformance}
      </p>
    </div>

    {/* Strengths */}
    <div className="bg-white rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-black mb-3">
        💪 Strengths
      </h4>

      <ul className="list-disc pl-5 text-gray-700">
        {summary.strengths.map((strength, index) => (
          <li key={index} className="mb-1">
            {strength}
          </li>
        ))}
      </ul>
    </div>

    {/* Areas to Improve */}
    <div className="bg-white rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-black mb-3">
        ⚠️ Areas to Improve
      </h4>

      <ul className="list-disc pl-5 text-gray-700">
        {summary.areasToImprove.map((area, index) => (
          <li key={index} className="mb-1">
            {area}
          </li>
        ))}
      </ul>
    </div>

    {/* Hiring Recommendation */}
    <div className="bg-white rounded-lg p-5 mb-4">
      <h4 className="font-semibold text-black mb-2">
        🎯 Hiring Recommendation
      </h4>

      <p className="font-semibold text-black">
        {summary.hiringRecommendation}
      </p>
    </div>

    {/* Final Feedback */}
    <div className="bg-white rounded-lg p-5">
      <h4 className="font-semibold text-black mb-2">
        💬 Final Feedback
      </h4>

      <p className="text-gray-700">
        {summary.finalFeedback}
      </p>
    </div>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;