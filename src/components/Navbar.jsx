import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Sun, Moon, Menu, X, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container container">
        {/* Logo and Name */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon-wrapper">
            <Stethoscope size={28} className="logo-icon" />
          </div>
          <span className="logo-text">DocAppoint</span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-menu desktop-only">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/appointments" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            All Appointments
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Dashboard
          </NavLink>
        </div>

        {/* Actions (Theme & Auth) */}
        <div className="nav-actions desktop-only">
          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="user-profile-nav">
              <Link to="/dashboard" className="user-avatar-wrapper">
                <img 
                  src={user.photoUrl || 'https://i.imgur.com/6VBx3io.png'} 
                  alt={user.name} 
                  className="user-nav-avatar"
                  onError={(e) => {
                    e.target.src = 'https://i.imgur.com/6VBx3io.png';
                  }}
                />
                <span className="user-nav-name">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile Buttons */}
        <div className="mobile-actions-wrapper mobile-only">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="drawer-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "drawer-link active" : "drawer-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink 
            to="/appointments" 
            className={({ isActive }) => isActive ? "drawer-link active" : "drawer-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            All Appointments
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "drawer-link active" : "drawer-link"}
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>

          <hr className="drawer-divider" />

          {user ? (
            <div className="drawer-user-info">
              <div className="drawer-user-card">
                <img 
                  src={user.photoUrl || 'https://i.imgur.com/6VBx3io.png'} 
                  alt={user.name} 
                  className="drawer-avatar" 
                />
                <div className="drawer-user-details">
                  <div className="drawer-username">{user.name}</div>
                  <div className="drawer-useremail">{user.email}</div>
                </div>
              </div>
              
              <button onClick={handleLogout} className="btn btn-danger w-full drawer-logout-btn">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="drawer-auth-buttons">
              <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
