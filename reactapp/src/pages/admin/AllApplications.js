import React, { useEffect, useState } from "react";
import { adminAPI } from "../../services/apiService";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.get("/applications");
      setApplications(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, action, comments) => {
    setError(null);
    setSuccess(null);
    try {
      await adminAPI.put(`/applications/${applicationId}/status`, {
        status: action,
        comments,
      });
      setSuccess(`Application ${action.toLowerCase()} successfully!`);
      fetchApplications();
      setSelectedApplication(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update application status"
      );
    }
  };

  return (
    <div>
      <h2>All Applications</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.vendorName} - {app.status}
            <button
              onClick={() =>
                handleStatusUpdate(app.id, "APPROVED", "Approved by admin")
              }
            >
              Approve
            </button>
            <button
              onClick={() =>
                handleStatusUpdate(app.id, "REJECTED", "Rejected by admin")
              }
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllApplications;
