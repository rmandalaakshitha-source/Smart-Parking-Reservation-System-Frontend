import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, LayoutGrid, Calendar, Shield, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <div className="brand-icon">
            <Car size={22} />
          </div>
          <span>ParkEase</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <LayoutGrid size={18} /> Parking Grid
            </Link>
          </li>

          {user && (
            <li>
              <Link to="/my-reservations" className={`nav-link ${isActive('/my-reservations') ? 'active' : ''}`}>
                <Calendar size={18} /> My Bookings
              </Link>
            </li>
          )}

          {isAdmin && (
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                <Shield size={18} /> Admin Panel
              </Link>
            </li>
          )}

          {user ? (
            <>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>{user.fullName}</span>
                <span className="user-badge">{user.role}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                  <LogIn size={18} /> Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="btn btn-primary btn-sm">
                  <UserPlus size={16} /> Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
