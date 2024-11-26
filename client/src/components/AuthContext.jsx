// src/components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication..."); // Debug log
        const response = await fetch('/auth/check-session', {
          credentials: 'include'
        });
        console.log("Auth response:", response); // Debug log
        if (response.ok) {
          const user = await response.json();
          console.log("User data:", user); // Debug log
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;



// import React, { createContext } from 'react';

// const AuthContext = createContext({
//   currentUser: null,
//   setCurrentUser: () => {}
// });

// export default AuthContext;