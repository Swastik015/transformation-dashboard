import React, { useState } from 'react';

const PLView = () => {
  const [activeSubTab, setActiveSubTab] = useState('project-pl');

  const [filters, setFilters] = useState({
    projectName: 'All',
    projectYear: 'All',
    impactedPL: 'Planned',
    planCPPLE: 'Planned',
    domain: 'All',
    includeOTC: false
  });

  const subTabs = [
    { id: 'project-scorecard', label: 'Project Scorecard' },
    { id: 'portfolio-tracker', label: 'Portfolio Tracker' },
    { id: 'project-pl', label: 'Project P&L' },
  ];

  const getTitle = () => {
    switch(activeSubTab) {
      case 'project-scorecard': return 'P&L Project Scorecard';
      case 'portfolio-tracker': return 'P&L Portfolio Tracker';
      case 'project-pl': return 'P&L Deep-Dive';
      default: return 'P&L View';
    }
  };

  // Sparkline SVG component
  const Sparkline = ({ color }) => (
    <svg viewBox="0 0 100 30" className="w-full h-10">
      <path
        d="M0 25 Q10 20 20 22 T40 18 T60 20 T80 12 T100 15"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M0 25 Q10 20 20 22 T40 18 T60 20 T80 12 T100 15 L100 30 L0 30 Z"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  );

  const summaryCards = [
    { title: 'Gross Value', value: '$1217.4M', change: '+6.3% YoY', color: '#C4A35A' },
    { title: 'Total Cost', value: '$674.8M', change: '+6.3% YoY', color: '#5E0A1F' },
    { title: 'Net Value', value: '$542.6M', change: '+6.3% YoY', color: '#2E7D32' },
  ];

  const years = ['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', 'Total'];

  const plRows = [
    { metric: 'Net Sales', indent: false, values: ['$0', '$0', '$0', '$0', '$1.4', '$23.8', '$71.9', '$81.4', '$178.5'] },
    { metric: 'Gross Value', indent: false, values: ['$0', '$0', '$19', '$25.6', '$81.8', '$145.6', '$192.5', '$202.8', '$660.2'] },
    { metric: 'Additional Gross Margin', indent: true, values: ['$0', '$0', '$0', '$0', '$0.9', '$14.3', '$43.1', '$52.1', '$110.4'] },
    { metric: 'Cost Reduction', indent: true, values: ['$0', '$0', '$19', '$25.6', '$80.9', '$131.3', '$149.4', '$150.7', '$539.8'] },
    { metric: 'o/w Gross Margin (Build)', indent: true, values: ['$0', '$0', '$0', '$5.3', '$27.4', '$45.3', '$53.5', '$53.9', '$185.4'] },
    { metric: 'o/w A&P', indent: true, values: ['$0', '$0', '$0', '-$2.3', '-$5.2', '$2.8', '$9.6', '$10.4', '$15.3'] },
    { metric: 'o/w SG&A', indent: true, values: ['$0', '$0', '$19', '$22.6', '$58.7', '$82.6', '$85.7', '$85.8', '$337.3'] },
    { metric: 'o/w Tech Savings', indent: true, values: ['$0', '$0', '$0', '$0', '$0', '$0.7', '$0.6', '$0.6', '$1.9'] },
    { metric: 'Total Costs', indent: false, values: ['-$0.2', '-$7.8', '-$43.7', '-$124.3', '-$105', '-$84.2', '-$56.7', '-$37.1', '-$537.3'] },
    { metric: 'Tech', indent: true, values: ['-$0.2', '-$7.8', '-$33.6', '-$21.6', '-$28.2', '-$39.6', '-$39.1', '-$17.3', '-$173.7'] },
    { metric: 'o/w Depreciation (Tech)', indent: true, values: ['$0', '$0', '-$3.2', '-$2.8', '-$3.1', '-$9.4', '-$25.5', '-$25.5', '-$60.4'] },
    { metric: 'o/w OPEX (Tech)', indent: true, values: ['$0', '$0', '-$3.2', '-$2.0', '-$3.1', '-$19.4', '-$4.6', '$0', '-$28.1'] },
    { metric: 'o/w Tech Run', indent: true, values: ['$0', '$0', '-$0.4', '-$1.6', '-$5.3', '-$4.8', '-$11.2', '-$10.7', '-$34.1'] },
    { metric: 'Business', indent: true, values: ['$0', '$0', '-$10.1', '-$102.7', '-$76.8', '-$44.6', '-$17.6', '-$19.8', '-$198.7'] },
    { metric: 'o/w Depreciation (Business)', indent: true, values: ['$0', '$0', '-$3.2', '-$2.8', '-$3.1', '-$9.4', '-$25.5', '-$25.5', '-$60.4'] },
    { metric: 'o/w OPEX (Business)', indent: true, values: ['$0', '$0', '-$2.1', '-$6.3', '-$15.7', '-$25.3', '-$14.2', '$0', '-$63.7'] },
    { metric: 'o/w OTC/ENR', indent: true, values: ['$0', '$0', '-$3.5', '-$49.4', '-$53.2', '-$14.7', '-$0.3', '$0', '-$123.4'] },
    { metric: 'o/w Business Run', indent: true, values: ['$0', '$0', '-$1.3', '-$44.2', '-$4.7', '-$3.2', '$22.4', '$5.7', '-$25.1'] },
    { metric: 'Run Costs', indent: false, values: ['$0', '$0', '-$0.4', '-$1.6', '-$5.3', '-$4.8', '-$11.2', '-$10.7', '-$34.1'] },
    { metric: 'Run Cost (Tech)', indent: true, values: ['$0', '$0', '-$0.4', '-$1.6', '-$5.3', '-$4.8', '-$11.2', '-$10.7', '-$34.1'] },
    { metric: 'Run Cost (Business)', indent: true, values: ['$0', '$0', '$0', '$0', '$0', '-$0.3', '-$0.6', '-$0.6', '-$1.5'] },
    { metric: 'Net Value - P&L', indent: false, values: ['-$0.2', '-$7.8', '-$24.7', '-$98.7', '$23.7', '$61.4', '$135.8', '$163.6', '$253.7'] },
    { metric: 'CAPEX Elimination', indent: true, values: ['$0.2', '$7.8', '$31.9', '$47.1', '$37.9', '$45.8', '$8.4', '$0', '$215.1'] },
    { metric: 'incl. estimated CAPEX Depreci...', indent: true, values: ['$0', '$0', '$0', '$0', '-$10.1', '-$10.4', '-$26.4', '-$26.4', '-$63.1'] },
    { metric: 'Net Value P & L Impact', indent: false, values: ['$0', '$0', '-$9.8', '-$55.6', '$22.7', '$96.1', '$126.8', '$136.8', '$277.8'] },
    { metric: 'o/w Tech', indent: true, values: ['$0', '$0', '-$3.6', '-$21.6', '-$38.2', '-$38.9', '-$38.6', '-$34', '-$171.8'] },
    { metric: 'o/w Business', indent: true, values: ['$0', '$0', '-$0.4', '-$19.4', '-$64.7', '-$41.9', '-$174.7', '-$199.7', '-$573'] },
    { metric: 'o/w OTC', indent: true, values: ['$0', '$0', '-$5.8', '-$14.4', '-$53.2', '-$14.7', '-$0.3', '$0', '-$123.4'] },
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
                {key === 'includeOTC' ? (
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-600">Include OTC</label>
                    <button
                      onClick={() => setFilters({...filters, [key]: !value})}
                      className="relative w-9 h-5 rounded-full transition-colors"
                      style={{ backgroundColor: value ? '#5E0A1F' : '#ccc' }}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {key === 'projectName' ? 'Project Name' : key === 'projectYear' ? 'Project Year' : key === 'impactedPL' ? 'Impacted P&L' : key === 'planCPPLE' ? 'Plan CPP / LE' : key === 'domain' ? 'Domain' : key}
                    </label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => setFilters({...filters, [key]: e.target.value})}
                        className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm appearance-none"
                      >
                        <option>All</option>
                        {key === 'impactedPL' || key === 'planCPPLE' ? <option>Planned</option> : null}
                      </select>
                      <svg className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Title + Actions */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: '#5E0A1F' }}>{getTitle()}</h1>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
            </button>
            <button className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
            </button>
          </div>
        </div>

        {/* Sub Tabs */}
        <div className="flex gap-1">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSubTab === tab.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeSubTab === tab.id ? { backgroundColor: '#5E0A1F' } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {summaryCards.map((card, index) => (
            <div key={index} className="dashboard-card p-5">
              <div className="flex items-center gap-1 mb-2">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9E9E9E" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-xs text-green-positive mb-3">{card.change}</div>
              <Sparkline color={card.color} />
            </div>
          ))}
        </div>

        {/* P&L Table */}
        <div className="dashboard-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: '#f5ede8' }}>
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Metrics</th>
                  {years.map((year) => (
                    <th key={year} className="text-right py-2 px-3 font-semibold text-gray-700">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plRows.map((row, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f9f7f4' }} className={row.indent ? '' : 'bg-gray-50/50'}>
                    <td className={`py-2 px-4 font-medium text-gray-700 ${row.indent ? 'pl-8 text-gray-500' : ''} flex items-center gap-1`}>
                      {!row.indent && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="3">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      )}
                      {row.indent && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      )}
                      {row.metric}
                    </td>
                    {row.values.map((value, i) => (
                      <td key={i} className={`text-right py-2 px-3 ${value.startsWith('-') ? 'text-red-negative' : 'text-gray-700'}`}>
                        {value}
                      </td>
                    ))}
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

export default PLView;
