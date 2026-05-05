import { projects } from '../data/projectData';

// Format currency
const fmt = (n) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

// Business logic flags
const costRisk = (p) => p.cost_drift_pct > 0.2;
const timelineRisk = (p) => p.timeline_drift_days > 30;
const highImpact = (p) => p.impact_score > 1.5;
const lowEffort = (p) => p.effort_score < 1.0;

// --- Answer Generators ---

export function getTop3ByPlannedCost() {
  const top = [...projects].sort((a, b) => b.planned_total_costs - a.planned_total_costs).slice(0, 3);
  return {
    answer: `Top 3 Projects by Planned Cost\n\n1. ${top[0].project_name}\n   Planned: ${fmt(top[0].planned_total_costs)} | LE: ${fmt(top[0].le_total_costs)} | Drift: ${(top[0].cost_drift_pct*100).toFixed(0)}%\n\n2. ${top[1].project_name}\n   Planned: ${fmt(top[1].planned_total_costs)} | LE: ${fmt(top[1].le_total_costs)} | Drift: ${(top[1].cost_drift_pct*100).toFixed(0)}%\n\n3. ${top[2].project_name}\n   Planned: ${fmt(top[2].planned_total_costs)} | LE: ${fmt(top[2].le_total_costs)} | Drift: ${(top[2].cost_drift_pct*100).toFixed(0)}%`,
    data: top,
    detailData: top,
    chartType: 'bar',
    chartLabel: 'Top 3 by Planned Cost',
    insights: [
      `Finance ERP Consolidation leads at ${fmt(top[0].planned_total_costs)} — monitor closely.`,
      `Combined planned cost of top 3: ${fmt(top.reduce((s, p) => s + p.planned_total_costs, 0))}.`,
      `${top.filter(costRisk).length} of these are already at cost risk.`
    ],
    recommendation: 'Validate scope for high-cost projects to avoid further drift.'
  };
}

export function getTop3ByNetImpact() {
  const top = [...projects].sort((a, b) => b.le_yearly_impact - a.le_yearly_impact).slice(0, 3);
  return {
    answer: `Top 3 Projects by Net Impact (Yearly Value)\n\n1. ${top[0].project_name}\n   Impact: ${fmt(top[0].le_yearly_impact)}/yr | Cost: ${fmt(top[0].le_total_costs)} | ROI: ${(top[0].le_yearly_impact/top[0].le_total_costs).toFixed(1)}x\n\n2. ${top[1].project_name}\n   Impact: ${fmt(top[1].le_yearly_impact)}/yr | Cost: ${fmt(top[1].le_total_costs)} | ROI: ${(top[1].le_yearly_impact/top[1].le_total_costs).toFixed(1)}x\n\n3. ${top[2].project_name}\n   Impact: ${fmt(top[2].le_yearly_impact)}/yr | Cost: ${fmt(top[2].le_total_costs)} | ROI: ${(top[2].le_yearly_impact/top[2].le_total_costs).toFixed(1)}x`,
    data: top,
    detailData: top,
    chartType: 'bar',
    chartLabel: 'Top 3 by Net Impact',
    insights: [
      `Research Innovation Lab delivers highest value at ${fmt(top[0].le_yearly_impact)} yearly.`,
      `These 3 projects represent ${((top.reduce((s, p) => s + p.le_yearly_impact, 0) / projects.reduce((s, p) => s + p.le_yearly_impact, 0)) * 100).toFixed(0)}% of total portfolio value.`,
      `${top.filter(costRisk).length} top-value project(s) currently at cost risk.`
    ],
    recommendation: 'Protect high-value projects from scope creep and resource reallocation.'
  };
}

