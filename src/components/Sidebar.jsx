import React from 'react';

// Circular progress ring component
const CircularProgress = ({ percentage, color, size = 40, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold" style={{ color }}>{percentage}%</span>
      </div>
    </div>
  );
};

// Icon in circular badge
const IconBadge = ({ children }) => (
  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5EDE0' }}>
    {children}
  </div>
);

const Sidebar = () => {
  const budgetDriftData = [
    { label: 'On Track (<10%)', count: '10/40 Projects', percentage: 34, color: '#2E7D32' },
    { label: 'Potential Risk (10% - 29%)', count: '10/40 Projects', percentage: 50, color: '#EF6C00' },
    { label: 'At Risk (>30%)', count: '10/40 Projects', percentage: 33, color: '#C62828' },
  ];

  return (
    <aside className="w-[320px] p-5 space-y-4" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Projects Card */}
      <div className="sidebar-card">
        <div className="flex items-center gap-3 mb-3">
          <IconBadge>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </IconBadge>
          <span className="text-sm font-medium text-gray-600"># Projects</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-3">39</div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Active Portfolio</span>
            <span className="font-medium text-gray-700">28/39</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-gold" style={{ width: '72%' }}></div>
          </div>
        </div>
      </div>

      {/* Total Portfolio Value Card */}
      <div className="sidebar-card">
        <div className="flex items-center gap-3 mb-3">
          <IconBadge>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </IconBadge>
          <span className="text-sm font-medium text-gray-600">Total Portfolio Value</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-3">$590M</div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Gross Margin</span>
            <span className="font-medium text-gray-700">$131M</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Cost Reduction</span>
            <span className="font-medium text-gray-700">$459M</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-2">Through 2028</div>
        </div>
      </div>

      {/* Yearly Impact Card */}
      <div className="sidebar-card">
        <div className="flex items-center gap-3 mb-3">
          <IconBadge>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </IconBadge>
          <span className="text-sm font-medium text-gray-600">Yearly Impact</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-1">$177.1M</div>
        <div className="text-[10px] text-gray-400">In 2026</div>
      </div>

      {/* Total Investment Card */}
      <div className="sidebar-card">
        <div className="flex items-center gap-3 mb-3">
          <IconBadge>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </IconBadge>
          <span className="text-sm font-medium text-gray-600">Total Investment</span>
        </div>
        <div className="text-3xl font-bold text-gray-900">$729M</div>
      </div>

      {/* Budget Drift Card */}
      <div className="sidebar-card">
        <div className="flex items-center gap-3 mb-4">
          <IconBadge>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </IconBadge>
          <span className="text-sm font-medium text-gray-600">Budget Drift</span>
        </div>
        <div className="space-y-4">
          {budgetDriftData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <CircularProgress percentage={item.percentage} color={item.color} size={44} strokeWidth={3} />
              <div>
                <div className="text-xs font-medium" style={{ color: item.color }}>{item.label}</div>
                <div className="text-[10px] text-gray-500">{item.count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
