import React, { useState, useEffect } from 'react';
import {
  getUserReservations,
  cancelReservation,
} from '../api/reservationApi';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  Calendar,
  AlertCircle,
  CheckCircle,
  Ban,
  RefreshCw,
} from 'lucide-react';

const MyReservations = () => {
  const { user } = useAuth();

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchReservations = async () => {
    if (!user?.id) {
      setReservations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getUserReservations(user.id);
      setReservations(response.data);
    } catch (err) {
      setError('Failed to fetch your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const handleCancel = async (reservationId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this reservation?'
      )
    ) {
      return;
    }

    setError('');
    setActionSuccess('');

    try {
      await cancelReservation(reservationId);
      setActionSuccess('Reservation cancelled successfully.');
      await fetchReservations();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to cancel reservation.'
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1>My Parking Reservations</h1>
          <p>Track your active and past parking bookings</p>
        </div>

        <button
          onClick={fetchReservations}
          className="btn btn-secondary btn-sm"
          disabled={loading}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {actionSuccess && (
        <div className="alert alert-success">
          <CheckCircle size={18} /> {actionSuccess}
        </div>
      )}

      {loading ? (
        <div className="page-loader">
          <div
            className="spinner"
            style={{ width: '40px', height: '40px' }}
          />
        </div>
      ) : reservations.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '3rem',
          }}
        >
          <Calendar
            size={48}
            color="#64748b"
            style={{ marginBottom: '1rem' }}
          />
          <h3>No Reservations Found</h3>
          <p>You haven't booked any parking slots yet.</p>
        </div>
      ) : (
        <div
          className="glass-card"
          style={{ padding: '0.5rem' }}
        >
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Parking Facility & Address</th>
                  <th>Slot Number</th>
                  <th>Floor</th>
                  <th>Vehicle No.</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td>#{res.id}</td>

                    <td>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: '0.9rem' }}>
                          {res.parkingSlot?.facilityName || 'Sample Parking Facility A'}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {res.parkingSlot?.address ? `${res.parkingSlot.address}, ${res.parkingSlot.city || 'Sample City'}` : '123 Sample Location Street, Sample City'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong style={{ color: '#818cf8' }}>
                        {res.parkingSlot?.slotNumber || 'N/A'}
                      </strong>
                    </td>

                    <td>
                      {res.parkingSlot?.floor || 'N/A'}
                    </td>

                    <td>
                      <code
                        style={{
                          background: 'rgba(15, 23, 42, 0.6)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {res.vehicleNumber}
                      </code>
                    </td>

                    <td style={{ fontSize: '0.85rem' }}>
                      {formatDate(res.startTime)}
                    </td>

                    <td style={{ fontSize: '0.85rem' }}>
                      {formatDate(res.endTime)}
                    </td>

                    <td
                      style={{
                        fontWeight: 700,
                        color: '#34d399',
                      }}
                    >
                      ₹{Number(res.totalPrice ?? 0).toFixed(2)}
                    </td>

                    <td>
                      <StatusBadge status={res.status} />
                    </td>

                    <td>
                      {res.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => handleCancel(res.id)}
                          className="btn btn-danger btn-sm"
                          title="Cancel Reservation"
                        >
                          <Ban size={14} /> Cancel
                        </button>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: '#64748b',
                          }}
                        >
                          None
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