export function getCostRiskCount() {
  const atRisk = projects.filter(costRisk);
  return {
    answer: `${atRisk.length} of ${projects.length} projects are at cost risk (drift >20%).\n\nAt-risk projects:\n${atRisk.map((p, i) => `  ${i+1}. ${p.project_name} — ${fmt(p.planned_total_costs)} → ${fmt(p.le_total_costs)} (${(p.cost_drift_pct*100).toFixed(0)}% drift)`).join('\n')}`,
    data: atRisk,
    detailData: atRisk,
    chartType: 'donut',
    chartLabel: 'Cost Risk Distribution',
    insights: [
      `${((atRisk.length / projects.length) * 100).toFixed(0)}% of the portfolio is financially exposed.`,
      `Biggest drift: ${[...projects].sort((a, b) => b.cost_drift_pct - a.cost_drift_pct)[0].project_name} (${([...projects].sort((a, b) => b.cost_drift_pct - a.cost_drift_pct)[0].cost_drift_pct * 100).toFixed(0)}%).`,
      `Aggregate LE overrun: ${fmt(atRisk.reduce((s, p) => s + (p.le_total_costs - p.planned_total_costs), 0))}.`
    ],
    recommendation: 'Initiate formal cost review for projects with drift >30%.'
  };
}

export function getTimelineRiskCount() {
  const atRisk = projects.filter(timelineRisk);
  return {
    answer: `${atRisk.length} of ${projects.length} projects are at timeline risk (delay >30 days).\n\nAt-risk projects:\n${atRisk.map((p, i) => `  ${i+1}. ${p.project_name} — ${p.timeline_drift_days} days drift`).join('\n')}`,
    data: atRisk,
    detailData: atRisk,
    chartType: 'donut',
    chartLabel: 'Timeline Risk Distribution',
    insights: [
      `Worst delay: ${[...projects].sort((a, b) => b.timeline_drift_days - a.timeline_drift_days)[0].project_name} (${[...projects].sort((a, b) => b.timeline_drift_days - a.timeline_drift_days)[0].timeline_drift_days} days).`,
      `${atRisk.filter(costRisk).length} of these also have cost risk — compound risk.`,
      'Projects in Hypercare and Deliver phases dominate timeline risk.'
    ],
    recommendation: 'Escalate recovery plans for projects >60 days delayed.'
  };
}

export function getDomainWithMostCostRisk() {
  const byDomain = {};
  projects.filter(costRisk).forEach((p) => {
    byDomain[p.domain] = (byDomain[p.domain] || []);
    byDomain[p.domain].push(p);
  });
  const topDomain = Object.entries(byDomain).sort((a, b) => b[1].length - a[1].length)[0];
  if (!topDomain) return { answer: 'No projects currently at cost risk.', data: [], insights: [] };
  return {
    answer: `${topDomain[0]} has the highest number of cost-risk projects: ${topDomain[1].length} of ${projects.filter((p) => p.domain === topDomain[0]).length} total.\n\nAt-risk projects in ${topDomain[0]}:\n${topDomain[1].map((p, i) => `  ${i+1}. ${p.project_name} — ${fmt(p.planned_total_costs)} → ${fmt(p.le_total_costs)} (${(p.cost_drift_pct*100).toFixed(0)}% drift)`).join('\n')}`,
    data: topDomain[1],
    detailData: topDomain[1],
    chartType: 'table',
    chartLabel: `${topDomain[0]} Cost-Risk Projects`,
    insights: [
      `Projects: ${topDomain[1].map((p) => p.project_name).join(', ')}.`,
      `Combined LE overrun in ${topDomain[0]}: ${fmt(topDomain[1].reduce((s, p) => s + (p.le_total_costs - p.planned_total_costs), 0))}.`,
      `${((topDomain[1].length / projects.filter((p) => p.domain === topDomain[0]).length) * 100).toFixed(0)}% of ${topDomain[0]} portfolio is at risk.`
    ],
    recommendation: `Conduct domain-level governance review for ${topDomain[0]}.`
  };
}

