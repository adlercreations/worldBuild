 // App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PortfolioList from './components/PortfolioList';
import PortfolioDetail from './components/PortfolioDetail';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import ExplorePage from './components/ExplorePage';
import CreateArtistProfile from './components/CreateArtistProfile';
import CreateCreatorProfile from './components/CreateCreatorProfile';
import CreateProject from './components/CreateProjects';
import CreatePortfolio from './components/CreatePortfolio';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider and hook
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { currentUser, setCurrentUser } = useAuth();

  // Check for existing session on initial load
  useEffect(() => {
    console.log('Checking session status...');
    fetch('/auth/check-session', { credentials: 'include' })
      .then((res) => {
        console.log('Session check response:', res);
        if (res.status === 401) {
          console.error('No user session found');
          setCurrentUser(null);
          return null;
        }
        return res.json();
      })
      .then((user) => {
        if (user) {
          console.log('Session user:', user);
          setCurrentUser(user);
        }
      })
      .catch((err) => {
        console.error('Error fetching session:', err);
        setCurrentUser(null);
      });
  }, [setCurrentUser]);

  console.log('Current user state:', currentUser);

  return (
    <div className="App">
      <h1>WorldBuild</h1>
      <h2>Give your world some character.</h2>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/portfolios" element={<PortfolioList />} />
        <Route path="/portfolios/:id" element={<PortfolioDetail />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/create-artist-profile"
          element={
            <ProtectedRoute>
              <CreateArtistProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-creator-profile"
          element={
            <ProtectedRoute>
              <CreateCreatorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-portfolio"
          element={
            <ProtectedRoute>
              <CreatePortfolio userId={currentUser?.id} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProject userId={currentUser?.id} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;



// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import HomePage from './components/HomePage';
// import PortfolioList from './components/PortfolioList';
// import PortfolioDetail from './components/PortfolioDetail';
// import ProjectList from './components/ProjectList';
// import ProjectDetail from './components/ProjectDetail';
// import ExplorePage from './components/ExplorePage';
// import CreateArtistProfile from './components/CreateArtistProfile';
// import CreateCreatorProfile from './components/CreateCreatorProfile';
// import CreateProject from './components/CreateProjects';
// import CreatePortfolio from './components/CreatePortfolio';
// import UserProfile from './components/UserProfile';
// import Login from './components/Login';
// import AuthContext from './components/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import './App.css';

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);

//   // Check for existing session on initial load
//   useEffect(() => {
//     console.log('Checking session status...');
//     // fetch('http://localhost:5555/auth/check-session', { credentials: 'include' })
//     fetch('/auth/check-session', { credentials: 'include' })
//       .then((res) => {
//         console.log('Session check response:', res);
//         if (res.status === 401) {
//           console.error('No user session found');
//           setCurrentUser(null);
//           return null;
//         }
//         return res.json();
//       })
//       .then((user) => {
//         if (user) {
//           console.log('Session user:', user);
//           setCurrentUser(user);
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching session:', err);
//         setCurrentUser(null);
//       });
//   }, []);

//   console.log('Current user state:', currentUser);

//   return (
//     <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
//       <Router>
//         <div className="App">
//           <h1>WorldBuild</h1>
//           <h2>Give your world some character.</h2>
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/portfolios" element={<PortfolioList />} />
//             <Route path="/portfolios/:id" element={<PortfolioDetail />} />
//             <Route path="/projects" element={<ProjectList />} />
//             <Route path="/projects/:id" element={<ProjectDetail />} />
//             <Route path="/explore" element={<ExplorePage />} />
//             <Route path="/login" element={<Login />} />

//             {/* Protected routes */}
//             <Route
//               path="/create-artist-profile"
//               element={
//                 <ProtectedRoute>
//                   <CreateArtistProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/create-creator-profile"
//               element={
//                 <ProtectedRoute>
//                   <CreateCreatorProfile />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/create-portfolio"
//               element={
//                 <ProtectedRoute>
//                   <CreatePortfolio userId={currentUser?.id} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/create-project"
//               element={
//                 <ProtectedRoute>
//                   <CreateProject userId={currentUser?.id} />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/:id"
//               element={
//                 <ProtectedRoute>
//                   <UserProfile />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </div>
//       </Router>
//     </AuthContext.Provider>
//   );
// }

// export default App;
