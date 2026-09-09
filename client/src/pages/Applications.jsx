import { useState } from "react";

function Applications() {
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleAddApplication = (e) => {
    e.preventDefault();

    if (!company.trim() || !jobRole.trim()) {
      return;
    }

    const newApplication = {
      id: Date.now(),
      company,
      jobRole,
      status,
      date,
      notes,
    };

    setApplications((prev) => [...prev, newApplication]);

    setCompany("");
    setJobRole("");
    setStatus("Applied");
    setDate("");
    setNotes("");
  };

  const handleDelete = (id) => {
    setApplications((prev) =>
      prev.filter((application) => application.id !== id)
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>

      <p className="text-gray-400 mb-8">
        Track your job applications in one place.
      </p>

      {/* Add Application Form */}
      <div className="max-w-2xl bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="text-xl font-semibold text-black mb-6">
          Add Application
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

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            + Add Application
          </button>
        </form>
      </div>

      {/* Applications List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Applications
        </h2>

        {applications.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-gray-500">
            No applications added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
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

                <button
                  onClick={() => handleDelete(application.id)}
                  className="mt-4 text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;