export function getCostRiskByPhase() {
  const byPhase = {};
  projects.filter(costRisk).forEach((p) => {
    byPhase[p.project_phase] = byPhase[p.project_phase] || [];
    byPhase[p.project_phase].push(p);
  });
  const lines = Object.entries(byPhase).map(([phase, list]) => `${phase}: ${list.length} (${list.map((p) => p.project_name).join(', ')})`);
  return {
    answer: `Cost Risk by Project Phase\n\n${Object.entries(byPhase).map(([phase, list]) => `${phase}: ${list.length} project(s)\n${list.map((p) => `    • ${p.project_name} — ${fmt(p.planned_total_costs)} → ${fmt(p.le_total_costs)} (${(p.cost_drift_pct*100).toFixed(0)}% drift)`).join('\n')}`).join('\n\n')}`,
    data: Object.entries(byPhase).map(([phase, list]) => ({ phase, count: list.length })),
    detailData: Object.values(byPhase).flat(),
    chartType: 'bar',
    chartLabel: 'Cost Risk by Phase',
    insights: [
      `${Object.values(byPhase).flat().length} total projects at cost risk across ${Object.keys(byPhase).length} phases.`,
      'Deliver-phase projects show highest exposure.',
      'Early-phase cost controls may prevent escalation.'
    ],
    recommendation: 'Strengthen phase-gate cost reviews before projects enter Deliver.'
  };
}

export function getTop5PortfolioValueOnTrack() {
  const top5 = [...projects].sort((a, b) => b.le_yearly_impact - a.le_yearly_impact).slice(0, 5);
  const onTrack = top5.filter((p) => !costRisk(p) && !timelineRisk(p));
  const atRisk = top5.filter((p) => costRisk(p) || timelineRisk(p));
  return {
    answer: `Top 5 Projects Driving Portfolio Value\n\n${top5.map((p, i) => `${i+1}. ${p.project_name}\n   Yearly Impact: ${fmt(p.le_yearly_impact)} | Cost Drift: ${(p.cost_drift_pct*100).toFixed(0)}% | Timeline: ${p.timeline_drift_days}d | Status: ${costRisk(p)||timelineRisk(p) ? '⚠ AT RISK' : '✓ ON TRACK'}`).join('\n\n')}\n\nSummary: ${onTrack.length} on track, ${atRisk.length} at risk.`,
    data: top5,
    detailData: top5,
    chartType: 'bar',
    chartLabel: 'Top 5 Portfolio Value',
    insights: [
      `${onTrack.length} of top 5 are healthy; ${atRisk.length} need intervention.`,
      `Combined value at risk: ${fmt(atRisk.reduce((s, p) => s + p.le_yearly_impact, 0))}.`,
      'Prioritize recovery for high-value projects showing dual risk.'
    ],
    recommendation: atRisk.length > 0 ? 'Fast-track mitigation for at-risk top-value projects.' : 'Maintain current governance — top-value projects are healthy.'
  };
}

export function getDomainTopValueAndCostRisk() {
  const byDomain = {};
  projects.forEach((p) => {
    byDomain[p.domain] = byDomain[p.domain] || { projects: [], value: 0 };
    byDomain[p.domain].projects.push(p);
    byDomain[p.domain].value += p.le_yearly_impact;
  });
  const topDomain = Object.entries(byDomain).sort((a, b) => b[1].value - a[1].value)[0];
  const riskCount = topDomain[1].projects.filter(costRisk).length;
  return {
    answer: `${topDomain[0]} contributes the most portfolio value: ${fmt(topDomain[1].value)} (${((topDomain[1].value / projects.reduce((s, p) => s + p.le_yearly_impact, 0)) * 100).toFixed(0)}% of total).\n   Projects: ${topDomain[1].projects.length} total | Cost-risk projects: ${riskCount}\n\nProjects in ${topDomain[0]}:\n${topDomain[1].projects.map((p, i) => `  ${i+1}. ${p.project_name} — Impact: ${fmt(p.le_yearly_impact)} | Cost Drift: ${(p.cost_drift_pct*100).toFixed(0)}%`).join('\n')}`,
    data: topDomain[1].projects,
    detailData: topDomain[1].projects,
    chartType: 'table',
    chartLabel: `${topDomain[0]} Projects Detail`,
    insights: [
      `${topDomain[0]} represents ${((topDomain[1].value / projects.reduce((s, p) => s + p.le_yearly_impact, 0)) * 100).toFixed(0)}% of total portfolio value.`,
      `${riskCount} of ${topDomain[1].projects.length} projects in ${topDomain[0]} have cost drift >20%.`,
      'Value concentration creates both opportunity and vulnerability.'
    ],
    recommendation: riskCount > 0 ? `Implement domain-specific cost controls for ${topDomain[0]}.` : `${topDomain[0]} is well-managed — consider scaling successful practices.`
  };
}

