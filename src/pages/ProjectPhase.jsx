import React, { useState } from 'react';

const ProjectPhase = () => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' or 'detail'

  const phases = [
    { name: 'Ideate', projects: 4, x: 15, y: 60 },
    { name: 'Prepare', projects: 12, x: 35, y: 25 },
    { name: 'Deliver', projects: 13, x: 65, y: 60 },
    { name: 'Hypercare', projects: 11, x: 85, y: 25 },
  ];

  const phaseData = {
    'Ideate': { projects: 4, totalValue: '$140M', grossMargin: '$30M', costReduction: '$118M', totalInvestment: '$184M', risk: 8 },
    'Prepare': { projects: 12, totalValue: '$140M', grossMargin: '$30M', costReduction: '$118M', totalInvestment: '$184M', risk: 8 },
    'Deliver': { projects: 13, totalValue: '$140M', grossMargin: '$30M', costReduction: '$118M', totalInvestment: '$184M', risk: 8 },
    'Hypercare': { projects: 11, totalValue: '$140M', grossMargin: '$30M', costReduction: '$118M', totalInvestment: '$184M', risk: 8 },
  };

  const tableData = [
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K' },
  ];

  const current = phaseData[selectedPhase];

  // Overview view
  if (viewMode === 'overview') {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Active Portfolio Summary <span style={{ color: '#5E0A1F' }}>By Project Phase</span>
        </h1>
        
        {/* Flow Diagram */}
        <div className="dashboard-card p-8 relative" style={{ minHeight: '400px' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* Curved dotted connection lines matching screenshot */}
            <path d="M 180 240 Q 280 120 440 100" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeDasharray="8 4" />
            <path d="M 440 100 Q 520 180 680 240" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeDasharray="8 4" />
            <path d="M 680 240 Q 780 150 880 80" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeDasharray="8 4" />
            
            {/* Connection dots */}
            <circle cx="180" cy="240" r="8" fill="#5E0A1F" />
            <circle cx="440" cy="100" r="8" fill="#5E0A1F" />
            <circle cx="680" cy="240" r="8" fill="#5E0A1F" />
            <circle cx="880" cy="80" r="8" fill="#5E0A1F" />
          </svg>

          {phases.map((phase) => {
            const data = phaseData[phase.name];
            return (
              <div
                key={phase.name}
                className="absolute cursor-pointer hover:scale-105 transition-transform"
                style={{ left: `${phase.x}%`, top: `${phase.y}%`, transform: 'translate(-50%, -50%)', zIndex: 2 }}
                onClick={() => { setSelectedPhase(phase.name); setViewMode('detail'); }}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-[200px] relative hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="px-5 py-3" style={{ backgroundColor: '#F5EDE8' }}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold" style={{ color: '#5E0A1F' }}>{phase.name}</h3>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-5">
                  <div className="text-3xl font-bold text-gray-900">{data.projects}</div>
                  <div className="text-xs text-gray-500 mb-3"># Projects</div>
                  
                  {/* Additional metrics from screenshot */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Portfolio Value</span>
                      <span className="font-semibold text-green-positive">{data.totalValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Margin</span>
                      <span className="font-semibold text-gray-700">{data.grossMargin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost Reduction</span>
                      <span className="font-semibold text-gray-700">{data.costReduction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Investment</span>
                      <span className="font-semibold text-gray-700">{data.totalInvestment}</span>
                    </div>
                  </div>
                  
                  {/* Risk number at bottom right */}
                  <div className="absolute bottom-2 right-3 text-lg font-bold" style={{ color: '#5E0A1F' }}>
                    {data.risk}
                  </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Detail view
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold text-gray-900">
        Active Portfolio Summary <span style={{ color: '#5E0A1F' }}>By Project Phase</span>
      </h1>
      
      <div className="flex gap-4">
        {/* Left Panel */}
        <div className="dashboard-card p-4 w-[280px] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50"
              onClick={() => setViewMode('overview')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base font-semibold" style={{ color: '#5E0A1F' }}>{selectedPhase}</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Projects</span>
              <span className="text-lg font-semibold text-gray-900">{current.projects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Value - Planned</span>
              <span className="text-lg font-semibold text-green-positive">{current.totalValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Value - LE</span>
              <span className="text-lg font-semibold text-gray-900">{current.grossMargin}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost Of Build - Planned</span>
              <span className="text-lg font-semibold text-gray-900">{current.costReduction}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cost Of Build - LE</span>
              <span className="text-lg font-semibold text-gray-900">{current.totalInvestment}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Run Cost - LE</span>
              <span className="text-lg font-semibold text-gray-900">{current.totalInvestment}</span>
            </div>
          </div>
        </div>

        {/* Right Table */}
        <div className="dashboard-card p-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Project Name</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Total Value - Planned <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Total Value - LE <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Cost Of Build - Planned <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Cost Of Build - LE <span className="text-gray-400">↕</span></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#5E0A1F' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">{row.planned}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{row.le}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{row.buildPlanned}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{row.buildLE}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

};

export default ProjectPhase;
