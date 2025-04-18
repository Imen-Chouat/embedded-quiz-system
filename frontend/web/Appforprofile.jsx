import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import PPG from './components/PPG';
import Chginfo from './components/Chginfo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="Background">
        <Sidebar />
        <div className="Background--content">
          <Routes>
            <Route path="/" element={<PPG />} />
            <Route path="/change-info" element={<Chginfo />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
