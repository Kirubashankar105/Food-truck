import React from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} ${className}`}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        {onClose && (
          <button 
            className="alert-close" 
            onClick={onClose}
            aria-label="Close alert"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;