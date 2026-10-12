
import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Car, Layers, MapPin, Building2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SlotCard = ({ slot }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleReserve = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/reserve/${slot.id}`);
    }
  };

  const isAvailable = slot.status === 'AVAILABLE';

  const facilityName = slot.facilityName || 'Sample Parking Facility A';
  const address = slot.address ? `${slot.address}, ${slot.city || 'Sample City'}` : '123 Sample Location Street, Sample City';

  return (
    <div className={`slot-card ${slot.status.toLowerCase()}`}>
      <div>
        <div className="slot-header">
          <div className="slot-number">{slot.slotNumber}</div>
          <StatusBadge status={slot.status} />
        </div>

        {/* Facility & Address Info */}
        <div style={{ marginBottom: '0.8rem', paddingBottom: '0.6rem', borderBottom: '1px dashed var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            <Building2 size={15} color="#818cf8" />
            <span>{facilityName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.78rem' }}>
            <MapPin size={13} color="#94a3b8" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{address}</span>
          </div>
        </div>

        <div className="slot-details">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Layers size={14} color="#94a3b8" />
            <span>{slot.floor}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Car size={14} color="#94a3b8" />
            <span>{slot.slotType}</span>
          </div>
        </div>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              color: '#94a3b8'
            }}
          >
            Hourly Rate
          </span>

          <span className="slot-price">
            ₹{slot.pricePerHour?.toFixed(2)}/hr
          </span>
        </div>

        <button
          onClick={handleReserve}
          disabled={!isAvailable}
          className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: '100%' }}
        >
          {isAvailable ? (
            <>
              Reserve Now <ArrowRight size={16} />
            </>
          ) : (
            slot.status
          )}
        </button>
      </div>
    </div>
  );
};

export default SlotCard;