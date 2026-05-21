import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { Star, ShieldAlert, Award, Calendar, HeartPulse, UserCheck, Stethoscope, BrainCircuit, Activity } from 'lucide-react';

const slideData = [
  {
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1000',
    title: 'Precision Neurological Diagnostics',
    tag: 'Neurology Specialty',
    description: 'Expert specialists for advanced brain, nerve, and chronic pain management therapies.'
  },
  {
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000',
    title: 'Pioneering Preventive Heart Care',
    tag: 'Cardiology Care',
    description: 'Advanced cardiovascular health tracking, surgery consultations, and lifestyle therapy plans.'
  },
  {
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=1000',
    title: 'Empathetic Maternal Guidance',
    tag: 'Gynecology Support',
    description: 'Compassionate prenatal support and modern minimal-invasive surgical services.'
  }
];

export default function Home() {
  const { user, API_URL } = useAuth();
  const navigate = useNavigate();
  const [topDoctors, setTopDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Fetch top rated doctors dynamically
  useEffect(() => {
    document.title = "DocAppoint | Premium Doctor Specialist Booking Portal";
    const fetchTopDoctors = async () => {
      try {
        const response = await fetch(`${API_URL}/api/doctors?sortBy=rating`);
        if (response.ok) {
          const data = await response.json();
          // Take top 3 rated doctors
          setTopDoctors(data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching top doctors:', err);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchTopDoctors();
  }, [API_URL]);

  const handleViewDetails = (doctorId) => {
    if (user) {
      navigate(`/doctor/${doctorId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. HERO BANNER SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-pulse"></span>
              <span>24/7 Digital Health Concierge</span>
            </div>
            <h1 className="hero-title">
              Your Health, <span>Our Premier Priority.</span>
            </h1>
            <p className="hero-desc">
              Connect instantly with top-tier, board-certified medical professionals. Book secure video consultations or physical hospital visits in seconds.
            </p>
            <div className="hero-buttons">
              <Link to="/appointments" className="btn btn-primary">
                <Calendar size={18} />
                <span>Book Appointment Now</span>
              </Link>
              <a href="#services" className="btn btn-secondary">
                <span>Explore Services</span>
              </a>
            </div>
          </div>

          {/* Swiper-like CSS Carousel Slider */}
          <div className="hero-slider-wrapper">
            {slideData.map((slide, idx) => (
              <div key={idx} className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}>
                <img src={slide.image} alt={slide.title} className="slide-image" />
                <div className="slide-overlay"></div>
                <div className="slide-content">
                  <span className="slide-tag">{slide.tag}</span>
                  <h3 className="slide-title">{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
            <div className="slider-dots">
              {slideData.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOP RATED DOCTORS */}
      <section className="section top-rated-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Rated Specialists</h2>
            <p className="section-subtitle">
              Book consultations with our most highly rated, patient-praised medical clinicians.
            </p>
          </div>

          {doctorsLoading ? (
            <Spinner message="Fetching our top rated medical specialists..." />
          ) : (
            <div className="doctors-grid">
              {topDoctors.map((doctor) => (
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
                    <div className="doctor-card-badge">Top Rated</div>
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
                      <Stethoscope size={16} className="doctor-card-info-icon" />
                      <span>{doctor.hospital}</span>
                    </div>
                    
                    <div className="doctor-card-fee-row">
                      <div className="doctor-card-fee">
                        ৳ {doctor.fee} <span>/ visit</span>
                      </div>
                      <button 
                        onClick={() => handleViewDetails(doctor._id)} 
                        className="btn btn-outline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/appointments" className="btn btn-secondary">
              <span>View All Available Appointments</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ADDITIONAL SECTION 1: CORE CLINICAL SERVICES */}
      <section id="services" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Medical Specialties</h2>
            <p className="section-subtitle">
              Access comprehensive, modern diagnostic and treatment programs across primary divisions.
            </p>
          </div>

          <div className="services-grid">
            <div className="glass-panel glass-panel-hover service-card">
              <div className="service-icon-wrapper">
                <HeartPulse size={30} />
              </div>
              <h3 className="service-title">Cardiology</h3>
              <p className="service-desc">Complete heart rhythm analysis, echo-cardiograms, and cholesterol control guidance.</p>
            </div>

            <div className="glass-panel glass-panel-hover service-card">
              <div className="service-icon-wrapper">
                <BrainCircuit size={30} />
              </div>
              <h3 className="service-title">Neurology</h3>
              <p className="service-desc">Chronic migraine remedies, spinal nerve therapies, and comprehensive stroke checks.</p>
            </div>

            <div className="glass-panel glass-panel-hover service-card">
              <div className="service-icon-wrapper">
                <Activity size={30} />
              </div>
              <h3 className="service-title">Gynecology</h3>
              <p className="service-desc">Advanced prenatal supervision, hormone therapies, and laproscopic surgery options.</p>
            </div>

            <div className="glass-panel glass-panel-hover service-card">
              <div className="service-icon-wrapper">
                <Stethoscope size={30} />
              </div>
              <h3 className="service-title">Pediatrics</h3>
              <p className="service-desc">Essential child nutrition strategies, growth tracking, and primary immunizations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL SECTION 2: METRICS & STATISTICS */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat-item">
            <div className="stat-number">15,000+</div>
            <div className="stat-label">Happy Patients Guided</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Diagnosis Accuracy Rate</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">80+</div>
            <div className="stat-label">Expert Clinical Doctors</div>
          </div>

          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Emergency Help Desk</div>
          </div>
        </div>
      </section>
    </div>
  );
}
