// src/components/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext();

// Provide AuthContext
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use AuthContext
export const useAuth = () => useContext(AuthContext);

export default AuthContext;



// import React, { createContext } from 'react';

// const AuthContext = createContext({
//   currentUser: null,
//   setCurrentUser: () => {}
// });

// export default AuthContext;