import React, { useEffect, useState } from "react";
import { vendorAPI } from "../../services/apiService";

const VendorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await vendorAPI.get("/applications");
      setApplications(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSubmit = async (newApp) => {
    setError(null);
    setSuccess(null);
    try {
      await vendorAPI.post("/applications", newApp);
      setSuccess("Application submitted successfully!");
      fetchApplications(); // refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    }
  };

  const handleDelete = async (appId) => {
    setError(null);
    setSuccess(null);
    try {
      await vendorAPI.delete(`/applications/${appId}`);
      setSuccess("Application deleted successfully!");
      fetchApplications();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete application");
    }
  };

  return (
    <div>
      <h2>My Applications</h2>
      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <ul>
        {applications.map((app) => (
          <li key={app.id}>
            {app.title} - {app.status}
            <button onClick={() => handleDelete(app.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorApplications;
