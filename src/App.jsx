import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import AllAppointments from './pages/AllAppointments';
import DoctorDetails from './pages/DoctorDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          {/* Header Navigation */}
          <Navbar />
          
          {/* Central Body Content */}
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/appointments" element={<AllAppointments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes (Authenticated only) */}
              <Route 
                path="/doctor/:id" 
                element={
                  <PrivateRoute>
                    <DoctorDetails />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              
              {/* Custom 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Footer Component */}
          <Footer />
          
          {/* Custom Dynamic Toast Overlay */}
          <Toast />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
