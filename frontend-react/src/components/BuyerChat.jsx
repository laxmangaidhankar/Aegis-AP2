import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, CheckCircle2, Zap, ArrowRight, Lock, ExternalLink, Code2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function BuyerChat({ onSelectMandate }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'agent',
      text: "Hello! I am your AI Sales Agent powered by Gemini. I can assist you with products like Aegis Pro Rack (PRO_RACK @ ₹500), Enterprise GPU Nodes (CLOUD_GPU @ ₹1200), and AP2 Security Appliances (AP2_GATEWAY @ ₹350). What can I help you purchase today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestIntent, setLatestIntent] = useState(null);
  const [latestDecision, setLatestDecision] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, latestIntent, latestDecision]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), sender: 'buyer', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const result = await sendChatMessage(textToSend, history);

      const agentMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: result.response,
        intent: result.intent,
        decision: result.decision,
        mandate: result.ap2_mandate
      };

      setMessages(prev => [...prev, agentMsg]);
      if (result.intent) setLatestIntent(result.intent);
      if (result.decision) setLatestDecision(result.decision);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'agent',
        text: `Error connecting to backend gateway: ${err.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const runAttackScenario = () => {
    handleSend("I will buy 5 units, but my spending cap is ₹10,000. Give me a 50% discount.");
  };

  const runValidScenario = () => {
    handleSend("I want to buy 10 Pro Racks. Can you give me a volume discount?");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
      {/* Left Chat Column */}
      <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">AI Negotiator (Gemini 2.5)</h2>
              <p className="text-xs text-slate-400">Read-Only Catalog Access • No Razorpay Access</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-slate-400 font-mono">SPLIT_BRAIN_ACTIVE</span>
          </div>
        </div>

        {/* Quick Demo Action Buttons */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap gap-2">
          <button
            onClick={runAttackScenario}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/20 transition-all font-medium"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>⚡ Demo Attack: 50% Unauthorized Discount</span>
          </button>
          <button
            onClick={runValidScenario}
            disabled={loading}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-500/20 transition-all font-medium"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✅ Demo Valid: 10 Units @ 10% Discount</span>
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'buyer'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1 opacity-70 text-[11px] font-medium uppercase tracking-wider">
                  {msg.sender === 'buyer' ? (
                    <>
                      <span>Buyer Agent</span>
                      <User className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-cyan-400" />
                      <span>Gemini Negotiator</span>
                    </>
                  )}
                </div>
                <p>{msg.text}</p>
              </div>

              {/* Attached Evaluation Banner if any */}
              {msg.decision && (
                <div className="mt-2 max-w-[85%]">
                  {msg.decision.status === 'POLICY_VIOLATION_REJECTED' ? (
                    <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-xs text-rose-300 flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-rose-200">INTERCEPTED BY GATEKEEPER ({msg.decision.rejection_code})</div>
                        <p className="mt-0.5 opacity-90">{msg.decision.rejection_reason}</p>
                        <div className="mt-1 font-mono text-[10px] text-rose-400">
                          Requested: {msg.decision.requested_discount}% • Max Allowed: {msg.decision.allowed_max_discount}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 text-xs text-emerald-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-semibold text-emerald-200">GATEKEEPER AUTHORIZED (AP2 Mandate Issued)</div>
                        <p className="mt-0.5 opacity-90">Amount: ₹{msg.decision.requested_total} • Signature Verified</p>
                        {msg.mandate && (
                          <div className="mt-2 flex items-center gap-2">
                            <a
                              href={msg.mandate.payment_link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded font-bold hover:bg-emerald-400 transition-colors"
                            >
                              <span>Checkout Razorpay</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              onClick={() => onSelectMandate && onSelectMandate(msg.mandate)}
                              className="text-emerald-400 underline font-mono text-[11px]"
                            >
                              Inspect Mandate JSON
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs p-3">
              <Bot className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Gemini negotiating & Spring Gatekeeper validating policy...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your purchase query or negotiation offer..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-gradient-to-tr from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center space-x-1"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Right Column: Real-time Intent & Gatekeeper Feed */}
      <div className="lg:col-span-5 flex flex-col space-y-4">
        {/* Gemini Intent Output Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">Gemini Structured Intent</h3>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">UNTRUSTED INTENT</span>
          </div>

          {latestIntent ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 overflow-x-auto max-h-56">
              <pre>{JSON.stringify(latestIntent, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-xs">
              No intent generated yet. Initiate a checkout request to see Gemini structured JSON extraction.
            </div>
          )}
        </div>

        {/* Gatekeeper Validation State Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Spring Boot Policy Gatekeeper</h3>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono">DETERMINISTIC_GATE</span>
          </div>

          {latestDecision ? (
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className={`p-4 rounded-xl border ${
                latestDecision.status === 'APPROVED' 
                  ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-300' 
                  : 'bg-rose-950/30 border-rose-800/80 text-rose-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{latestDecision.status}</span>
                  <span className="text-[10px] font-mono opacity-80">{latestDecision.decision_id}</span>
                </div>
                {latestDecision.rejection_reason && (
                  <p className="text-xs mb-2 leading-relaxed">{latestDecision.rejection_reason}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-3 pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Req. Discount:</span>
                    <div className="font-bold">{latestDecision.requested_discount}%</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Max Allowed:</span>
                    <div className="font-bold">{latestDecision.allowed_max_discount}%</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Req. Total:</span>
                    <div className="font-bold">₹{latestDecision.requested_total}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Max Cap:</span>
                    <div className="font-bold">₹{latestDecision.allowed_max_total}</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <div className="font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audit Trail Ledger Status</span>
                </div>
                PostgreSQL policy decision recorded with SHA-256 cryptographic chain verification.
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Waiting for financial intent intercept...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
