// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../components/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child component
  return children;
}

export default ProtectedRoute;



// // ProtectedRoute.jsx
// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';

// function ProtectedRoute({ children }) {
//     const [isAuthenticated, setIsAuthenticated] = useState(null);

//     useEffect(() => {
//         // Check if user is authenticated
//         fetch('/api/protected', { method: 'GET' })
//             .then((response) => {
//                 if (response.ok) {
//                     setIsAuthenticated(true);
//                 } else {
//                     setIsAuthenticated(false);
//                 }
//             })
//             .catch(() => setIsAuthenticated(false));
//     }, []);

//     if (isAuthenticated === null) {
//         return <p>Loading...</p>; // Show loading state while authentication is checked
//     }

//     return isAuthenticated ? children : <Navigate to="/login" />;
// }

// export default ProtectedRoute;