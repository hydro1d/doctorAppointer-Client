import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        {/* Info Column */}
        <div className="footer-col info-col">
          <Link to="/" className="footer-logo">
            <Stethoscope size={28} className="logo-icon" />
            <span>DocAppoint</span>
          </Link>
          <p className="footer-desc">
            Your premium health booking companion. Connecting you with elite, top-rated clinical doctors securely, effortlessly, and in real time.
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ display: 'block' }}>
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3h-2.5v6.8c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            {/* Custom SVG for Rebranded X (formerly Twitter) */}
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ display: 'block' }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="footer-col">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/appointments">All Appointments</Link></li>
            <li><Link to="/dashboard">User Dashboard</Link></li>
            <li><Link to="/login">Account Login</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="footer-col">
          <h3 className="footer-heading">Our Services</h3>
          <ul className="footer-links">
            <li><a href="#services">Cardiology Care</a></li>
            <li><a href="#services">Neurological Health</a></li>
            <li><a href="#services">Gynecological Aid</a></li>
            <li><a href="#services">Pediatric Support</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h3 className="footer-heading">Contact Support</h3>
          <ul className="contact-details">
            <li>
              <MapPin size={18} className="contact-icon" />
              <span>Dhanmondi, Dhaka, Bangladesh</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>+880 1712-345678</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>support@docappoint.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} DocAppoint. Designed for elite patient experience. All rights reserved.
          </p>
          <div className="footer-policies">
            <a href="#privacy">Privacy Policy</a>
            <span className="bullet-dot">&bull;</span>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
