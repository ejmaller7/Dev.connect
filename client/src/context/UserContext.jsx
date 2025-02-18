import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check if user data exists in localStorage on initial load
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login function
  const login = async (email, password) => {
    try {
      // Here you would typically make an API call to your backend
      // This is a mock implementation
      if (!email || !password) {
        return { success: false, message: 'Please provide both email and password' };
      }

      // Simulate API call
      const mockUser = {
        id: '123',
        username: email.split('@')[0],
        email,
        // Don't store password in state
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during login' 
      };
    }
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      // Here you would typically make an API call to your backend
      // This is a mock implementation
      if (!username || !email || !password) {
        return { 
          success: false, 
          message: 'Please provide all required fields' 
        };
      }

      // Simulate API call
      const mockUser = {
        id: Date.now().toString(),
        username,
        email,
        // Don't store password in state
      };

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred during registration' 
      };
    }
  };

  // Logout function
  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user profile function
  const updateProfile = async (userData) => {
    try {
      // Here you would typically make an API call to your backend
      // This is a mock implementation
      const updatedUser = {
        ...user,
        ...userData,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        message: error.message || 'An error occurred while updating profile' 
      };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Provide the context value
  const value = {
    user,
    login,
    register,
    logOut,
    updateProfile,
    isAuthenticated,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;