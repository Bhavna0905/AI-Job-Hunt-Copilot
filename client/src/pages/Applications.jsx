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

  // Fetch applications from MongoDB
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/applications"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
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

  // Add or Update application
  const handleAddApplication = async (e) => {
    e.preventDefault();

    if (!company.trim() || !jobRole.trim()) {
      setError("Company and job role are required.");
      return;
    }

    try {
      setError("");

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
          `http://localhost:5000/api/applications/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
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
          "http://localhost:5000/api/applications",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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

  // Edit application
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

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setCompany("");
    setJobRole("");
    setStatus("Applied");
    setDate("");
    setNotes("");
    setError("");
  };

  // Delete application
  const handleDelete = async (id) => {
    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/applications/${id}`,
        {
          method: "DELETE",
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

      // If deleting the application currently being edited
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      console.error("Delete application error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Application Tracker
      </h1>

      <p className="text-gray-400 mb-8">
        Track your job applications in one place.
      </p>

      {error && (
        <div className="max-w-2xl mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Add / Edit Application Form */}
      <div className="max-w-2xl bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-black mb-6">
          {editingId ? "Edit Application" : "Add Application"}
        </h2>

        <form onSubmit={handleAddApplication}>
          <label className="block mb-2 font-medium text-black">
            Company
          </label>

          <input
            type="text"
            placeholder="e.g. Microsoft"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
          />

          <label className="block mb-2 font-medium text-black">
            Job Role
          </label>

          <input
            type="text"
            placeholder="e.g. Software Engineer"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
          />

          <label className="block mb-2 font-medium text-black">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <label className="block mb-2 font-medium text-black">
            Application Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-3 mb-5 text-black bg-white"
          />

          <label className="block mb-2 font-medium text-black">
            Notes
          </label>

          <textarea
            placeholder="Add notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
            className="w-full border rounded-lg p-3 mb-6 text-black bg-white resize-none"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
            >
              {editingId
                ? "Update Application"
                : "+ Add Application"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 border rounded-lg text-black hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Applications List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Applications
        </h2>

        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No applications added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white p-6 rounded-xl shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-black">
                      {application.jobRole}
                    </h3>

                    <p className="text-gray-600">
                      {application.company}
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-gray-100 text-black text-sm">
                    {application.status}
                  </span>
                </div>

                {application.date && (
                  <p className="text-sm text-gray-500 mt-4">
                    Applied on: {application.date}
                  </p>
                )}

                {application.notes && (
                  <p className="text-gray-700 mt-3">
                    {application.notes}
                  </p>
                )}

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(application)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(application._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
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