export function getHighImpactLowEffort() {
  const list = projects.filter((p) => highImpact(p) && lowEffort(p));
  return {
    answer: `${list.length} projects have high impact (score >1.5) and low effort (score <1.0): ${list.map((p) => p.project_name).join(', ') || 'None'}.\n\n${list.map((p, i) => `${i+1}. ${p.project_name}\n   Impact Score: ${p.impact_score} | Effort Score: ${p.effort_score} | Yearly Value: ${fmt(p.le_yearly_impact)}`).join('\n\n')}`,
    data: list,
    detailData: list,
    chartType: 'scatter',
    chartLabel: 'Impact vs Effort',
    insights: [
      list.length > 0 ? `Quick wins available: ${list.map((p) => p.project_name).join(', ')}.` : 'No quick wins identified — consider re-scoping or accelerating promising projects.',
      list.length > 0 ? `Combined impact of quick wins: ${list.reduce((s, p) => s + p.le_yearly_impact, 0).toLocaleString()}.` : null,
      'These projects should be prioritized for fast-track approval.'
    ].filter(Boolean),
    recommendation: list.length > 0 ? 'Fast-track quick-win projects for immediate value capture.' : 'Review project scoping to create more high-impact, low-effort opportunities.'
  };
}

export function getLowImpactHighEffort() {
  const list = projects.filter((p) => p.impact_score <= 1.0 && p.effort_score >= 1.5);
  return {
    answer: `${list.length} projects have low impact (score ≤1.0) and high effort (score ≥1.5): ${list.map((p) => p.project_name).join(', ') || 'None'}.\n\n${list.map((p, i) => `${i+1}. ${p.project_name}\n   Impact Score: ${p.impact_score} | Effort Score: ${p.effort_score} | Cost: ${fmt(p.le_total_costs)} | Value: ${fmt(p.le_yearly_impact)}`).join('\n\n')}`,
    data: list,
    detailData: list,
    chartType: 'scatter',
    chartLabel: 'Impact vs Effort',
    insights: [
      list.length > 0 ? `Reconsider priority for: ${list.map((p) => p.project_name).join(', ')}.` : 'No obvious low-value projects — portfolio is well-balanced.',
      list.length > 0 ? `These projects consume ${fmt(list.reduce((s, p) => s + p.le_total_costs, 0))} with limited returns.` : null,
      'High-effort, low-impact work should be challenged or descoped.'
    ].filter(Boolean),
    recommendation: list.length > 0 ? 'Initiate value review for low-impact, high-effort projects.' : 'Continue current portfolio balance.'
  };
}

