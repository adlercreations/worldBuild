import { useState, useEffect } from 'react'
// import { Switch, Route } from "react-router-dom";
import './App.css'

function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((response) => response.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <div>
      <h1>WorldBuild Client</h1>
      <ul>
        {projects.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
