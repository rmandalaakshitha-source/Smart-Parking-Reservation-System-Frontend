import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSlotById } from '../api/slotApi';
import { createReservation } from '../api/reservationApi';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  Car,
  Layers,
  MapPin,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ParkingSquare
} from 'lucide-react';

const ReserveSlot = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [slot, setSlot] = useState(null);
  const [loadingSlot, setLoadingSlot] = useState(true);

  const now = new Date();

  const defaultStart = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  const defaultEnd = new Date(
    now.getTime() -
    now.getTimezoneOffset() * 60000 +
    2 * 3600000
  )
    .toISOString()
    .slice(0, 16);

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(defaultEnd);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSlot = async () => {
      try {
        const response = await getSlotById(slotId);
        setSlot(response.data);
      } catch (err) {
        setError('Parking slot details could not be loaded.');
      } finally {
        setLoadingSlot(false);
      }
    };

    fetchSlot();
  }, [slotId]);

  const calculateTotalCost = () => {
    if (!slot || !startTime || !endTime) return 0;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    if (diffMs <= 0) return 0;

    const hours = Math.max(
      1,
      Math.ceil(diffMs / (1000 * 60 * 60))
    );

    return (hours * slot.pricePerHour).toFixed(2);
  };

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;

    if (diffMs <= 0) return 0;

    return Math.max(
      1,
      Math.ceil(diffMs / (1000 * 60 * 60))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!vehicleNumber.trim()) {
      setError('Please enter your vehicle license plate number.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      setError('End time must be after start time.');
      return;
    }

    setSubmitting(true);

    try {
      await createReservation({
        userId: user.id,
        slotId: parseInt(slotId),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        startTime: startTime + ':00',
        endTime: endTime + ':00'
      });

      setSuccess(
        'Parking slot reserved successfully! Redirecting to your bookings...'
      );

      setTimeout(() => {
        navigate('/my-reservations');
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to complete reservation. Slot may already be reserved.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSlot) {
    return (
      <div className="page-loader">
        <div
          className="spinner"
          style={{
            width: '40px',
            height: '40px'
          }}
        ></div>
      </div>
    );
  }

  if (!slot) {
    return (
      <div
        className="glass-card"
        style={{
          textAlign: 'center',
          padding: '3rem'
        }}
      >
        <h3>Parking Slot Not Found</h3>

        <Link
          to="/"
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Back to Parking Grid
        </Link>
      </div>
    );
  }

  const hours = calculateHours();
  const totalCost = calculateTotalCost();

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto'
      }}
    >
      <Link
        to="/"
        className="btn btn-secondary btn-sm"
        style={{
          marginBottom: '1.5rem'
        }}
      >
        <ArrowLeft size={16} />
        Back to Slots
      </Link>

      <div className="glass-card">

        {/* HEADER */}
        <div
          style={{
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h2>
              Reserve Parking Slot {slot.slotNumber}
            </h2>

            <span className="slot-status-badge available">
              {slot.status}
            </span>
          </div>

          <p
            style={{
              margin: '0.4rem 0 0 0'
            }}
          >
            Confirm your parking location, vehicle and duration
            details below.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        {/* PARKING LOCATION */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '1px solid var(--border)'
          }}
        >
          <h3
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem',
              color: '#f8fafc'
            }}
          >
            <MapPin size={20} color="#818cf8" />
            Parking Location Details
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(2, minmax(0, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* FACILITY NAME */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Facility Name
              </span>

              <strong style={{ color: '#818cf8', fontSize: '1rem' }}>
                {slot.facilityName || 'Sample Parking Facility A'}
              </strong>
            </div>

            {/* ADDRESS & CITY */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Address & City
              </span>

              <strong style={{ color: '#e2e8f0' }}>
                {slot.address ? `${slot.address}, ${slot.city || 'Sample City'}` : '123 Sample Location Street, Sample City'}
              </strong>
            </div>

            {/* SLOT NUMBER */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Slot Number
              </span>

              <strong
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#34d399'
                }}
              >
                <ParkingSquare size={16} />
                {slot.slotNumber}
              </strong>
            </div>

            {/* FLOOR */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Floor
              </span>

              <strong
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Layers size={16} />
                {slot.floor}
              </strong>
            </div>

            {/* TYPE */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Slot Type
              </span>

              <strong
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Car size={16} />
                {slot.slotType}
              </strong>
            </div>

            {/* RATE */}
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  display: 'block',
                  marginBottom: '0.25rem'
                }}
              >
                Hourly Rate
              </span>

              <strong style={{ color: '#818cf8' }}>
                ₹{slot.pricePerHour.toFixed(2)}/hr
              </strong>
            </div>

          </div>
        </div>

        {/* RESERVATION FORM */}
        <form onSubmit={handleSubmit}>

          {/* VEHICLE */}
          <div className="form-group">
            <label className="form-label">
              Vehicle License Plate Number *
            </label>

            <input
              type="text"
              className="form-input"
              placeholder="e.g. TS-09-AB-1234"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(e.target.value)
              }
              required
            />
          </div>

          {/* DATE AND TIME */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <div className="form-group">
              <label className="form-label">
                <Clock size={15} />
                Start Date & Time *
              </label>

              <input
                type="datetime-local"
                className="form-input"
                value={startTime}
                onChange={(e) =>
                  setStartTime(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock size={15} />
                End Date & Time *
              </label>

              <input
                type="datetime-local"
                className="form-input"
                value={endTime}
                onChange={(e) =>
                  setEndTime(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* PRICING */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(99, 102, 241, 0.05))',
              border:
                '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              margin: '1.5rem 0'
            }}
          >

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}
            >
              <span>Duration:</span>
              <strong>
                {hours} Hour(s)
              </strong>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}
            >
              <span>Rate per Hour:</span>

              <span>
                ₹{slot.pricePerHour.toFixed(2)}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop:
                  '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '0.75rem',
                fontSize: '1.15rem',
                fontWeight: 700
              }}
            >
              <span>
                Total Estimated Price:
              </span>

              <span
                style={{
                  color: '#34d399'
                }}
              >
                ₹{totalCost}
              </span>
            </div>
          </div>

          {/* CONFIRM BUTTON */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem'
            }}
            disabled={
              submitting || hours <= 0
            }
          >
            {submitting ? (
              <div className="spinner"></div>
            ) : (
              `Confirm Reservation (₹${totalCost})`
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ReserveSlot;