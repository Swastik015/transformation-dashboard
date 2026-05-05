import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';
import ValueDrivers from './pages/ValueDrivers';
import ProjectPhase from './pages/ProjectPhase';
import Domain from './pages/Domain';
import ScoringMatrix from './pages/ScoringMatrix';
import PLView from './pages/PLView';

function App() {
  const [activeTab, setActiveTab] = useState('value-drivers');

  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4" style={{ backgroundColor: '#FAF8F5' }}>
            <Routes>
              <Route path="/" element={<ValueDrivers />} />
              <Route path="/value-drivers" element={<ValueDrivers />} />
              <Route path="/project-phase" element={<ProjectPhase />} />
              <Route path="/domain" element={<Domain />} />
              <Route path="/scoring-matrix" element={<ScoringMatrix />} />
              <Route path="/pl-view" element={<PLView />} />
            </Routes>
          </main>
        </div>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;
