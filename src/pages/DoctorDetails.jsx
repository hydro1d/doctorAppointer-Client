import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Star, MapPin, Building, Calendar, DollarSign, Award, MessageSquare, ArrowLeft, Clock, User, Phone, Check } from 'lucide-react';

export default function DoctorDetails() {
  const { id } = useParams();
  const { user, token, showToast, API_URL } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [patientName, setPatientName] = useState(user ? user.name : '');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');

  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchDoctorDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDoctor(data);
        // Pre-fill first availability slot
        if (data.availability && data.availability.length > 0) {
          setAppointmentTime(data.availability[0]);
        }
      } else {
        showToast('Doctor not found.', 'error');
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id, API_URL]);

  useEffect(() => {
    if (doctor) {
      document.title = `${doctor.name} | ${doctor.specialty} Specialist | DocAppoint`;
    } else {
      document.title = "Doctor Details | DocAppoint";
    }
  }, [doctor]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || !phone || !appointmentDate || !appointmentTime) {
      showToast('Please fill all booking details.', 'error');
      return;
    }

    try {
      const bookingData = {
        userEmail: user.email,
        doctorName: doctor.name,
        doctorId: doctor._id,
        patientName,
        gender,
        phone,
        appointmentDate,
        appointmentTime
      };

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Appointment booked successfully!', 'success');
        setBookingModalOpen(false);
        // Reset booking form
        setPhone('');
        setAppointmentDate('');
      } else {
        showToast(data.message || 'Booking failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during booking.', 'error');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      showToast('Please enter a review comment.', 'error');
      return;
    }

    setReviewSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/doctors/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Review added successfully!', 'success');
        setReviewComment('');
        setReviewRating(5);
        // Instantly reload doctor details to reflect reviews
        setDoctor(data.doctor);
      } else {
        showToast(data.message || 'Failed to submit review.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during review submission.', 'error');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Get current date string for HTML5 date input min attribute (to prevent booking in the past)
  const getTodayDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  if (loading) return <Spinner message="Loading expert physician profile..." />;
  if (!doctor) {
    return (
      <div className="section container" style={{ textAlign: 'center' }}>
        <h2>Doctor Profile Not Found</h2>
        <Link to="/appointments" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to All Appointments
        </Link>
      </div>
    );
  }

  return (
    <div className="section container">
      {/* Back button */}
      <Link to="/appointments" className="btn btn-secondary" style={{ marginBottom: '30px' }}>
        <ArrowLeft size={16} />
        <span>Back to Appointments</span>
      </Link>

      <div className="doctor-details-layout">
        {/* Left column - Large Image */}
        <div className="doctor-detail-image-box">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="doctor-detail-img" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
            }}
          />
        </div>

        {/* Right column - Main coordinates */}
        <div className="doctor-details-main">
          <div className="glass-panel doctor-header-card">
            <div className="doctor-title-row">
              <span className="doctor-details-specialty">{doctor.specialty}</span>
              <div className="doctor-card-rating" style={{ position: 'static' }}>
                <Star size={16} fill="#fbbf24" stroke="none" />
                <span>{doctor.rating}</span>
              </div>
            </div>
            <h1 className="doctor-details-name">{doctor.name}</h1>
            <p className="doctor-details-description">{doctor.description}</p>
          </div>

          {/* Details Table */}
          <div className="glass-panel doctor-info-table">
            <div className="detail-table-item">
              <div className="detail-table-icon-wrapper">
                <Award size={20} />
              </div>
              <div>
                <span className="detail-table-label">Experience</span>
                <span className="detail-table-val">{doctor.experience}</span>
              </div>
            </div>

            <div className="detail-table-item">
              <div className="detail-table-icon-wrapper">
                <Building size={20} />
              </div>
              <div>
                <span className="detail-table-label">Hospital</span>
                <span className="detail-table-val">{doctor.hospital}</span>
              </div>
            </div>

            <div className="detail-table-item">
              <div className="detail-table-icon-wrapper">
                <MapPin size={20} />
              </div>
              <div>
                <span className="detail-table-label">Location</span>
                <span className="detail-table-val">{doctor.location}</span>
              </div>
            </div>

            <div className="detail-table-item">
              <div className="detail-table-icon-wrapper">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="detail-table-label">Consultation Fee</span>
                <span className="detail-table-val">৳ {doctor.fee}</span>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="glass-panel doctor-availability-card">
            <h3 style={{ fontSize: '1.25rem' }}>Availability Slots</h3>
            <ul className="availability-list">
              {doctor.availability.map((slot, idx) => (
                <li key={idx} className="availability-item">
                  <span className="availability-bullet"></span>
                  <span>{slot}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Row */}
          <div className="glass-panel action-row-details" style={{ padding: '24px 30px' }}>
            <div className="doctor-fee-display">
              <span className="doctor-fee-label">Standard Visiting Fee</span>
              <span className="doctor-fee-val">৳ {doctor.fee}</span>
            </div>
            <button 
              onClick={() => setBookingModalOpen(true)} 
              className="btn btn-primary"
              style={{ padding: '16px 36px', fontSize: '1.1rem' }}
            >
              <Calendar size={20} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. REVIEWS SECTION */}
      <div className="reviews-section-wrapper">
        <div className="reviews-header">
          <MessageSquare size={24} className="contact-icon" />
          <h2 style={{ fontSize: '1.75rem' }}>Patient Reviews ({doctor.reviews ? doctor.reviews.length : 0})</h2>
        </div>

        {/* List of reviews */}
        <div className="reviews-grid-details">
          {doctor.reviews && doctor.reviews.length > 0 ? (
            doctor.reviews.map((rev) => (
              <div key={rev._id} className="glass-panel review-item-card">
                <div className="review-author-row">
                  <div className="review-author-profile">
                    <img 
                      src={rev.userPhoto || 'https://i.imgur.com/6VBx3io.png'} 
                      alt={rev.userName} 
                      className="review-author-avatar" 
                      onError={(e) => {
                        e.target.src = 'https://i.imgur.com/6VBx3io.png';
                      }}
                    />
                    <div>
                      <h4 className="review-author-name">{rev.userName}</h4>
                      <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="review-stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={14} 
                        fill={idx < rev.rating ? '#fbbf24' : 'none'} 
                        stroke={idx < rev.rating ? 'none' : 'currentColor'} 
                      />
                    ))}
                  </div>
                </div>
                <p className="review-comment">"{rev.comment}"</p>
              </div>
            ))
          ) : (
            <div className="glass-panel" style={{ padding: '30px', gridColumn: 'span 2', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No reviews submitted for this specialist yet. Be the first to add your healing feedback!</p>
            </div>
          )}
        </div>

        {/* Add Review Form */}
        {user ? (
          <div className="glass-panel add-review-form-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label className="form-label">Review Rating</label>
                <div className="rating-select-group">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const starVal = idx + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`star-rating-btn ${starVal <= reviewRating ? 'active' : ''}`}
                        onClick={() => setReviewRating(starVal)}
                      >
                        <Star size={28} fill={starVal <= reviewRating ? '#fbbf24' : 'none'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment" className="form-label">Review Comment</label>
                <textarea
                  id="comment"
                  className="form-input"
                  rows="4"
                  placeholder="Share details of your clinical visit experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  style={{ resize: 'none' }}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={reviewSubmitting}
                style={{ width: '100%' }}
              >
                <span>{reviewSubmitting ? 'Submitting review...' : 'Submit Review'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '24px', maxWidth: '600px', textAlign: 'center' }}>
            <p>Please <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Login</Link> to submit your patient feedback review.</p>
          </div>
        )}
      </div>

      {/* --- APPOINTMENT BOOKING MODAL --- */}
      {bookingModalOpen && (
        <div className="modal-overlay" onClick={() => setBookingModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Book Health Visit</h3>
              <button className="modal-close" onClick={() => setBookingModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit}>
              <div className="modal-body">
                {/* User Email (read-only) */}
                <div className="form-group">
                  <label className="form-label">Patient Email (Read-only)</label>
                  <input
                    type="email"
                    className="form-input"
                    value={user.email}
                    readOnly
                  />
                </div>

                {/* Doctor Name (read-only) */}
                <div className="form-group">
                  <label className="form-label">Specialist Practitioner (Read-only)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={doctor.name}
                    readOnly
                  />
                </div>

                {/* Patient Name */}
                <div className="form-group">
                  <label htmlFor="patientName" className="form-label">Patient Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      id="patientName"
                      className="form-input"
                      style={{ paddingLeft: '42px' }}
                      placeholder="Enter patient full legal name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Gender */}
                  <div className="form-group">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <select
                      id="gender"
                      className="form-input"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Contact Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="tel"
                        id="phone"
                        className="form-input"
                        style={{ paddingLeft: '42px' }}
                        placeholder="e.g. 017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {/* Date */}
                  <div className="form-group">
                    <label htmlFor="date" className="form-label">Appointment Date</label>
                    <input
                      type="date"
                      id="date"
                      className="form-input"
                      min={getTodayDateString()}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Time slot */}
                  <div className="form-group">
                    <label htmlFor="time" className="form-label">Availability Slots</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <select
                        id="time"
                        className="form-input"
                        style={{ paddingLeft: '42px' }}
                        value={appointmentTime}
                        onChange={(e) => setAppointmentTime(e.target.value)}
                        required
                      >
                        {doctor.availability.map((slot, idx) => (
                          <option key={idx} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Confirm Booking</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
