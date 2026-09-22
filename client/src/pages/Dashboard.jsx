import { useEffect, useState } from "react";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch applications"
          );
        }

        setApplications(data);
      } catch (error) {
        console.error("Dashboard applications error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offerCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const totalApplications = applications.length;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">

      {/* Header */}
      <div className="mb-10">

        <p className="text-sm font-medium tracking-wider uppercase text-[#ff2d8d] mb-3">
          AI Job Hunt Copilot
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-3 text-base">
          Track your applications, interviews and job search progress.
        </p>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-red-400">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

        {/* Total */}
        <div className="group bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/40 hover:shadow-[0_0_30px_rgba(255,45,141,0.08)]">

          <div className="flex items-center justify-between mb-7">

            <span className="text-xs uppercase tracking-wider text-gray-600">
              Total
            </span>

            <div className="w-2 h-2 rounded-full bg-[#ff2d8d] shadow-[0_0_10px_#ff2d8d]" />

          </div>

          <p className="text-sm text-gray-500">
            Total Applications
          </p>

          <p className="text-4xl font-semibold mt-2 tracking-tight">
            {loading ? "—" : totalApplications}
          </p>

        </div>

        {/* Applied */}
        <div className="group bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/40 hover:shadow-[0_0_30px_rgba(255,45,141,0.08)]">

          <div className="flex items-center justify-between mb-7">

            <span className="text-xs uppercase tracking-wider text-gray-600">
              Applied
            </span>

            <div className="w-2 h-2 rounded-full bg-[#ff2d8d] shadow-[0_0_10px_#ff2d8d]" />

          </div>

          <p className="text-sm text-gray-500">
            Applications Sent
          </p>

          <p className="text-4xl font-semibold mt-2 tracking-tight">
            {loading ? "—" : appliedCount}
          </p>

        </div>

        {/* Interviews */}
        <div className="group bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/40 hover:shadow-[0_0_30px_rgba(255,45,141,0.08)]">

          <div className="flex items-center justify-between mb-7">

            <span className="text-xs uppercase tracking-wider text-gray-600">
              Interviews
            </span>

            <div className="w-2 h-2 rounded-full bg-[#ff2d8d] shadow-[0_0_10px_#ff2d8d]" />

          </div>

          <p className="text-sm text-gray-500">
            Interviews Scheduled
          </p>

          <p className="text-4xl font-semibold mt-2 tracking-tight">
            {loading ? "—" : interviewCount}
          </p>

        </div>

        {/* Offers */}
        <div className="group bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/40 hover:shadow-[0_0_30px_rgba(255,45,141,0.08)]">

          <div className="flex items-center justify-between mb-7">

            <span className="text-xs uppercase tracking-wider text-gray-600">
              Offers
            </span>

            <div className="w-2 h-2 rounded-full bg-[#ff2d8d] shadow-[0_0_10px_#ff2d8d]" />

          </div>

          <p className="text-sm text-gray-500">
            Offers Received
          </p>

          <p className="text-4xl font-semibold mt-2 tracking-tight">
            {loading ? "—" : offerCount}
          </p>

        </div>

      </div>

      {/* Quick Actions */}
      <div className="mb-10">

        <div className="flex items-end justify-between mb-5">

          <div>
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              Continue where you left off
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Resume */}
          <a
            href="/resume"
            className="group relative overflow-hidden bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/50 hover:shadow-[0_0_35px_rgba(255,45,141,0.10)]"
          >

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#ff2d8d]/5 blur-2xl group-hover:bg-[#ff2d8d]/10 transition" />

            <div className="relative">

              <div className="flex justify-between items-center">

                <div className="w-10 h-10 rounded-xl border border-[#ff2d8d]/30 flex items-center justify-center text-[#ff2d8d]">
                  <span className="text-lg">+</span>
                </div>

                <span className="text-gray-600 group-hover:text-[#ff2d8d] transition text-lg">
                  →
                </span>

              </div>

              <h3 className="text-lg font-semibold mt-7">
                Resume Analyzer
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Analyze your resume and get AI-powered improvement suggestions.
              </p>

            </div>

          </a>

          {/* Job Matcher */}
          <a
            href="/jobs"
            className="group relative overflow-hidden bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/50 hover:shadow-[0_0_35px_rgba(255,45,141,0.10)]"
          >

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#ff2d8d]/5 blur-2xl group-hover:bg-[#ff2d8d]/10 transition" />

            <div className="relative">

              <div className="flex justify-between items-center">

                <div className="w-10 h-10 rounded-xl border border-[#ff2d8d]/30 flex items-center justify-center text-[#ff2d8d]">
                  <span className="text-lg">+</span>
                </div>

                <span className="text-gray-600 group-hover:text-[#ff2d8d] transition text-lg">
                  →
                </span>

              </div>

              <h3 className="text-lg font-semibold mt-7">
                Job Matcher
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Compare your resume with a job description using AI.
              </p>

            </div>

          </a>

          {/* Interview */}
          <a
            href="/interview"
            className="group relative overflow-hidden bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/50 hover:shadow-[0_0_35px_rgba(255,45,141,0.10)]"
          >

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#ff2d8d]/5 blur-2xl group-hover:bg-[#ff2d8d]/10 transition" />

            <div className="relative">

              <div className="flex justify-between items-center">

                <div className="w-10 h-10 rounded-xl border border-[#ff2d8d]/30 flex items-center justify-center text-[#ff2d8d]">
                  <span className="text-lg">+</span>
                </div>

                <span className="text-gray-600 group-hover:text-[#ff2d8d] transition text-lg">
                  →
                </span>

              </div>

              <h3 className="text-lg font-semibold mt-7">
                AI Interview
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-6">
                Practice technical and behavioral interviews with AI.
              </p>

            </div>

          </a>

        </div>

      </div>

      {/* Recent Applications */}
      <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 mb-6">

        <div className="flex items-center justify-between mb-6">

          <div>
            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>

            <p className="text-sm text-gray-600 mt-1">
              Your latest job applications
            </p>
          </div>

          <a
            href="/applications"
            className="text-sm text-[#ff2d8d] hover:text-[#ff65ab] transition"
          >
            View all →
          </a>

        </div>

        {loading ? (
          <div className="py-8 text-gray-600">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/[0.08] rounded-xl">

            <div className="w-10 h-10 rounded-full border border-white/10 mx-auto flex items-center justify-center text-gray-600">
              —
            </div>

            <p className="text-gray-400 mt-4">
              No applications yet
            </p>

            <p className="text-gray-600 text-sm mt-1">
              Your recent applications will appear here.
            </p>

          </div>
        ) : (
          <div>

            {applications.slice(0, 5).map((application) => (

              <div
                key={application._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-5 border-b border-white/[0.06] last:border-b-0"
              >

                <div>
                  <h3 className="font-medium text-white">
                    {application.jobRole}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {application.company}
                  </p>
                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                      application.status === "Offer"
                        ? "border-green-500/20 bg-green-500/5 text-green-400"
                        : application.status === "Interview"
                        ? "border-[#ff2d8d]/20 bg-[#ff2d8d]/5 text-[#ff2d8d]"
                        : application.status === "Rejected"
                        ? "border-red-500/20 bg-red-500/5 text-red-400"
                        : "border-white/10 bg-white/[0.03] text-gray-400"
                    }`}
                  >
                    {application.status}
                  </span>

                  {application.date && (
                    <p className="text-xs text-gray-600">
                      {application.date}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* Summary */}
      <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6">

        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Application Summary
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            Current status of your job search
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">

          <div className="py-3 md:border-r border-white/[0.06]">
            <p className="text-sm text-gray-600">
              Applied
            </p>

            <p className="text-2xl font-semibold mt-2">
              {appliedCount}
            </p>
          </div>

          <div className="py-3 md:px-6 md:border-r border-white/[0.06]">
            <p className="text-sm text-gray-600">
              Interviews
            </p>

            <p className="text-2xl font-semibold mt-2">
              {interviewCount}
            </p>
          </div>

          <div className="py-3 md:px-6 md:border-r border-white/[0.06]">
            <p className="text-sm text-gray-600">
              Offers
            </p>

            <p className="text-2xl font-semibold text-[#ff2d8d] mt-2">
              {offerCount}
            </p>
          </div>

          <div className="py-3 md:pl-6">
            <p className="text-sm text-gray-600">
              Rejected
            </p>

            <p className="text-2xl font-semibold mt-2">
              {rejectedCount}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;