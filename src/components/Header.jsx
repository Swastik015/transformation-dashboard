import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateExecutivePPT } from '../utils/pptGenerator';

const Header = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);

  const tabs = [
    { id: 'value-drivers', label: 'Value Drivers', path: '/value-drivers' },
    { id: 'project-phase', label: 'Project Phase', path: '/project-phase' },
    { id: 'domain', label: 'Domain', path: '/domain' },
    { id: 'scoring-matrix', label: 'Scoring Matrix', path: '/scoring-matrix' },
    { id: 'pl-view', label: 'P&L View', path: '/pl-view' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleGeneratePPT = async () => {
    setIsGeneratingPPT(true);
    try {
      await generateExecutivePPT();
    } catch (error) {
      console.error("Failed to generate PPT", error);
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  return (
    <header className="bg-white px-6 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f0ede8' }}>
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div>
          <div className="text-xs font-bold tracking-tight" style={{ color: '#5E0A1F' }}>L'ORÉAL</div>
          <div className="text-[8px] tracking-widest uppercase" style={{ color: '#9E9E9E' }}>Transformation Office North America</div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={activeTab === tab.id ? 'nav-tab-active' : 'nav-tab-inactive'}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Export MBR Deck Button */}
        <button 
          onClick={handleGeneratePPT}
          disabled={isGeneratingPPT}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
          style={{ 
            background: isGeneratingPPT ? '#E8E4DF' : 'linear-gradient(135deg, #C4A35A 0%, #D4B896 100%)',
            color: isGeneratingPPT ? '#999' : '#3D1A00',
            boxShadow: isGeneratingPPT ? 'none' : '0 2px 8px rgba(196, 163, 90, 0.3)'
          }}
        >
          {isGeneratingPPT ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              Export PPT
            </>
          )}
        </button>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">John Doe</span>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200">
            <img src="https://ui-avatars.com/api/?name=John+Doe&background=5E0A1F&color=fff" alt="John Doe" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
