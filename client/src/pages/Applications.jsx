import { useEffect, useState } from "react";

function Applications() {
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

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
        console.error("Fetch applications error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleAddApplication = async (e) => {
    e.preventDefault();

    if (!company.trim() || !jobRole.trim()) {
      setError("Company and job role are required.");
      return;
    }

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const applicationData = {
        company,
        jobRole,
        status,
        date,
        notes,
      };

      // UPDATE
      if (editingId) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(applicationData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update application"
          );
        }

        setApplications((prev) =>
          prev.map((application) =>
            application._id === editingId ? data : application
          )
        );

        setEditingId(null);
      }

      // ADD
      else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/applications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(applicationData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to add application"
          );
        }

        setApplications((prev) => [data, ...prev]);
      }

      // Reset form
      setCompany("");
      setJobRole("");
      setStatus("Applied");
      setDate("");
      setNotes("");
    } catch (error) {
      console.error("Application error:", error);
      setError(error.message);
    }
  };

  const handleEdit = (application) => {
    setEditingId(application._id);
    setCompany(application.company);
    setJobRole(application.jobRole);
    setStatus(application.status);
    setDate(application.date || "");
    setNotes(application.notes || "");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setCompany("");
    setJobRole("");
    setStatus("Applied");
    setDate("");
    setNotes("");
    setError("");
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete application"
        );
      }

      setApplications((prev) =>
        prev.filter((application) => application._id !== id)
      );

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Delete application error:", error);
      setError(error.message);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Offer") {
      return "border-green-500/20 bg-green-500/5 text-green-400";
    }

    if (status === "Interview") {
      return "border-[#ff2d8d]/20 bg-[#ff2d8d]/5 text-[#ff2d8d]";
    }

    if (status === "Rejected") {
      return "border-red-500/20 bg-red-500/5 text-red-400";
    }

    return "border-white/10 bg-white/[0.03] text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#ff2d8d] mb-3">
          Job Search
        </p>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Applications
        </h1>

        <p className="text-gray-500 mt-3">
          Track and manage your job applications in one place.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-3xl mb-6 px-5 py-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Application */}
      <div className="max-w-3xl bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-7 mb-10">

        <div className="mb-7">
          <h2 className="text-xl font-semibold">
            {editingId ? "Edit Application" : "Add Application"}
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            {editingId
              ? "Update the details of this application."
              : "Record a new job application."}
          </p>
        </div>

        <form onSubmit={handleAddApplication}>

          {/* Company */}
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Company
          </label>

          <input
            type="text"
            placeholder="e.g. Microsoft"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border border-white/[0.08] rounded-xl p-3.5 mb-5 text-white bg-[#080808] placeholder-gray-700 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          />

          {/* Job Role */}
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Job Role
          </label>

          <input
            type="text"
            placeholder="e.g. Software Engineer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border border-white/[0.08] rounded-xl p-3.5 mb-5 text-white bg-[#080808] placeholder-gray-700 focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          />

          {/* Status */}
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-white/[0.08] rounded-xl p-3.5 mb-5 text-white bg-[#080808] focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          {/* Date */}
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Application Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-white/[0.08] rounded-xl p-3.5 mb-5 text-white bg-[#080808] focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          />

          {/* Notes */}
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Notes
          </label>

          <textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            className="w-full border border-white/[0.08] rounded-xl p-3.5 mb-6 text-white bg-[#080808] placeholder-gray-700 resize-none focus:outline-none focus:border-[#ff2d8d]/50 focus:ring-1 focus:ring-[#ff2d8d]/20 transition"
          />

          {/* Buttons */}
          <div className="flex gap-3">

            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#ff2d8d] text-white font-medium hover:bg-[#ff469a] shadow-[0_0_20px_rgba(255,45,141,0.15)] hover:shadow-[0_0_25px_rgba(255,45,141,0.25)] transition-all"
            >
              {editingId ? "Update Application" : "Add Application"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 rounded-xl border border-white/[0.1] text-gray-400 hover:text-white hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* Applications */}
      <div className="max-w-5xl">

        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Your Applications
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            {applications.length}{" "}
            {applications.length === 1
              ? "application"
              : "applications"}{" "}
            tracked
          </p>
        </div>

        {loading ? (
          <div className="bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-8 text-gray-600">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-[#0b0b0b] border border-dashed border-white/[0.1] rounded-2xl p-12 text-center">

            <div className="w-12 h-12 rounded-full border border-[#ff2d8d]/20 bg-[#ff2d8d]/5 flex items-center justify-center mx-auto">
              <span className="text-[#ff2d8d] text-xl">
                +
              </span>
            </div>

            <p className="text-gray-400 mt-5">
              No applications added yet.
            </p>

            <p className="text-gray-600 text-sm mt-1">
              Add your first application using the form above.
            </p>

          </div>
        ) : (
          <div className="space-y-3">

            {applications.map((application) => (

              <div
                key={application._id}
                className="group bg-[#0b0b0b] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-[#ff2d8d]/25 hover:shadow-[0_0_30px_rgba(255,45,141,0.05)]"
              >

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-5">

                  {/* Left */}
                  <div className="min-w-0">

                    <h3 className="text-lg font-semibold text-white">
                      {application.jobRole}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      {application.company}
                    </p>

                    {application.date && (
                      <p className="text-xs text-gray-600 mt-3">
                        Applied on {application.date}
                      </p>
                    )}

                    {application.notes && (
                      <p className="text-sm text-gray-500 mt-4 leading-6">
                        {application.notes}
                      </p>
                    )}

                  </div>

                  {/* Right */}
                  <div className="flex flex-col md:items-end gap-4">

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusClass(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>

                    <div className="flex items-center gap-4">

                      <button
                        onClick={() => handleEdit(application)}
                        className="text-sm text-gray-500 hover:text-[#ff2d8d] transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(application._id)}
                        className="text-sm text-gray-500 hover:text-red-400 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Applications;