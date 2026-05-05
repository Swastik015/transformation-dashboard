import React, { useState, useRef, useEffect } from 'react';
import { askBot } from '../utils/chatbotLogic';

const SUGGESTIONS = [
  'Top 3 Project having the highest planned cost?',
  'Top 3 Project having the highest Net Impact?',
  'How many projects are currently at risk for cost drift?',
  'How many projects are currently at risk for Timeline drift?',
  'Which domain has the highest project at risk for cost drift? Give a list of these projects?',
  'How many projects are at high risk for cost drift by project Phase? Give a list of these projects?',
  'Which 5 projects are driving the highest portfolio value, and are they on track?',
  'Which domain is contributing the most to total portfolio value, and how many projects are at a cost risk within them?',
  'Which projects have high impact but low effort?',
  'Which projects have low impact but high effort?',
  'Give me a quick summary of Project TR-015 — including cost, value, cost drift and time drift?',
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I'm your Transformation Portfolio Intelligence Assistant.\n\nI can answer executive-level questions about:\n  • Project costs and value drivers\n  • Cost and timeline risk analysis\n  • Domain and phase-level portfolio insights\n  • Impact vs effort trade-offs\n  • Individual project summaries\n\nAsk me anything or select a suggested question below."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const resp = askBot(text);
      const botMsg = { role: 'bot', ...resp };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
          style={{ backgroundColor: '#5E0A1F' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* FULL SCREEN Chat Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white">
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ backgroundColor: '#5E0A1F' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <div className="text-base font-semibold text-white">Portfolio Intelligence Assistant</div>
                <div className="text-xs text-white/60">Ask executive-level questions about projects, risk, and portfolio value</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6" style={{ backgroundColor: '#FAF8F5' }}>
            <div className="max-w-5xl mx-auto space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'px-5 py-3 rounded-2xl rounded-tr-sm' : ''}`}
                    style={msg.role === 'user' ? { backgroundColor: '#5E0A1F', color: 'white' } : {}}>
                    {msg.role === 'bot' ? (
                      <div className="space-y-4">
                        {/* Bot identity */}
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F5EDE8' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-gray-400">Portfolio Intelligence</span>
                        </div>

                        {/* Answer */}
                        <div className="text-sm text-gray-800 leading-relaxed bg-white px-5 py-4 rounded-xl shadow-sm whitespace-pre-line">
                          {msg.text}
                        </div>

                        {/* Visualization */}
                        {msg.data && msg.data.length > 0 && (
                          <FullViz data={msg.data} type={msg.chartType} label={msg.chartLabel} detail={msg.detailData} />
                        )}

                        {/* Insights */}
                        {msg.insights && msg.insights.length > 0 && (
                          <div className="bg-white px-5 py-4 rounded-xl shadow-sm space-y-2">
                            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#C4A35A' }}>Executive Insights</div>
                            {msg.insights.map((insight, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#5E0A1F' }} />
                                <span className="text-sm text-gray-600">{insight}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendation */}
                        {msg.recommendation && (
                          <div className="flex items-start gap-3 px-5 py-3.5 rounded-xl" style={{ backgroundColor: '#F5EDE8' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            <span className="text-sm font-medium" style={{ color: '#5E0A1F' }}>{msg.recommendation}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm">{msg.text}</span>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-5 py-4 rounded-xl shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="px-6 py-4 flex-shrink-0" style={{ backgroundColor: '#FAF8F5', borderTop: '1px solid #F0EDE8' }}>
            <div className="max-w-5xl mx-auto">
              <div className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Suggested Executive Questions</div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="text-xs px-4 py-2 rounded-full border hover:bg-white transition-colors bg-white/50"
                    style={{ borderColor: '#E0D8D0', color: '#5E0A1F' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-6 py-4 bg-white border-t flex-shrink-0" style={{ borderColor: '#F0EDE8' }}>
            <div className="max-w-5xl mx-auto flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask an executive question about projects, risk, value..."
                className="flex-1 text-sm px-5 py-3 rounded-full outline-none bg-gray-50 focus:bg-white transition-colors"
                style={{ border: '1px solid #F0EDE8' }}
              />
              <button
                onClick={() => handleSend()}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ backgroundColor: input.trim() ? '#5E0A1F' : '#E5E5E5' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- FULL-SCREEN Visualization Component ---
const FullViz = ({ data, type, label, detail }) => {
  if (!data || data.length === 0) return null;

  const fmt = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };

  // Horizontal Bar Chart
  if (type === 'bar') {
    const max = Math.max(...data.map((d) => d.planned_total_costs || d.le_yearly_impact || d.value || d.count || 0));
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">{label}</div>
        <div className="space-y-3">
          {data.map((d, i) => {
            const val = d.planned_total_costs || d.le_yearly_impact || d.value || d.count || 0;
            const name = d.project_name || d.phase || d.domain || `Item ${i + 1}`;
            const isRisk = d.cost_drift_pct > 0.2 || d.timeline_drift_days > 30;
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-48 truncate text-right font-medium">{name}</span>
                <div className="flex-1 h-6 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((val / max) * 100, 5)}%`, backgroundColor: isRisk ? '#C62828' : i === 0 ? '#5E0A1F' : '#C4A35A' }}>
                    <span className="text-[10px] text-white font-medium">{fmt(val)}</span>
                  </div>
                </div>
                {isRisk && (
                  <span className="text-[10px] text-red-600 font-medium px-2 py-0.5 rounded-full bg-red-50">AT RISK</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Donut chart
  if (type === 'donut') {
    const atRisk = data.length;
    const total = 20;
    const safe = total - atRisk;
    const pct = (atRisk / total) * 100;
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg width="128" height="128" className="transform -rotate-90">
            <circle cx="64" cy="64" r="50" fill="none" stroke="#E5E5E5" strokeWidth="14" />
            <circle cx="64" cy="64" r="50" fill="none" stroke="#5E0A1F" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: '#5E0A1F' }}>{atRisk}</span>
            <span className="text-[10px] text-gray-400">AT RISK</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-semibold text-gray-700">{label}</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#5E0A1F' }} />
              <span className="text-xs text-gray-600">At Risk: <span className="font-semibold">{atRisk}</span> projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs text-gray-600">On Track: <span className="font-semibold">{safe}</span> projects</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">{pct.toFixed(0)}% of total portfolio at risk</div>
          </div>
        </div>
      </div>
    );
  }

  // Scatter plot
  if (type === 'scatter') {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">{label}</div>
        <div className="relative h-48 border-b border-l border-gray-200 mx-4 mb-2">
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-gray-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-gray-200" />
          {data.map((d, i) => {
            const x = (d.effort_score / 3) * 100;
            const y = 100 - (d.impact_score / 3) * 100;
            const isQuickWin = d.impact_score > 1.5 && d.effort_score < 1.0;
            const isWaste = d.impact_score <= 1.0 && d.effort_score >= 1.5;
            return (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-150 transition-transform"
                style={{
                  left: `${Math.min(x, 95)}%`,
                  top: `${Math.min(Math.max(y, 5), 95)}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isQuickWin ? '#2E7D32' : isWaste ? '#C62828' : '#5E0A1F'
                }}
                title={`${d.project_name}\nImpact: ${d.impact_score}\nEffort: ${d.effort_score}`}
              />
            );
          })}
          <span className="absolute bottom-1 right-1 text-[10px] text-gray-400">High Effort →</span>
          <span className="absolute top-1 left-1 text-[10px] text-gray-400">↑ High Impact</span>
        </div>
        <div className="flex items-center gap-6 mt-3 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow-sm" />
            <span className="text-xs text-gray-600">Quick Win (High Impact, Low Effort)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-sm" />
            <span className="text-xs text-gray-600">Reconsider (Low Impact, High Effort)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: '#5E0A1F' }} />
            <span className="text-xs text-gray-600">Standard</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Table view
  if (type === 'table') {
    const fullData = detail || data;
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 px-6 py-3" style={{ backgroundColor: '#F5EDE8' }}>{label}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Project Name</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Domain</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-600">Phase</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Planned Cost</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">LE Cost</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Impact</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Cost Drift</th>
                <th className="text-right py-3 px-6 font-semibold text-gray-600">Timeline Drift</th>
                <th className="text-center py-3 px-6 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {fullData.map((d, i) => {
                const costRisk = d.cost_drift_pct > 0.2;
                const timelineRisk = d.timeline_drift_days > 30;
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #F9F7F4' }} className="hover:bg-gray-50/50">
                    <td className="py-3 px-6 text-gray-800 font-medium">{d.project_name || d.phase || d.domain}</td>
                    <td className="py-3 px-6 text-gray-600">{d.domain || '-'}</td>
                    <td className="py-3 px-6 text-gray-600">{d.project_phase || '-'}</td>
                    <td className="py-3 px-6 text-right text-gray-600">{d.planned_total_costs ? fmt(d.planned_total_costs) : '-'}</td>
                    <td className="py-3 px-6 text-right text-gray-600">{d.le_total_costs ? fmt(d.le_total_costs) : '-'}</td>
                    <td className="py-3 px-6 text-right text-gray-600">{d.le_yearly_impact ? fmt(d.le_yearly_impact) : '-'}</td>
                    <td className="py-3 px-6 text-right">
                      <span className={costRisk ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {(d.cost_drift_pct * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <span className={timelineRisk ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {d.timeline_drift_days}d
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {costRisk || timelineRisk ? (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium">AT RISK</span>
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">ON TRACK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
};

export default Chatbot;
