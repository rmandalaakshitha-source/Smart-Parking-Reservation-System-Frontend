import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClass = (s) => {
    switch (s) {
      case 'AVAILABLE':
      case 'COMPLETED':
        return 'available';
      case 'RESERVED':
      case 'CONFIRMED':
        return 'reserved';
      case 'OCCUPIED':
      case 'CANCELLED':
        return 'occupied';
      default:
        return 'available';
    }
  };

  return (
    <span className={`slot-status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
