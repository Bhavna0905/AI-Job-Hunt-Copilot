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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Dashboard
      </h1>

      <p className="text-gray-400 mb-8">
        Welcome to your AI Job Hunt Copilot.
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">Total Applications</p>
          <p className="text-3xl font-bold text-black">
            {loading ? "..." : applications.length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">Applied</p>
          <p className="text-3xl font-bold text-black">
            {loading ? "..." : appliedCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">Interviews</p>
          <p className="text-3xl font-bold text-black">
            {loading ? "..." : interviewCount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 mb-2">Offers</p>
          <p className="text-3xl font-bold text-black">
            {loading ? "..." : offerCount}
          </p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-black mb-5">
          Recent Applications
        </h2>

        {loading ? (
          <p className="text-gray-500">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <p className="text-gray-500">
            No applications added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {applications.slice(0, 5).map((application) => (
              <div
                key={application._id}
                className="flex justify-between items-center border-b pb-4 last:border-b-0"
              >
                <div>
                  <h3 className="font-semibold text-black">
                    {application.jobRole}
                  </h3>

                  <p className="text-gray-500">
                    {application.company}
                  </p>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-black text-sm">
                    {application.status}
                  </span>

                  {application.date && (
                    <p className="text-sm text-gray-400 mt-2">
                      {application.date}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Summary */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold text-black mb-4">
          Application Summary
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-500">Applied</p>
            <p className="text-2xl font-bold text-black">
              {appliedCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Interviews</p>
            <p className="text-2xl font-bold text-black">
              {interviewCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Offers</p>
            <p className="text-2xl font-bold text-black">
              {offerCount}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-black">
              {rejectedCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;