import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Link as LinkIcon, Lock, CheckCircle2, XCircle } from 'lucide-react';

export default function Register() {
  const { register, socialLogin, showToast } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Password validation state
  const [hasUpper, setHasUpper] = useState(false);
  const [hasLower, setHasLower] = useState(false);
  const [isLengthOk, setIsLengthOk] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const navigate = useNavigate();

  // Set document title
  React.useEffect(() => {
    document.title = "Register Patient Account | DocAppoint";
  }, []);

  // Evaluate password rules on change
  useEffect(() => {
    setHasUpper(/[A-Z]/.test(password));
    setHasLower(/[a-z]/.test(password));
    setIsLengthOk(password.length >= 6);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    // Strict validation
    if (!hasUpper || !hasLower || !isLengthOk) {
      showToast('Password does not meet validation criteria.', 'error');
      return;
    }

    setSubmitting(true);
    const success = await register(name, email, password, photoUrl);
    setSubmitting(false);

    if (success) {
      navigate('/login');
    }
  };

  const handleSocialClick = async (provider) => {
    setSubmitting(true);
    const success = await socialLogin(provider);
    setSubmitting(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page-wrapper container">
      <div className="glass-panel auth-card">
        <div className="auth-header-card">
          <h2 className="auth-title">Register</h2>
          <p className="auth-subtitle">Create a patient account to manage secure appointments.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                id="name"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="Rahim Uddin"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                id="email"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="patient@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          <div className="form-group">
            <label htmlFor="photoUrl" className="form-label">Profile Image URL</label>
            <div style={{ position: 'relative' }}>
              <LinkIcon size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="url"
                id="photoUrl"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="https://example.com/avatar.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                id="password"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRules(true)}
                required
              />
            </div>

            {/* Dynamic Password Validation Rules Panel */}
            {showRules && (
              <div className="pw-rules-container">
                <h4 className="pw-rules-title">Password Validation Rules:</h4>
                <div className={`pw-rule-item ${hasUpper ? 'valid' : ''}`}>
                  {hasUpper ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>Must contain at least 1 uppercase letter</span>
                </div>
                <div className={`pw-rule-item ${hasLower ? 'valid' : ''}`}>
                  {hasLower ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>Must contain at least 1 lowercase letter</span>
                </div>
                <div className={`pw-rule-item ${isLengthOk ? 'valid' : ''}`}>
                  {isLengthOk ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>Minimum length of 6 characters</span>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary w-full" 
            style={{ padding: '14px', marginTop: '10px' }}
            disabled={submitting || (!hasUpper || !hasLower || !isLengthOk)}
          >
            <span>{submitting ? 'Registering user...' : 'Register'}</span>
          </button>
        </form>

        <div className="social-login-divider">or signup with</div>

        <div className="social-login-buttons-container">
          <button 
            type="button" 
            onClick={() => handleSocialClick('Google')} 
            className="social-login-btn"
            disabled={submitting}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Sign up via Google</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => handleSocialClick('GitHub')} 
            className="social-login-btn"
            disabled={submitting}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style={{ display: 'block' }}>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>Sign up via GitHub</span>
          </button>
        </div>

        <div className="auth-footer-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}
