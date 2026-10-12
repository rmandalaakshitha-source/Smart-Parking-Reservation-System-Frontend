import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/adminApi';
import {
  getAllSlots,
  createSlot,
  deleteSlot,
  updateSlotStatus,
} from '../api/slotApi';
import {
  getAllReservations,
  updateReservationStatus,
} from '../api/reservationApi';
import StatusBadge from '../components/StatusBadge';

import {
  Shield,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Clock,
  Layers,
  RefreshCw,
  X,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [slots, setSlots] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('slots');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [newSlot, setNewSlot] = useState({
    slotNumber: '',
    facilityName: 'Sample Parking Facility A',
    address: '123 Sample Location Street, Block 4',
    city: 'Sample City',
    floor: 'Ground Floor',
    slotType: 'Regular',
    pricePerHour: 15.0,
    status: 'AVAILABLE',
  });

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const [statsRes, slotsRes, reservationsRes] =
        await Promise.all([
          getDashboardStats(),
          getAllSlots(),
          getAllReservations(),
        ]);

      setStats(statsRes.data);
      setSlots(slotsRes.data);
      setReservations(reservationsRes.data);
    } catch (err) {
      setError(
        'Failed to fetch admin dashboard data. Please check backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createSlot(newSlot);

      setSuccess(
        `Parking Slot ${newSlot.slotNumber} added successfully!`
      );

      setShowAddModal(false);

      setNewSlot({
        slotNumber: '',
        facilityName: 'Sample Parking Facility A',
        address: '123 Sample Location Street, Block 4',
        city: 'Sample City',
        floor: 'Ground Floor',
        slotType: 'Regular',
        pricePerHour: 15.0,
        status: 'AVAILABLE',
      });

      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to add parking slot.'
      );
    }
  };

  const handleDeleteSlot = async (slotId, slotNumber) => {
    if (
      !window.confirm(
        `Are you sure you want to delete slot ${slotNumber}?`
      )
    ) {
      return;
    }

    try {
      await deleteSlot(slotId);

      setSuccess(`Slot ${slotNumber} deleted.`);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to delete parking slot.'
      );
    }
  };

  const handleSlotStatusChange = async (slotId, newStatus) => {
    try {
      await updateSlotStatus(slotId, newStatus);

      setSuccess('Slot status updated.');
      fetchData();
    } catch (err) {
      setError('Failed to update slot status.');
    }
  };

  const handleReservationStatusChange = async (
    reservationId,
    newStatus
  ) => {
    try {
      await updateReservationStatus(
        reservationId,
        newStatus
      );

      setSuccess(
        `Reservation #${reservationId} updated to ${newStatus}.`
      );

      fetchData();
    } catch (err) {
      setError(
        'Failed to update reservation status.'
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Admin Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Shield color="#818cf8" size={32} />
            Admin Management Dashboard
          </h1>

          <p>
            Full control over parking slots, status updates,
            and customer bookings
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add Parking Slot
          </button>

          <button
            onClick={fetchData}
            className="btn btn-secondary"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="alert alert-success">
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          {/* Total Slots */}
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
              }}
            >
              <Layers size={24} />
            </div>

            <div>
              <div className="stat-val">
                {stats.totalSlots}
              </div>

              <div className="stat-lbl">
                Total Slots
              </div>
            </div>
          </div>

          {/* Available */}
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
              }}
            >
              <CheckCircle size={24} />
            </div>

            <div>
              <div
                className="stat-val"
                style={{ color: '#34d399' }}
              >
                {stats.availableSlots}
              </div>

              <div className="stat-lbl">
                Available
              </div>
            </div>
          </div>

          {/* Reserved */}
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
              }}
            >
              <Clock size={24} />
            </div>

            <div>
              <div
                className="stat-val"
                style={{ color: '#fbbf24' }}
              >
                {stats.reservedSlots}
              </div>

              <div className="stat-lbl">
                Reserved
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="stat-card">
            <div
              className="stat-icon"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
              }}
            >
              <DollarSign size={24} />
            </div>

            <div>
              <div
                className="stat-val"
                style={{ color: '#34d399' }}
              >
                ₹{stats.totalRevenue.toFixed(2)}
              </div>

              <div className="stat-lbl">
                Total Revenue
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          className={`btn ${activeTab === 'slots'
              ? 'btn-primary'
              : 'btn-secondary'
            }`}
          onClick={() => setActiveTab('slots')}
        >
          Manage Slots ({slots.length})
        </button>

        <button
          className={`btn ${activeTab === 'reservations'
              ? 'btn-primary'
              : 'btn-secondary'
            }`}
          onClick={() =>
            setActiveTab('reservations')
          }
        >
          All Reservations ({reservations.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="page-loader">
          <div
            className="spinner"
            style={{
              width: '40px',
              height: '40px',
            }}
          ></div>
        </div>
      ) : activeTab === 'slots' ? (
        /* Slots Management */
        <div
          className="glass-card"
          style={{ padding: '0.5rem' }}
        >
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Slot Number</th>
                  <th>Facility & Address</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Price/Hr</th>
                  <th>Status</th>
                  <th>Change Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>
                      <strong
                        style={{
                          color: '#fff',
                          fontSize: '1rem',
                        }}
                      >
                        {slot.slotNumber}
                      </strong>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#818cf8', fontSize: '0.9rem' }}>
                          {slot.facilityName || 'Sample Parking Facility A'}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {slot.address ? `${slot.address}, ${slot.city || 'Sample City'}` : '123 Sample Location Street, Sample City'}
                        </div>
                      </div>
                    </td>

                    <td>{slot.floor}</td>

                    <td>{slot.slotType}</td>

                    <td
                      style={{
                        color: '#818cf8',
                        fontWeight: 600,
                      }}
                    >
                      ₹{slot.pricePerHour?.toFixed(2)}
                    </td>

                    <td>
                      <StatusBadge
                        status={slot.status}
                      />
                    </td>

                    <td>
                      <select
                        className="form-select"
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.85rem',
                        }}
                        value={slot.status}
                        onChange={(e) =>
                          handleSlotStatusChange(
                            slot.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="AVAILABLE">
                          AVAILABLE
                        </option>

                        <option value="RESERVED">
                          RESERVED
                        </option>

                        <option value="OCCUPIED">
                          OCCUPIED
                        </option>
                      </select>
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          handleDeleteSlot(
                            slot.id,
                            slot.slotNumber
                          )
                        }
                        className="btn btn-danger btn-sm"
                        title="Delete Slot"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Reservations Management */
        <div
          className="glass-card"
          style={{ padding: '0.5rem' }}
        >
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Parking Facility & Address</th>
                  <th>Slot</th>
                  <th>Vehicle No</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id}>
                    <td>#{res.id}</td>

                    <td>
                      <div>
                        <strong>
                          {res.user?.fullName}
                        </strong>

                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                          }}
                        >
                          {res.user?.email}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#f8fafc', fontSize: '0.85rem' }}>
                          {res.parkingSlot?.facilityName || 'Sample Parking Facility A'}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {res.parkingSlot?.address ? `${res.parkingSlot.address}, ${res.parkingSlot.city || 'Sample City'}` : '123 Sample Location Street, Sample City'}
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong
                        style={{
                          color: '#818cf8',
                        }}
                      >
                        {res.parkingSlot?.slotNumber}
                      </strong>
                    </td>

                    <td>
                      <code>
                        {res.vehicleNumber}
                      </code>
                    </td>

                    <td
                      style={{
                        fontSize: '0.8rem',
                      }}
                    >
                      {formatDate(res.startTime)}
                    </td>

                    <td
                      style={{
                        fontSize: '0.8rem',
                      }}
                    >
                      {formatDate(res.endTime)}
                    </td>

                    <td
                      style={{
                        color: '#34d399',
                        fontWeight: 700,
                      }}
                    >
                      ₹{res.totalPrice?.toFixed(2)}
                    </td>

                    <td>
                      <StatusBadge
                        status={res.status}
                      />
                    </td>

                    <td>
                      <select
                        className="form-select"
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.85rem',
                        }}
                        value={res.status}
                        onChange={(e) =>
                          handleReservationStatusChange(
                            res.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="CONFIRMED">
                          CONFIRMED
                        </option>

                        <option value="OCCUPIED">
                          OCCUPIED
                        </option>

                        <option value="COMPLETED">
                          COMPLETED
                        </option>

                        <option value="CANCELLED">
                          CANCELLED
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '440px',
              width: '100%',
              background: '#1e293b',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h3>Add New Parking Slot</h3>

              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="btn btn-secondary btn-sm"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSlotSubmit}>
              {/* Facility Name */}
              <div className="form-group">
                <label className="form-label">
                  Parking Facility Name
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sample Parking Facility A"
                  value={newSlot.facilityName}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      facilityName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label className="form-label">
                  Street Address
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 123 Sample Location Street"
                  value={newSlot.address}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      address: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* City */}
              <div className="form-group">
                <label className="form-label">
                  City
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sample City"
                  value={newSlot.city}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      city: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Slot Number */}
              <div className="form-group">
                <label className="form-label">
                  Slot Number (e.g. A-107, B-207)
                </label>

                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. A-107"
                  value={newSlot.slotNumber}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      slotNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* Floor */}
              <div className="form-group">
                <label className="form-label">
                  Floor
                </label>

                <select
                  className="form-select"
                  value={newSlot.floor}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      floor: e.target.value,
                    })
                  }
                >
                  <option value="Ground Floor">
                    Ground Floor
                  </option>

                  <option value="1st Floor">
                    1st Floor
                  </option>

                  <option value="2nd Floor">
                    2nd Floor
                  </option>

                  <option value="Basement 1">
                    Basement 1
                  </option>

                  <option value="Basement 2">
                    Basement 2
                  </option>
                </select>
              </div>

              {/* Slot Type */}
              <div className="form-group">
                <label className="form-label">
                  Slot Type
                </label>

                <select
                  className="form-select"
                  value={newSlot.slotType}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      slotType: e.target.value,
                    })
                  }
                >
                  <option value="Regular">
                    Regular
                  </option>

                  <option value="Compact">
                    Compact
                  </option>

                  <option value="SUV">
                    SUV
                  </option>

                  <option value="EV Charging">
                    EV Charging
                  </option>

                  <option value="Disabled">
                    Disabled
                  </option>
                </select>
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">
                  Price per Hour (₹)
                </label>

                <input
                  type="number"
                  step="0.5"
                  className="form-input"
                  value={newSlot.pricePerHour}
                  onChange={(e) =>
                    setNewSlot({
                      ...newSlot,
                      pricePerHour:
                        parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </div>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Create Slot
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
