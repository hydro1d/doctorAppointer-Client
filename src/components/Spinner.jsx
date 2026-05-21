import React from 'react';

export default function Spinner({ message = 'Loading details, please wait...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-text">{message}</p>
    </div>
  );
}
