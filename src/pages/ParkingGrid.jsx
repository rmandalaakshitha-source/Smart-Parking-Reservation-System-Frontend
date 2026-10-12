import React, { useState, useEffect } from 'react';
import { getAllSlots } from '../api/slotApi';
import SlotCard from '../components/SlotCard';
import { LayoutGrid, Filter, RefreshCw, Car, CheckCircle2, Clock, Ban, Building2, MapPin, Navigation } from 'lucide-react';

const ParkingGrid = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('ALL');
  const [selectedFloor, setSelectedFloor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const fetchSlots = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAllSlots();
      setSlots(response.data);
    } catch (err) {
      setError('Failed to fetch parking slots. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Compute facility summaries
  const facilitiesMap = new Map();
  slots.forEach((s) => {
    const name = s.facilityName || 'Sample Parking Facility A';
    const addressStr = s.address ? `${s.address}, ${s.city || 'Sample City'}` : '123 Sample Location Street, Sample City';
    if (!facilitiesMap.has(name)) {
      facilitiesMap.set(name, {
        facilityName: name,
        address: addressStr,
        city: s.city || 'Sample City',
        totalSlots: 0,
        availableSlots: 0,
        floors: new Set()
      });
    }
    const fac = facilitiesMap.get(name);
    fac.totalSlots += 1;
    if (s.status === 'AVAILABLE') {
      fac.availableSlots += 1;
    }
    if (s.floor) fac.floors.add(s.floor);
  });

  const facilityList = Array.from(facilitiesMap.values());

  const filteredSlots = slots.filter((slot) => {
    const facName = slot.facilityName || 'Sample Parking Facility A';
    const facilityMatch = selectedFacility === 'ALL' || facName === selectedFacility;
    const floorMatch = selectedFloor === 'ALL' || slot.floor === selectedFloor;
    const statusMatch = selectedStatus === 'ALL' || slot.status === selectedStatus;
    return facilityMatch && floorMatch && statusMatch;
  });

  // Statistics
  const totalSlots = slots.length;
  const availableCount = slots.filter((s) => s.status === 'AVAILABLE').length;
  const reservedCount = slots.filter((s) => s.status === 'RESERVED').length;
  const occupiedCount = slots.filter((s) => s.status === 'OCCUPIED').length;

  // Extract unique options for filters
  const facilityNames = ['ALL', ...new Set(slots.map((s) => s.facilityName || 'Sample Parking Facility A'))];
  const floors = ['ALL', ...new Set(slots.map((s) => s.floor))];

  return (
    <div>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Smart Parking Facilities & Reservations</h1>
        <p style={{ fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto', color: '#94a3b8' }}>
          Explore real-world sample parking locations, view live slot availability, select a facility, and reserve your parking spot instantly.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="stat-val">{facilityList.length}</div>
            <div className="stat-lbl">Parking Facilities</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
            <Car size={24} />
          </div>
          <div>
            <div className="stat-val">{totalSlots}</div>
            <div className="stat-lbl">Total Slots</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: '#34d399' }}>{availableCount}</div>
            <div className="stat-lbl">Available Slots</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-val" style={{ color: '#fbbf24' }}>{reservedCount}</div>
            <div className="stat-lbl">Reserved Slots</div>
          </div>
        </div>
      </div>

      {/* Facilities Showcase Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 size={22} color="#818cf8" />
          Available Parking Locations & Facilities
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {facilityList.map((fac) => {
            const isSelected = selectedFacility === fac.facilityName;
            return (
              <div
                key={fac.facilityName}
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #818cf8' : '1px solid var(--border)',
                  background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.6)',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => setSelectedFacility(isSelected ? 'ALL' : fac.facilityName)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#f8fafc' }}>{fac.facilityName}</h3>
                  <span className={`slot-status-badge ${fac.availableSlots > 0 ? 'available' : 'occupied'}`}>
                    {fac.availableSlots} / {fac.totalSlots} Available
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#818cf8' }} />
                  <span>{fac.address}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid var(--border)', paddingTop: '0.6rem' }}>
                  <span>Floors: {Array.from(fac.floors).join(', ')}</span>
                  <span style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    {isSelected ? 'Viewing Slots' : 'Select Facility'} <Navigation size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="grid-header" style={{ margin: 0 }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8' }}>
              <Filter size={16} /> <strong>Filter Slots:</strong>
            </div>

            {/* Facility Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
            >
              {facilityNames.map((fac) => (
                <option key={fac} value={fac}>
                  {fac === 'ALL' ? 'All Facilities' : fac}
                </option>
              ))}
            </select>

            {/* Floor Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
            >
              {floors.map((f) => (
                <option key={f} value={f}>
                  {f === 'ALL' ? 'All Floors' : f}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.8rem' }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="OCCUPIED">Occupied</option>
            </select>

            <button onClick={fetchSlots} className="btn btn-secondary btn-sm" title="Refresh Slots">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          <div className="status-legend">
            <div className="legend-item">
              <span className="status-dot available"></span> Available
            </div>
            <div className="legend-item">
              <span className="status-dot reserved"></span> Reserved
            </div>
            <div className="legend-item">
              <span className="status-dot occupied"></span> Occupied
            </div>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="page-loader">
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
        </div>
      ) : error ? (
        <div className="alert alert-error" style={{ justifyContent: 'center' }}>
          {error}
        </div>
      ) : filteredSlots.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <LayoutGrid size={48} color="#64748b" style={{ marginBottom: '1rem' }} />
          <h3>No Parking Slots Found</h3>
          <p>Try changing your facility, floor or status filter above.</p>
        </div>
      ) : (
        <div className="parking-grid">
          {filteredSlots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParkingGrid;

