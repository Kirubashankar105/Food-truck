// pages/admin/PendingUsers.js
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/apiService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import './PendingUsers.css';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getPendingUsers();
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setError('Failed to load pending users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserVerification = async (userId, approve) => {
    try {
      setProcessingId(userId);
      setError('');
      setSuccess('');

      await adminAPI.verifyUser(userId, approve);
      
      // Remove user from list after processing
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      setSuccess(`User ${approve ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error processing user verification:', error);
      setError(error.response?.data?.error || 'Failed to process user verification');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading pending users..." />;
  }

  return (
    <div className="pending-users">
      <div className="container">
        <div className="page-header">
          <h1>Pending User Verifications</h1>
          <p>Review and approve new vendor registrations</p>
        </div>

        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert 
            type="success" 
            message={success} 
            onClose={() => setSuccess('')}
          />
        )}

        {pendingUsers.length === 0 ? (
          <div className="no-pending-users">
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <h3>All Caught Up!</h3>
              <p>No pending user verifications at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="users-grid">
            {pendingUsers.map(user => (
              <div key={user.id} className="user-card">
                <div className="user-header">
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.username}</h3>
                    <p className="user-email">{user.email}</p>
                  </div>
                </div>

                <div className="user-details">
                  <div className="detail-item">
                    <span className="detail-label">Registered:</span>
                    <span className="detail-value">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Role:</span>
                    <span className="detail-value">
                      {user.roles?.map(role => role.name || role).join(', ') || 'Vendor'}
                    </span>
                  </div>
                </div>

                <div className="user-actions">
                  <button
                    onClick={() => handleUserVerification(user.id, true)}
                    className="btn btn-success"
                    disabled={processingId === user.id}
                  >
                    {processingId === user.id ? (
                      <LoadingSpinner size="small" message="" />
                    ) : (
                      'Approve'
                    )}
                  </button>
                  <button
                    onClick={() => handleUserVerification(user.id, false)}
                    className="btn btn-danger"
                    disabled={processingId === user.id}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="page-actions">
          <button 
            onClick={fetchPendingUsers}
            className="btn btn-outline"
            disabled={isLoading}
          >
            Refresh List
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingUsers;