import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginOfficer, fetchDemoOfficers } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('civicpulse_officer');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [demoOfficers, setDemoOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pre-fetch demo officers list
    fetchDemoOfficers()
      .then(res => {
        if (res.success && res.data) setDemoOfficers(res.data);
      })
      .catch(err => console.log('Could not load demo officers:', err));
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginOfficer(credentials);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        localStorage.setItem('civicpulse_officer', JSON.stringify(res.user));
        localStorage.setItem('civicpulse_token', res.token);
        return res.user;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (officer) => {
    return await login({
      email: officer.email,
      password: 'demo',
      role: officer.role
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('civicpulse_officer');
    localStorage.removeItem('civicpulse_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        demoOfficers,
        loading,
        error,
        login,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
