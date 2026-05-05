import React, { useState } from 'react';

const Domain = () => {
  const [selectedDomain, setSelectedDomain] = useState('Finance');
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'detail'

  const domains = [
    { name: 'NEO', projects: 6, value: '$1K', x: 15, y: 25, size: 80, isBurgundy: false },
    { name: 'LUXE', projects: 25, value: '$345', x: 35, y: 15, size: 100, isBurgundy: false },
    { name: 'FINANCE', projects: 25, value: '$345', x: 55, y: 20, size: 100, isBurgundy: true },
    { name: 'OPERATIONS', projects: 12, value: '$0', x: 75, y: 25, size: 90, isBurgundy: false },
    { name: 'SALONCENTRIC', projects: 25, value: '$345', x: 85, y: 45, size: 110, isBurgundy: false },
    { name: 'CDMO', projects: 25, value: '$345', x: 25, y: 50, size: 100, isBurgundy: true },
    { name: 'PPD', projects: 25, value: '$345', x: 50, y: 55, size: 110, isBurgundy: true },
    { name: 'REAL ESTATE', projects: 25, value: '$345', x: 72, y: 50, size: 90, isBurgundy: false },
    { name: 'CPD', projects: 25, value: '$345', x: 88, y: 65, size: 90, isBurgundy: false },
    { name: 'RESEARCH &\nINNOVATION', projects: 25, value: '$345', x: 18, y: 72, size: 100, isBurgundy: false },
    { name: 'LDB', projects: 25, value: '$345', x: 45, y: 78, size: 110, isBurgundy: false },
    { name: 'HUMAN\nRESOURCES', projects: 25, value: '$345', x: 68, y: 75, size: 90, isBurgundy: false },
    { name: 'DATA', projects: 25, value: '$345', x: 82, y: 82, size: 90, isBurgundy: false },
    { name: 'IT/TECH', projects: 25, value: '$345', x: 30, y: 88, size: 90, isBurgundy: true },
  ];

  const detailData = [
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '9%' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '15%' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '6%' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '8%' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '4%' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', buildPlanned: '$200K', buildLE: '$200K', drift: '12%' },
  ];

  if (viewMode === 'detail') {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Active Portfolio Summary <span style={{ color: '#5E0A1F' }}>By Domain</span>
        </h1>

        <div className="flex justify-end gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Domain</span>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
              <option>All</option>
            </select>
          </div>
          <button className="px-4 py-1.5 text-sm rounded-lg text-white" style={{ backgroundColor: '#5E0A1F' }}>Deep-dive</button>
          <button className="px-4 py-1.5 text-sm rounded-lg border border-gray-300 bg-white" onClick={() => setViewMode('chart')}>Timeline</button>
        </div>

        <div className="flex gap-6">
          {/* Left Panel */}
          <div className="dashboard-card p-6 w-[280px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-6">
              <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50" onClick={() => setViewMode('chart')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-base font-semibold" style={{ color: '#5E0A1F' }}>{selectedDomain}</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600"># Projects</span>
                <span className="text-lg font-semibold text-gray-900">20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value - Planned</span>
                <span className="text-lg font-semibold text-green-positive">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Value - LE</span>
                <span className="text-lg font-semibold text-gray-900">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Of Build - Planned</span>
                <span className="text-lg font-semibold text-gray-900">$2K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cost Of Build - LE</span>
                <span className="text-lg font-semibold text-gray-900">$1K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Run Cost - LE</span>
                <span className="text-lg font-semibold text-gray-900">$1K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Project At Risk</span>
                <span className="text-lg font-semibold text-red-negative">02</span>
              </div>
            </div>
          </div>

          {/* Right Table */}
          <div className="dashboard-card p-0 flex-1 overflow-hidden">
            <div className="flex gap-6 px-5 pt-4 pb-2">
              <div className="text-center">
                <div className="text-xs font-medium text-green-positive">LOW DEVIATION</div>
                <div className="text-lg font-bold text-green-positive">10</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-orange-risk">AT RISK</div>
                <div className="text-lg font-bold text-orange-risk">8</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-red-negative">AT RISK</div>
                <div className="text-lg font-bold text-red-negative">02</div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0ede8' }}>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Project Name</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Total Value - Planned <span className="text-gray-400">↕</span></th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Total Value - LE <span className="text-gray-400">↕</span></th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Cost Of Build - Planned <span className="text-gray-400">↕</span></th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Cost Of Build - LE <span className="text-gray-400">↕</span></th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-700">Drift <span className="text-gray-400">↕</span></th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f9f7f4' }} className="hover:bg-gray-50/50">
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#5E0A1F' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-sm text-gray-700">{row.planned}</td>
                      <td className="py-3 px-5 text-sm text-gray-700">{row.le}</td>
                      <td className="py-3 px-5 text-sm text-gray-700">{row.buildPlanned}</td>
                      <td className="py-3 px-5 text-sm text-gray-700">{row.buildLE}</td>
                      <td className="py-3 px-5 text-sm text-green-positive">{row.drift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">
        Active Portfolio Summary <span style={{ color: '#5E0A1F' }}>By Domain</span>
      </h1>

      {/* Bubble Chart */}
      <div className="dashboard-card p-8 relative" style={{ minHeight: '600px' }}>
        {domains.map((domain) => (
          <div
            key={domain.name}
            className="absolute cursor-pointer hover:scale-105 transition-transform flex flex-col items-center justify-center rounded-full text-center text-white"
            style={{
              left: `${domain.x}%`,
              top: `${domain.y}%`,
              transform: 'translate(-50%, -50%)',
              width: domain.size,
              height: domain.size,
              backgroundColor: domain.isBurgundy ? '#5E0A1F' : '#C4A35A',
              fontSize: domain.size > 100 ? '11px' : '9px',
              zIndex: 2,
              padding: '8px',
              lineHeight: '1.2',
            }}
            onClick={() => { setSelectedDomain(domain.name.replace('\n', ' ')); setViewMode('detail'); }}
          >
            <div className="font-bold whitespace-pre-line">{domain.name}</div>
            <div className="text-[10px] mt-1 opacity-90"># Projects {domain.projects}</div>
            <div className="text-[10px] opacity-90">Total Portfolio Value</div>
            <div className="text-[10px] font-semibold">{domain.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Domain;
