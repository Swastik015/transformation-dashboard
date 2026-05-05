import React, { useState } from 'react';

const ScoringMatrix = () => {
  const [filters, setFilters] = useState({
    region: 'All',
    status: 'All',
    projects: 'All',
    domain: 'All'
  });

  const [activeFilter, setActiveFilter] = useState('Neo');

  const projects = [
    { rank: 1, name: 'SC DC Anaplan', domain: 'PPD / SC', impact: 1.37, effort: 1.52, roe: '139%' },
    { rank: 2, name: 'Content Adoption Fac...', domain: 'CDMO', impact: 0.59, effort: 0.73, roe: '135%' },
    { rank: 3, name: 'LDB Aesthetics AA', domain: 'LDB', impact: 1.92, effort: 2.14, roe: '124%' },
    { rank: 4, name: 'Blackline AR', domain: 'NEO', impact: 0.24, effort: 0.38, roe: '113%' },
    { rank: 5, name: 'SC Customer Care Mod', domain: 'PPD / SC', impact: 1.55, effort: 1.65, roe: '110%' },
    { rank: 6, name: 'DDX CDP Modernization', domain: 'CDMO', impact: 0.68, effort: 0.89, roe: '108%' },
    { rank: 7, name: 'One Customer Care', domain: 'Operations', impact: 1.19, effort: 1.21, roe: '84%' },
    { rank: 8, name: 'Kerastase Portal Rep', domain: 'PPD / SC', impact: 0.91, effort: 0.95, roe: '83%' },
  ];

  const matrixData = [
    { x: 25, y: 85, name: 'SC DC Anaplan', neo: true },
    { x: 40, y: 75, name: 'Content Adoption', neo: false },
    { x: 55, y: 65, name: 'LDB Aesthetics', neo: true },
    { x: 15, y: 60, name: 'Blackline AR', neo: false },
    { x: 70, y: 55, name: 'SC Customer Care', neo: true },
    { x: 35, y: 45, name: 'DDX CDP', neo: false },
    { x: 85, y: 40, name: 'One Customer Care', neo: true },
    { x: 50, y: 30, name: 'Kerastase Portal', neo: false },
    { x: 20, y: 35, name: 'Project A', neo: false },
    { x: 65, y: 80, name: 'Project B', neo: true },
    { x: 80, y: 70, name: 'Project C', neo: false },
    { x: 30, y: 50, name: 'Project D', neo: true },
    { x: 45, y: 25, name: 'Project E', neo: false },
    { x: 75, y: 20, name: 'Project F', neo: true },
  ];

  return (
    <div className="flex gap-6">
      {/* Filters Sidebar */}
      <div className="w-52 flex-shrink-0">
        <div className="dashboard-card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="space-y-3">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
                <div className="relative">
                  <select
                    value={value}
                    onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm appearance-none"
                  >
                    <option>All</option>
                  </select>
                  <svg className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white flex items-center gap-2">
            Modify Projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
          <button className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white flex items-center gap-2">
            Modify Weights
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
          </button>
        </div>

        <div className="flex gap-6">
          {/* Scoring Matrix Chart */}
          <div className="dashboard-card p-6 flex-1">
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5E0A1F' }}></div>
                <span className="text-[10px] text-gray-500">Neo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                <span className="text-[10px] text-gray-500">Region</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <span className="text-[10px] text-gray-500">New/Existing</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex justify-center gap-2 mb-4">
              {['Neo Related Project', 'Non Neo Related Project'].map((label) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label.includes('Neo') ? 'Neo' : 'Non-Neo')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    (label.includes('Neo') && activeFilter === 'Neo') || (!label.includes('Neo') && activeFilter === 'Non-Neo')
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  style={{
                    backgroundColor: (label.includes('Neo') && activeFilter === 'Neo') ? '#5E0A1F' : (!label.includes('Neo') && activeFilter === 'Non-Neo') ? '#C4A35A' : undefined
                  }}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Matrix */}
            <div className="relative w-full" style={{ height: '380px' }}>
              {/* Quadrant backgrounds */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="bg-purple-100/40"></div>
                <div className="bg-green-100/30"></div>
                <div className="bg-pink-100/30"></div>
                <div className="bg-yellow-100/30"></div>
              </div>

              {/* Grid lines */}
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300" style={{ borderLeft: '1px dashed #ccc' }}></div>
              <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300" style={{ borderTop: '1px dashed #ccc' }}></div>

              {/* Axis labels */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600">HIGH IMPACT</div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-600">LOW IMPACT</div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-gray-600 origin-center">HIGH EFFORT</div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-bold text-gray-600 origin-center">LOW EFFORT</div>

              {/* Data points */}
              {matrixData.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-4 h-4 rounded-full border-2 cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    left: `${point.x}%`,
                    top: `${100 - point.y}%`,
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: point.neo ? '#5E0A1F' : '#E91E63',
                    borderColor: point.neo ? '#5E0A1F' : '#E91E63',
                  }}
                  title={point.name}
                />
              ))}
            </div>
          </div>

          {/* Ranking Table */}
          <div className="dashboard-card p-5 w-[420px] flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Project Ranking By Return On Effort (ROE)</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #f0ede8' }}>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">Rank</th>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">Project Name</th>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">Domain</th>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">Impact</th>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">Effort</th>
                    <th className="text-left py-2 px-2 text-[10px] font-semibold text-gray-500">ROE</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.rank} style={{ borderBottom: '1px solid #f9f7f4' }} className="hover:bg-gray-50/50">
                      <td className="py-2 px-2 text-xs text-gray-500">{project.rank}</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#5E0A1F' }}>
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                          </div>
                          <span className="text-xs text-gray-700 truncate max-w-[100px]">{project.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-xs text-gray-500">{project.domain}</td>
                      <td className="py-2 px-2 text-xs text-gray-700">{project.impact}</td>
                      <td className="py-2 px-2 text-xs text-gray-700">{project.effort}</td>
                      <td className="py-2 px-2 text-xs font-semibold text-green-positive">{project.roe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringMatrix;
