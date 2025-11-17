import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import PatientDetail from './PatientDetail';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/event_detail" element={<PatientDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
