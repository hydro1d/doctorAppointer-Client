import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [toasts, setToasts] = useState([]);

  // Toast System Function
  const showToast = (text, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load user on startup if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token expired or invalid
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          showToast('Session expired. Please log in again.', 'info');
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Registration Function
  const register = async (name, email, password, photoUrl) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, photoUrl })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Registration successful! Please log in.', 'success');
        return true;
      } else {
        showToast(data.message || 'Registration failed.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during registration.', 'error');
      return false;
    }
  };

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        return true;
      } else {
        showToast(data.message || 'Login failed. Please check your credentials.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during login.', 'error');
      return false;
    }
  };

  // Social Login Function (Simulated for Google/GitHub Auth as requested)
  const socialLogin = async (provider) => {
    try {
      // Create a mock authenticated user details based on standard credentials
      const dummyUser = {
        name: `Social User (${provider})`,
        email: `social_${provider.toLowerCase()}@gmail.com`,
        photoUrl: provider === 'Google' 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
          : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
        password: 'SocialPassword123'
      };

      // Ensure this user exists in DB by hitting register (if fail, it's ok - we then hit login)
      await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummyUser)
      });

      // Login using these dummy social credentials
      const success = await login(dummyUser.email, dummyUser.password);
      if (success) {
        showToast(`Logged in successfully via ${provider}!`, 'success');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Social login error:', err);
      showToast('Social login failed.', 'error');
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  // Update Profile Function
  const updateProfile = async (name, photoUrl) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, photoUrl })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        showToast('Profile updated successfully!', 'success');
        return true;
      } else {
        showToast(data.message || 'Failed to update profile.', 'error');
        return false;
      }
    } catch (err) {
      console.error(err);
      showToast('Server error during profile update.', 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      theme,
      toasts,
      toggleTheme,
      showToast,
      removeToast,
      register,
      login,
      socialLogin,
      logout,
      updateProfile,
      API_URL
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
