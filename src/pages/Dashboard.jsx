import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { CalendarDays, User, Trash2, Edit2, ShieldCheck, Mail, Link as LinkIcon, Phone, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, token, updateProfile, showToast, API_URL } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'profile'
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // Modals state
  const [editBookingModalOpen, setEditBookingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Edit Booking Form state
  const [editPatientName, setEditPatientName] = useState('');
  const [editGender, setEditGender] = useState('Male');
  const [editPhone, setEditPhone] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  // Edit Profile Form state
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [editProfileName, setEditProfileName] = useState(user ? user.name : '');
  const [editProfilePhoto, setEditProfilePhoto] = useState(user ? user.photoUrl : '');

  const fetchBookings = async () => {
    setBookingsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [token, API_URL]);

  useEffect(() => {
    document.title = activeTab === 'bookings' 
      ? "My Scheduled Bookings | Patient Dashboard | DocAppoint" 
      : "My Profile Coordinates | Patient Dashboard | DocAppoint";
  }, [activeTab]);

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast('Appointment deleted successfully!', 'success');
        // Instantly update UI without page refresh
        setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      } else {
        showToast('Failed to cancel appointment.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during cancellation.', 'error');
    }
  };

  // Open Edit Booking modal
  const openEditBookingModal = (booking) => {
    setSelectedBooking(booking);
    setEditPatientName(booking.patientName);
    setEditGender(booking.gender);
    setEditPhone(booking.phone);
    setEditDate(booking.appointmentDate);
    setEditTime(booking.appointmentTime);
    setEditBookingModalOpen(true);
  };

  // Save Booking Updates
  const handleSaveBookingUpdate = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        patientName: editPatientName,
        gender: editGender,
        phone: editPhone,
        appointmentDate: editDate,
        appointmentTime: editTime
      };

      const response = await fetch(`${API_URL}/api/bookings/${selectedBooking._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Appointment updated successfully!', 'success');
        setEditBookingModalOpen(false);
        // Instantly update UI without reload
        setBookings((prev) => 
          prev.map((b) => (b._id === selectedBooking._id ? { ...b, ...updatedData } : b))
        );
      } else {
        showToast(data.message || 'Failed to update appointment.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during update.', 'error');
    }
  };

  // Save Profile Updates
  const handleProfileUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!editProfileName) {
      showToast('Name cannot be left empty.', 'error');
      return;
    }

    const success = await updateProfile(editProfileName, editProfilePhoto);
    if (success) {
      setEditProfileModalOpen(false);
    }
  };

  // Retrieve today's date for limiting booking dates in modal
  const getTodayDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="section container">
      <div className="dashboard-layout">
        {/* Sidebar Nav */}
        <div className="glass-panel dashboard-sidebar-card">
          <div className="dashboard-profile-badge">
            <img 
              src={user.photoUrl || 'https://i.imgur.com/6VBx3io.png'} 
              alt={user.name}
              onError={(e) => {
                e.target.src = 'https://i.imgur.com/6VBx3io.png';
              }}
            />
            <div className="dashboard-profile-name">{user.name}</div>
            <div className="dashboard-profile-email">{user.email}</div>
          </div>

          <div className="dashboard-nav-list">
            <button 
              onClick={() => setActiveTab('bookings')} 
              className={`dashboard-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            >
              <CalendarDays size={18} />
              <span>My Bookings</span>
            </button>

            <button 
              onClick={() => setActiveTab('profile')} 
              className={`dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main-content">
          {/* TAB 1: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <>
              <div className="dashboard-header-row">
                <h2 className="dashboard-view-title">My Bookings</h2>
                <span className="hero-badge">Active Consultations</span>
              </div>

              {bookingsLoading ? (
                <Spinner message="Retrieving your scheduled appointments..." />
              ) : bookings.length > 0 ? (
                <div className="bookings-list-grid">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="glass-panel booking-card">
                      <div className="booking-doctor-row">
                        <img 
                          src={booking.doctorId?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100'} 
                          alt={booking.doctorName} 
                          className="booking-doctor-avatar"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100';
                          }}
                        />
                        <div className="booking-doctor-details">
                          <h3 className="booking-docname">{booking.doctorName}</h3>
                          <span className="booking-docspec">{booking.doctorId?.specialty || 'General Practitioner'}</span>
                        </div>

                        {/* View Doctor link */}
                        {booking.doctorId && (
                          <button 
                            onClick={() => navigate(`/doctor/${booking.doctorId._id}`)} 
                            className="btn btn-secondary" 
                            style={{ position: 'absolute', top: '24px', right: '24px', padding: '6px 12px', fontSize: '0.8rem' }}
                            title="View Doctor Details"
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </button>
                        )}
                      </div>

                      <div className="booking-patient-details-grid">
                        <div className="booking-detail-badge">
                          <span className="booking-badge-lbl">Patient Name</span>
                          <span className="booking-badge-val">{booking.patientName}</span>
                        </div>

                        <div className="booking-detail-badge">
                          <span className="booking-badge-lbl">Gender / Phone</span>
                          <span className="booking-badge-val">{booking.gender} ({booking.phone})</span>
                        </div>

                        <div className="booking-detail-badge">
                          <span className="booking-badge-lbl">Scheduled Date</span>
                          <span className="booking-badge-val">{booking.appointmentDate}</span>
                        </div>

                        <div className="booking-detail-badge">
                          <span className="booking-badge-lbl">Consultation Slot</span>
                          <span className="booking-badge-val">{booking.appointmentTime}</span>
                        </div>
                      </div>

                      {/* Booking actions */}
                      <div className="booking-actions">
                        <button 
                          onClick={() => openEditBookingModal(booking)} 
                          className="btn btn-secondary w-full"
                          style={{ gap: '6px', fontSize: '0.9rem', padding: '10px' }}
                        >
                          <Edit2 size={14} />
                          <span>Update</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteBooking(booking._id)} 
                          className="btn btn-danger w-full"
                          style={{ gap: '6px', fontSize: '0.9rem', padding: '10px' }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Scheduled Appointments</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>You haven't scheduled any consultations yet. Explore our verified specialists list to get started.</p>
                  <button 
                    onClick={() => navigate('/appointments')} 
                    className="btn btn-primary"
                    style={{ marginTop: '20px' }}
                  >
                    Find Specialists
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: MY PROFILE */}
          {activeTab === 'profile' && (
            <>
              <div className="dashboard-header-row">
                <h2 className="dashboard-view-title">My Profile</h2>
                <span className="hero-badge">Patient Coordinates</span>
              </div>

              <div className="profile-details-grid">
                {/* Avatar Box */}
                <div className="glass-panel profile-avatar-large-card">
                  <img 
                    src={user.photoUrl || 'https://i.imgur.com/6VBx3io.png'} 
                    alt={user.name} 
                    className="profile-avatar-large"
                    onError={(e) => {
                      e.target.src = 'https://i.imgur.com/6VBx3io.png';
                    }}
                  />
                  <h3 className="profile-avatar-name">{user.name}</h3>
                  <button 
                    onClick={() => {
                      setEditProfileName(user.name);
                      setEditProfilePhoto(user.photoUrl || '');
                      setEditProfileModalOpen(true);
                    }} 
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    <Edit2 size={16} />
                    <span>Update Profile</span>
                  </button>
                </div>

                {/* Details list */}
                <div className="glass-panel profile-info-details-card">
                  <div className="profile-data-row">
                    <span className="profile-data-lbl">Full Name</span>
                    <span className="profile-data-val">{user.name}</span>
                  </div>

                  <div className="profile-data-row">
                    <span className="profile-data-lbl">Registered Email</span>
                    <span className="profile-data-val">{user.email}</span>
                  </div>

                  <div className="profile-data-row">
                    <span className="profile-data-lbl">Account Verification State</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-color)', fontWeight: 600 }}>
                      <ShieldCheck size={18} />
                      <span>Verified Patient</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- EDIT BOOKING MODAL --- */}
      {editBookingModalOpen && (
        <div className="modal-overlay" onClick={() => setEditBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Update Scheduled Visit</h3>
              <button className="modal-close" onClick={() => setEditBookingModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBookingUpdate}>
              <div className="modal-body">
                {/* Doctor Name (read only) */}
                <div className="form-group">
                  <label className="form-label">Specialist (Read-only)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedBooking.doctorName}
                    readOnly
                  />
                </div>

                {/* User Email (read only) */}
                <div className="form-group">
                  <label className="form-label">Patient Registered Email (Read-only)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={selectedBooking.userEmail}
                    readOnly
                  />
                </div>

                {/* Patient Name */}
                <div className="form-group">
                  <label htmlFor="editPatientName" className="form-label">Patient Legal Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="editPatientName"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      value={editPatientName}
                      onChange={(e) => setEditPatientName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Gender */}
                  <div className="form-group">
                    <label htmlFor="editGender" className="form-label">Gender</label>
                    <select
                      id="editGender"
                      className="form-input"
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label htmlFor="editPhone" className="form-label">Contact Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        id="editPhone"
                        className="form-input"
                        style={{ paddingLeft: '42px' }}
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Date */}
                  <div className="form-group">
                    <label htmlFor="editDate" className="form-label">Appointment Date</label>
                    <input
                      type="date"
                      id="editDate"
                      className="form-input"
                      min={getTodayDateString()}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time slot */}
                  <div className="form-group">
                    <label htmlFor="editTime" className="form-label">Consultation Time Slot</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        id="editTime"
                        className="form-input"
                        style={{ paddingLeft: '42px' }}
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        required
                      >
                        {/* Populate list of slots if doctor details exist, else use previous options as default */}
                        {selectedBooking.doctorId?.availability ? (
                          selectedBooking.doctorId.availability.map((slot, idx) => (
                            <option key={idx} value={slot}>{slot}</option>
                          ))
                        ) : (
                          <>
                            <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                            <option value="04:00 PM - 07:00 PM">04:00 PM - 07:00 PM</option>
                            <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                            <option value="06:00 PM - 09:00 PM">06:00 PM - 09:00 PM</option>
                            <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                            <option value="07:30 PM - 09:30 PM">07:30 PM - 09:30 PM</option>
                            <option value="11:00 AM - 02:00 PM">11:00 AM - 02:00 PM</option>
                            <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                            <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM</option>
                            <option value="04:30 PM - 07:30 PM">04:30 PM - 07:30 PM</option>
                            <option value="10:30 AM - 01:30 PM">10:30 AM - 01:30 PM</option>
                            <option value="05:30 PM - 08:30 PM">05:30 PM - 08:30 PM</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Updates</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {editProfileModalOpen && (
        <div className="modal-overlay" onClick={() => setEditProfileModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Update Profile Coordinates</h3>
              <button className="modal-close" onClick={() => setEditProfileModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileUpdateSubmit}>
              <div className="modal-body">
                {/* Email (Read-only) */}
                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="form-group">
                  <label htmlFor="editProfileName" className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="editProfileName"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      value={editProfileName}
                      onChange={(e) => setEditProfileName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="form-group">
                  <label htmlFor="editProfilePhoto" className="form-label">Avatar Image URL</label>
                  <div style={{ position: 'relative' }}>
                    <LinkIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      id="editProfilePhoto"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      value={editProfilePhoto}
                      onChange={(e) => setEditProfilePhoto(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditProfileModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
