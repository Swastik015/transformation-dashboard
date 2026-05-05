import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

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
      <div className="flex items-center gap-4">
        {/* Toggle Switch */}
        <button className="relative w-12 h-6 rounded-full flex items-center transition-colors" style={{ backgroundColor: '#5E0A1F' }}>
          <span className="absolute left-1 w-4 h-4 rounded-full bg-white shadow-sm" />
        </button>

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
