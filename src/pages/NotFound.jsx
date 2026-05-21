import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  React.useEffect(() => {
    document.title = "404 Route Not Found | DocAppoint";
  }, []);

  return (
    <div className="container notfound-container">
      <div className="notfound-code">404</div>
      <h2 className="notfound-title">Route Not Found</h2>
      <p className="notfound-text">
        The medical directory page you are looking for has been moved, archived, or is temporarily unavailable. Let us guide you back safely.
      </p>
      
      <Link to="/" className="btn btn-primary" style={{ gap: '10px' }}>
        <ArrowLeft size={18} />
        <span>Return to Home Page</span>
      </Link>
    </div>
  );
}
