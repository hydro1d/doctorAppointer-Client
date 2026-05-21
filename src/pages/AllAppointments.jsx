import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Star, Search, Award, MapPin, Building, DollarSign } from 'lucide-react';

export default function AllAppointments() {
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Fetch doctors dynamically when search term or sort criteria changes
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/doctors`;
      const params = [];
      
      if (searchTerm) {
        params.push(`search=${encodeURIComponent(searchTerm)}`);
      }
      if (sortBy) {
        params.push(`sortBy=${encodeURIComponent(sortBy)}`);
      }

      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "All Available Appointments | Verified Doctors | DocAppoint";
    // Initial fetch
    fetchDoctors();
  }, [sortBy]); // Refetch automatically on sort change

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleViewDetails = (doctorId) => {
    if (user) {
      navigate(`/doctor/${doctorId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="section container">
      <div className="appointments-page-header">
        <div>
          <h2 className="section-title" style={{ margin: 0 }}>Available Specialists</h2>
          <p className="section-subtitle">Find and book appointments with verified healthcare practitioners.</p>
        </div>

        {/* Search & Sort Panel */}
        <form onSubmit={handleSearchSubmit} className="search-sort-bar">
          <div className="search-box-wrapper">
            <Search size={18} className="search-icon-inside" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px' }}>
            Search
          </button>
          
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="fee-low-high">Fee: Low to High</option>
            <option value="fee-high-low">Fee: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </form>
      </div>

      {loading ? (
        <Spinner message="Searching verified specialist profiles..." />
      ) : (
        <div className="doctors-grid">
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div key={doctor._id} className="glass-panel glass-panel-hover doctor-card">
                <div className="doctor-card-image-wrapper">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="doctor-card-img" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <div className="doctor-card-rating">
                    <Star size={14} fill="#fbbf24" stroke="none" />
                    <span>{doctor.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="doctor-card-body">
                  <span className="doctor-card-specialty">{doctor.specialty}</span>
                  <h3 className="doctor-card-name">{doctor.name}</h3>
                  
                  <div className="doctor-card-info-item">
                    <Award size={16} className="doctor-card-info-icon" />
                    <span>{doctor.experience} Experience</span>
                  </div>
                  
                  <div className="doctor-card-info-item">
                    <Building size={16} className="doctor-card-info-icon" />
                    <span>{doctor.hospital}</span>
                  </div>
                  
                  <div className="doctor-card-info-item">
                    <MapPin size={16} className="doctor-card-info-icon" />
                    <span>{doctor.location}</span>
                  </div>
                  
                  <div className="doctor-card-fee-row">
                    <div className="doctor-card-fee">
                      ৳ {doctor.fee} <span>/ visit</span>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(doctor._id)} 
                      className="btn btn-primary"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>No Specialists Found</h3>
              <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any doctor matching your search. Please try another name or filter.</p>
              <button 
                type="button" 
                onClick={() => { setSearchTerm(''); setSortBy(''); }} 
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