export function getProjectSummary(projectName) {
  // Try exact match first, then partial, then TR-XXX code prefix
  let p = projects.find((x) => x.project_name.toLowerCase().includes(projectName.toLowerCase()));
  if (!p && projectName.toLowerCase().startsWith('tr-')) {
    p = projects.find((x) => x.project_name.toLowerCase().includes(projectName.toLowerCase()));
  }
  if (!p) return { answer: `Project "${projectName}" not found in portfolio.`, data: [], insights: [] };
  const costRiskFlag = costRisk(p);
  const timelineRiskFlag = timelineRisk(p);
  const valueCostRatio = (p.le_yearly_impact / p.le_total_costs).toFixed(1);
  return {
    answer: `Project Summary: ${p.project_name}\n\n  Domain: ${p.domain}\n  Phase: ${p.project_phase}\n  Status: ${p.project_status}\n\n  💰 Cost\n    Planned: ${fmt(p.planned_total_costs)}\n    LE:      ${fmt(p.le_total_costs)}\n    Drift:   ${(p.cost_drift_pct * 100).toFixed(0)}% ${costRiskFlag ? '⚠ AT RISK (>20%)' : '✓ Healthy'}\n\n  📅 Timeline\n    Drift:   ${p.timeline_drift_days} days ${timelineRiskFlag ? '⚠ AT RISK (>30d)' : '✓ On Track'}\n\n  💎 Value\n    Yearly Impact: ${fmt(p.le_yearly_impact)}\n    Impact Score:  ${p.impact_score}\n    Effort Score:  ${p.effort_score}\n    Value/Cost:    ${valueCostRatio}x`,
    data: [p],
    detailData: [p],
    chartType: 'table',
    chartLabel: 'Project Details',
    insights: [
      costRiskFlag ? `Cost ALERT: drift is ${(p.cost_drift_pct * 100).toFixed(0)}%, exceeding the 20% risk threshold by ${((p.cost_drift_pct - 0.2) * 100).toFixed(0)} percentage points.` : `Cost is healthy at ${(p.cost_drift_pct * 100).toFixed(0)}% drift (below 20% threshold).`,
      timelineRiskFlag ? `Timeline ALERT: ${p.timeline_drift_days} days delay exceeds the 30-day risk threshold.` : `Timeline is healthy with ${p.timeline_drift_days} days drift (within 30-day threshold).`,
      `Value/Cost ratio of ${valueCostRatio}x indicates ${valueCostRatio > 5 ? 'strong' : valueCostRatio > 2 ? 'moderate' : 'weak'} return on investment.`
    ],
    recommendation: costRiskFlag || timelineRiskFlag ? `⚠ Intervention recommended — schedule a formal project review within 48 hours to assess recovery options.` : `✓ Project ${p.project_name} is tracking well. Continue current governance cadence.`
  };
}

// --- Router ---
export function askBot(rawQuestion) {
  const q = rawQuestion.toLowerCase();

  if (q.includes('top 3') && (q.includes('planned cost') || q.includes('highest planned cost'))) {
    return getTop3ByPlannedCost();
  }
  if (q.includes('top 3') && (q.includes('net impact') || q.includes('highest impact'))) {
    return getTop3ByNetImpact();
  }
  if (q.includes('cost risk') && (q.includes('how many') || q.includes('count'))) {
    return getCostRiskCount();
  }
  if (q.includes('timeline risk') && (q.includes('how many') || q.includes('count'))) {
    return getTimelineRiskCount();
  }
  if (q.includes('domain') && q.includes('cost risk') && q.includes('highest')) {
    return getDomainWithMostCostRisk();
  }
  if (q.includes('phase') && q.includes('cost risk')) {
    return getCostRiskByPhase();
  }
  if (q.includes('top 5') && q.includes('portfolio value')) {
    return getTop5PortfolioValueOnTrack();
  }
  if (q.includes('domain') && q.includes('portfolio value') && q.includes('most')) {
    return getDomainTopValueAndCostRisk();
  }
  if (q.includes('high impact') && q.includes('low effort')) {
    return getHighImpactLowEffort();
  }
  if (q.includes('low impact') && q.includes('high effort')) {
    return getLowImpactHighEffort();
  }
  if (q.includes('summary') && q.includes('project')) {
    // Extract project name including TR-XXX codes
    const name = rawQuestion.replace(/summary of|project|give me|a|the|\—/gi, '').trim();
    return getProjectSummary(name || 'Beauty Pulse');
  }
  if (q.match(/tr-\d+/i)) {
    const code = rawQuestion.match(/tr-\d+/i)[0];
    return getProjectSummary(code);
  }

  // Fallback fuzzy matching
  if (q.includes('cost') && q.includes('risk')) return getCostRiskCount();
  if (q.includes('timeline') && q.includes('risk')) return getTimelineRiskCount();
  if (q.includes('impact') && q.includes('effort') && q.includes('high') && q.includes('low')) return getHighImpactLowEffort();

  return {
    answer: "I can help with executive questions like: 'Top 3 projects by cost', 'Projects at cost risk', 'High impact low effort projects', etc. What would you like to know?",
    data: [],
    insights: ['Try asking one of the predefined executive questions.'],
    recommendation: null
  };
}
