import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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
import './App.css'

function App() {
  const currentUser = {
    id: 1,
    username: 'johndoe',
    email: 'JXKpG@example.com',
  };

  return (
    <Router>
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
          <Route path="/create-artist-profile" element={<CreateArtistProfile />} />
          <Route path="/create-creator-profile" element={<CreateCreatorProfile />} />
          <Route path="/create-portfolio" element={<CreatePortfolio userId={currentUser.id} />} />
          <Route path="/create-project" element={<CreateProject userId={currentUser.id} />} />
          <Route path="/user/:id" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;