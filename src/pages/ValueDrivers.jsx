import React, { useState } from 'react';
import { projects } from '../data/projectData';

const fmt = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n}`;
};

const ValueDrivers = () => {
  const [isDrillDown, setIsDrillDown] = useState(false);

  const top10Value = [...projects].sort((a, b) => b.le_yearly_impact - a.le_yearly_impact).slice(0, 10);
  const top10Cost = [...projects].sort((a, b) => b.planned_total_costs - a.planned_total_costs).slice(0, 10);

  const maxValue = top10Value[0]?.le_yearly_impact || 1;
  const maxCost = top10Cost[0]?.planned_total_costs || 1;

  const totalValueAll = projects.reduce((s, p) => s + p.le_yearly_impact, 0);
  const totalValueTop = top10Value.reduce((s, p) => s + p.le_yearly_impact, 0);
  const totalCostAll = projects.reduce((s, p) => s + p.planned_total_costs, 0);
  const totalCostTop = top10Cost.reduce((s, p) => s + p.planned_total_costs, 0);

  const valuePct = ((totalValueTop / totalValueAll) * 100).toFixed(0);
  const costPct = ((totalCostTop / totalCostAll) * 100).toFixed(0);

  // Drill-down data
  const totalPlanned = projects.reduce((s, p) => s + p.le_yearly_impact, 0);
  const totalLE = projects.reduce((s, p) => s + p.le_total_costs, 0);
  const grossMargin = totalPlanned * 0.74;
  const costReduction = totalPlanned * 0.26;

  // Slider-style bar row
  const BarRow = ({ name, value, max, barColor }) => {
    const pct = (value / max) * 100;
    return (
      <div className="flex items-center gap-3 py-[5px]">
        <span className="text-[11px] text-gray-600 w-[120px] truncate text-right font-medium flex-shrink-0">
          {name}
        </span>
        <div className="flex-1 relative h-[6px] rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: `${Math.max(pct, 4)}%`, backgroundColor: barColor }}
          />
          <div
            className="absolute top-1/2 w-[14px] h-[14px] rounded-full border-[3px] border-white"
            style={{
              left: `${Math.max(pct, 4)}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: barColor,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
        </div>
        <span className="text-[11px] font-semibold text-gray-700 w-[50px] text-right flex-shrink-0">
          {fmt(value)}
        </span>
      </div>
    );
  };

  // ===== DRILL-DOWN VIEW =====
  if (isDrillDown) {
    const metrics = [
      { label: 'Total Value - Planned', value: fmt(totalPlanned), highlight: true },
      { label: 'Total Value - LE', value: fmt(totalLE) },
      { label: 'Gross Margin', value: fmt(grossMargin) },
      { label: 'Cost Reduction', value: fmt(costReduction) },
      { label: 'Run Cost - LE', value: fmt(totalLE * 0.15) },
    ];
    const rows = [...projects].sort((a, b) => b.le_yearly_impact - a.le_yearly_impact).slice(0, 8);

    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-bold" style={{ color: '#5E0A1F' }}>Value Drivers</h1>
        <div className="flex gap-4">
          <div className="dashboard-card p-4 w-[240px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <button onClick={() => setIsDrillDown(false)} className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-300 hover:bg-gray-50">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              </button>
              <h2 className="text-sm font-semibold" style={{ color: '#5E0A1F' }}>Total Portfolio Value</h2>
            </div>
            <div className="space-y-3">
              {metrics.map((m, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{m.label}</span>
                  <span className={`text-sm font-bold ${m.highlight ? 'text-green-600' : 'text-gray-900'}`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboard-card p-0 flex-1 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
                  <th className="text-left py-2 px-4 text-[11px] font-semibold text-gray-500">Project Name</th>
                  <th className="text-right py-2 px-4 text-[11px] font-semibold text-gray-500">Yearly Impact</th>
                  <th className="text-right py-2 px-4 text-[11px] font-semibold text-gray-500">Planned Cost</th>
                  <th className="text-right py-2 px-4 text-[11px] font-semibold text-gray-500">LE Cost</th>
                  <th className="text-right py-2 px-4 text-[11px] font-semibold text-gray-500">Cost Drift</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50" style={{ borderBottom: '1px solid #F9F7F4' }}>
                    <td className="py-2 px-4"><div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: '#5E0A1F' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                      </div>
                      <span className="text-xs text-gray-900">{p.project_name}</span>
                    </div></td>
                    <td className="py-2 px-4 text-xs text-gray-700 text-right">{fmt(p.le_yearly_impact)}</td>
                    <td className="py-2 px-4 text-xs text-gray-700 text-right">{fmt(p.planned_total_costs)}</td>
                    <td className="py-2 px-4 text-xs text-gray-700 text-right">{fmt(p.le_total_costs)}</td>
                    <td className="py-2 px-4 text-xs text-right">
                      <span className={p.cost_drift_pct > 0.2 ? 'text-red-600 font-semibold' : 'text-green-600'}>{(p.cost_drift_pct * 100).toFixed(0)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ===== DEFAULT VIEW — Two bar charts =====
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-bold" style={{ color: '#5E0A1F' }}>Value Drivers</h1>

      <div className="flex gap-4">
        {/* Left — Top 10 by Portfolio Value */}
        <div className="dashboard-card p-5 flex-1">
          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium">Top 10 projects that drives {valuePct}% of</p>
            <h2
              className="text-base font-bold cursor-pointer hover:underline"
              style={{ color: '#C4A35A' }}
              onDoubleClick={() => setIsDrillDown(true)}
              title="Double-click to see detailed breakdown"
            >
              Total Portfolio Value
            </h2>
          </div>
          {top10Value.map((p, i) => (
            <BarRow key={i} name={p.project_name} value={p.le_yearly_impact} max={maxValue} barColor="#5E0A1F" />
          ))}
        </div>

        {/* Right — Top 10 by Cost */}
        <div className="dashboard-card p-5 flex-1">
          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium">Top 10 projects drives {costPct}% of</p>
            <h2 className="text-base font-bold" style={{ color: '#C4A35A' }}>Cost</h2>
          </div>
          {top10Cost.map((p, i) => (
            <BarRow key={i} name={p.project_name} value={p.planned_total_costs} max={maxCost} barColor="#C4A35A" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValueDrivers;
