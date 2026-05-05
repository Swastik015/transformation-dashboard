import React, { useState, useRef, useEffect } from 'react';
import { askBot } from '../utils/chatbotLogic';

const Chatbot = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I'm your Portfolio Intelligence Assistant.\n\nI have full context of your dashboard data — ask me anything about projects, risks, costs, domains, or strategic recommendations."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isTyping) return;
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const resp = await askBot(text, activeTab);
      const botMsg = { role: 'bot', ...resp };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error asking bot:", error);
      setMessages((prev) => [...prev, { role: 'bot', text: `I couldn't process that request.\n\n${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'bot',
      text: "Chat cleared. Ask me anything about your portfolio!"
    }]);
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <button
          id="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300"
          style={{ 
            background: 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)',
            boxShadow: '0 8px 32px rgba(94, 10, 31, 0.4)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {/* Pulse indicator */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" 
            style={{ animation: 'pulse 2s infinite' }} />
        </button>
      )}

      {/* Slide-in Side Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setIsOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          
          {/* Panel */}
          <div 
            className="relative w-full max-w-[520px] flex flex-col bg-white shadow-2xl"
            style={{ animation: 'slideIn 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" 
              style={{ background: 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Portfolio Intelligence</div>
                  <div className="text-[10px] text-white/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Viewing: {activeTab?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Dashboard'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={clearChat} className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors" title="Clear chat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5" style={{ backgroundColor: '#FAFAFA' }}>
              <div className="space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'bot' ? (
                      <div className="max-w-[95%] space-y-3">
                        {/* Bot avatar row */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" 
                            style={{ background: 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)' }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Assistant</span>
                        </div>

                        {/* Answer text */}
                        {msg.text && (
                          <div className="text-[13px] text-gray-700 leading-relaxed bg-white px-4 py-3.5 rounded-xl shadow-sm border border-gray-100 whitespace-pre-line">
                            {msg.text}
                          </div>
                        )}

                        {/* Visualization */}
                        {msg.data && msg.data.length > 0 && (
                          <FullViz data={msg.data} type={msg.chartType} label={msg.chartLabel} detail={msg.detailData} />
                        )}

                        {/* Insights */}
                        {msg.insights && msg.insights.length > 0 && (
                          <div className="bg-white px-4 py-3.5 rounded-xl shadow-sm border border-gray-100 space-y-2">
                            <div className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: '#C4A35A' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4A35A" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                              </svg>
                              Key Insights
                            </div>
                            {msg.insights.map((insight, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#C4A35A' }} />
                                <span className="text-[12px] text-gray-600 leading-relaxed">{insight}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Recommendation */}
                        {msg.recommendation && (
                          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl border" 
                            style={{ backgroundColor: '#FDF8F4', borderColor: '#F0E6DA' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E0A1F" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                            <span className="text-[12px] font-medium" style={{ color: '#5E0A1F' }}>{msg.recommendation}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm text-[13px]"
                        style={{ background: 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)', color: 'white' }}>
                        {msg.text}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center" 
                        style={{ background: 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                      <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#5E0A1F', animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#8B1A3D', animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#C4A35A', animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white flex-shrink-0" style={{ borderTop: '1px solid #F0EDE8' }}>
              <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-1" style={{ border: '1px solid #E8E4DF' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, risks, value..."
                  disabled={isTyping}
                  className="flex-1 text-[13px] py-2.5 outline-none bg-transparent placeholder-gray-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{ 
                    background: input.trim() && !isTyping ? 'linear-gradient(135deg, #5E0A1F 0%, #8B1A3D 100%)' : '#E5E5E5',
                    transform: input.trim() ? 'scale(1)' : 'scale(0.9)'
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[9px] text-gray-300">Powered by Groq • LLaMA 3.3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

// --- Visualization Component ---
const FullViz = ({ data, type, label, detail }) => {
  if (!data || data.length === 0) return null;

  const fmt = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return '-';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return `${n}`;
  };

  // Horizontal Bar Chart
  if (type === 'bar') {
    const max = Math.max(...data.map((d) => d.planned_total_costs || d.le_yearly_impact || d.value || d.count || 0));
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">{label}</div>
        <div className="space-y-2.5">
          {data.map((d, i) => {
            const val = d.planned_total_costs || d.le_yearly_impact || d.value || d.count || 0;
            const name = d.project_name || d.phase || d.domain || d.label || `Item ${i + 1}`;
            const isRisk = d.cost_drift_pct > 0.2 || d.timeline_drift_days > 30;
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-700 font-medium truncate mr-2">{name}</span>
                  <span className="text-[11px] font-semibold" style={{ color: isRisk ? '#C62828' : '#5E0A1F' }}>{fmt(val)}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${Math.max((val / max) * 100, 4)}%`, 
                      background: isRisk ? 'linear-gradient(90deg, #C62828 0%, #E53935 100%)' : `linear-gradient(90deg, #5E0A1F 0%, ${i === 0 ? '#8B1A3D' : '#C4A35A'} 100%)`
                    }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Donut chart
  if (type === 'donut') {
    const atRisk = typeof data[0]?.count === 'number' ? data[0].count : data.length;
    const total = typeof data[0]?.total === 'number' ? data[0].total : 21;
    const safe = total - atRisk;
    const pct = (atRisk / total) * 100;
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg width="96" height="96" className="transform -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#F0EDE8" strokeWidth="10" />
            <circle cx="48" cy="48" r="40" fill="none" stroke="#5E0A1F" strokeWidth="10" 
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: '#5E0A1F' }}>{atRisk}</span>
            <span className="text-[8px] text-gray-400 uppercase font-semibold">At Risk</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-gray-700">{label}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5E0A1F' }} />
              <span className="text-[11px] text-gray-600">At Risk: <span className="font-bold">{atRisk}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              <span className="text-[11px] text-gray-600">On Track: <span className="font-bold">{safe}</span></span>
            </div>
          </div>
          <div className="text-[10px] text-gray-400">{pct.toFixed(0)}% of portfolio at risk</div>
        </div>
      </div>
    );
  }

  // Scatter plot
  if (type === 'scatter') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">{label}</div>
        <div className="relative h-40 border-b border-l border-gray-200 mx-2 mb-2">
          <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-gray-200" />
          <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-gray-200" />
          {data.map((d, i) => {
            if (!d.effort_score || !d.impact_score) return null;
            const x = (d.effort_score / 3) * 100;
            const y = 100 - (d.impact_score / 3) * 100;
            const isQuickWin = d.impact_score > 1.5 && d.effort_score < 1.0;
            const isWaste = d.impact_score <= 1.0 && d.effort_score >= 1.5;
            return (
              <div
                key={i}
                className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow cursor-pointer hover:scale-[1.8] transition-transform"
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
          <span className="absolute bottom-0.5 right-0.5 text-[9px] text-gray-400">Effort →</span>
          <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-400">↑ Impact</span>
        </div>
        <div className="flex items-center gap-4 px-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-700" />
            <span className="text-[9px] text-gray-500">Quick Win</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-700" />
            <span className="text-[9px] text-gray-500">Reconsider</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#5E0A1F' }} />
            <span className="text-[9px] text-gray-500">Standard</span>
          </div>
        </div>
      </div>
    );
  }

  // Table view
  if (type === 'table') {
    const fullData = detail || data;
    // Detect if data has project-level fields or is a simple key-value list
    const hasProjectFields = fullData[0]?.project_name || fullData[0]?.domain;
    
    if (!hasProjectFields) {
      // Render as simple key-value cards
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2.5" style={{ backgroundColor: '#F8F5F0' }}>{label}</div>
          <div className="divide-y divide-gray-50">
            {fullData.map((d, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between hover:bg-gray-50/50">
                <span className="text-[11px] text-gray-700 font-medium">{d.label || d.name || Object.values(d)[0]}</span>
                <span className="text-[11px] font-semibold" style={{ color: '#5E0A1F' }}>{d.value || d.count || Object.values(d)[1]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-4 py-2.5" style={{ backgroundColor: '#F8F5F0' }}>{label}</div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: '2px solid #F0EDE8' }}>
                <th className="text-left py-2.5 px-4 font-semibold text-gray-500">Project</th>
                <th className="text-left py-2.5 px-4 font-semibold text-gray-500">Domain</th>
                <th className="text-right py-2.5 px-4 font-semibold text-gray-500">Cost</th>
                <th className="text-right py-2.5 px-4 font-semibold text-gray-500">Drift</th>
                <th className="text-center py-2.5 px-4 font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {fullData.map((d, i) => {
                const costRisk = d.cost_drift_pct > 0.2;
                const timelineRisk = d.timeline_drift_days > 30;
                return (
                  <tr key={i} className="hover:bg-gray-50/50" style={{ borderBottom: '1px solid #F9F7F4' }}>
                    <td className="py-2.5 px-4 text-gray-800 font-medium">{d.project_name || '-'}</td>
                    <td className="py-2.5 px-4 text-gray-500">{d.domain || '-'}</td>
                    <td className="py-2.5 px-4 text-right text-gray-600">{d.planned_total_costs ? fmt(d.planned_total_costs) : d.le_total_costs ? fmt(d.le_total_costs) : '-'}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className={costRisk ? 'text-red-600 font-semibold' : 'text-green-600'}>
                        {d.cost_drift_pct != null ? `${(d.cost_drift_pct * 100).toFixed(0)}%` : '-'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {costRisk || timelineRisk ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-semibold">RISK</span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-semibold">OK</span>
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
