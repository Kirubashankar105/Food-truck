import React, { useEffect, useState } from "react";
import { adminAPI } from "../../services/apiService";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.get("/vendors");
      setVendors(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (vendorId, action) => {
    setError(null);
    setSuccess(null);
    try {
      await adminAPI.put(`/vendors/${vendorId}/status`, { status: action });
      setSuccess(`Vendor ${action.toLowerCase()} successfully!`);
      fetchVendors(); // Refresh list
      setSelectedVendor(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update vendor status");
    }
  };

  return (
    <div>
      <h2>All Vendors</h2>
      {loading && <p>Loading vendors...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            {vendor.name} - {vendor.status}
            <button onClick={() => handleStatusUpdate(vendor.id, "APPROVED")}>
              Approve
            </button>
            <button onClick={() => handleStatusUpdate(vendor.id, "REJECTED")}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllVendors;
