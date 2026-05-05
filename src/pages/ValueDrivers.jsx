import React from 'react';

const ValueDrivers = () => {
  const projectData = [
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
    { name: 'Beauty Pulse', planned: '$500K', le: '$300K', grossMargin: '$200K', costReduction: '$200K' },
  ];

  const metrics = [
    { label: 'Total Value - Planned', value: '$200M', isGreen: true },
    { label: 'Total Value - LE', value: '$0', isGreen: false },
    { label: 'Gross Margin', value: '$2K', isGreen: false },
    { label: 'Cost Reduction', value: '$1K', isGreen: false },
    { label: 'Run Cost - LE', value: '$1K', isGreen: false },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold" style={{ color: '#5E0A1F' }}>Value Drivers</h1>
      
      <div className="flex gap-4">
        {/* Left Panel - Total Portfolio Value */}
        <div className="dashboard-card p-4 w-[280px] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <button className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-base font-semibold" style={{ color: '#5E0A1F' }}>Total Portfolio Value</h2>
          </div>
          
          <div className="space-y-3">
            {metrics.map((metric, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <span className={`text-lg font-semibold ${metric.isGreen ? 'text-green-positive' : 'text-gray-900'}`}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Projects Table */}
        <div className="dashboard-card p-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Project Name</th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Total Value - Planned <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Total Value - LE <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Gross Margin <span className="text-gray-400">↕</span></th>
                  <th className="text-left py-2 px-4 text-xs font-semibold text-gray-700">Cost Reduction <span className="text-gray-400">↕</span></th>
                </tr>
              </thead>
              <tbody>
                {projectData.map((project, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#5E0A1F' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-900">{project.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">{project.planned}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{project.le}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{project.grossMargin}</td>
                    <td className="py-2 px-4 text-sm text-gray-700">{project.costReduction}</td>
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

export default ValueDrivers;
