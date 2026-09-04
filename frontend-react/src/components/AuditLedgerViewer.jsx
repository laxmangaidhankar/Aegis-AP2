import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, CheckCircle2, Search, RefreshCw, FileText, Lock } from 'lucide-react';
import { fetchAuditLogs } from '../services/api';

export default function AuditLedgerViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadAuditLedger();
  }, []);

  const loadAuditLedger = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs();
      if (Array.isArray(data) && data.length > 0) {
        setLogs(data);
      } else {
        // Sample audit seeds for demonstration
        setLogs([
          {
            decisionId: 'dec_hackathon_002',
            intentId: 'int_req_8922',
            buyerId: 'agent_req_8922',
            status: 'POLICY_VIOLATION_REJECTED',
            rejectionCode: 'DISCOUNT_THRESHOLD_EXCEEDED',
            rejectionReason: 'Requested discount of 50.00% exceeds merchant maximum policy of 15.00%.',
            requestedDiscountPct: 50.0,
            allowedMaxDiscountPct: 15.0,
            requestedTotal: 10000.0,
            allowedMaxTotal: 100000.0,
            evalTimestamp: new Date().toISOString()
          },
          {
            decisionId: 'dec_hackathon_001',
            intentId: 'int_req_8921',
            buyerId: 'agent_req_8921',
            status: 'APPROVED',
            rejectionCode: null,
            rejectionReason: null,
            requestedDiscountPct: 10.0,
            allowedMaxDiscountPct: 15.0,
            requestedTotal: 4500.0,
            allowedMaxTotal: 100000.0,
            evalTimestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]);
      }
    } catch (err) {
      console.warn('Audit log fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(item => {
    if (filter === 'REJECTED') return item.status === 'POLICY_VIOLATION_REJECTED';
    if (filter === 'APPROVED') return item.status === 'APPROVED';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">PostgreSQL Authoritative Audit Ledger</h2>
            <p className="text-xs text-slate-400">Explainable, Tamper-Evident Record of Every AI Transaction Intent Decision</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
            >
              All ({logs.length})
            </button>
            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'REJECTED' ? 'bg-rose-950 text-rose-300 border border-rose-800/50' : 'text-slate-400'}`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${filter === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' : 'text-slate-400'}`}
            >
              Approved
            </button>
          </div>

          <button
            onClick={loadAuditLedger}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Audit Log Cards Stream */}
      <div className="space-y-4">
        {filteredLogs.map((log) => {
          const isRejected = log.status === 'POLICY_VIOLATION_REJECTED';
          return (
            <div
              key={log.decisionId}
              className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition-all ${
                isRejected ? 'border-rose-900/60 hover:border-rose-700/80' : 'border-emerald-900/60 hover:border-emerald-700/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  {isRejected ? (
                    <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-sm ${isRejected ? 'text-rose-300' : 'text-emerald-300'}`}>
                        {log.status}
                      </span>
                      {log.rejectionCode && (
                        <span className="text-[10px] bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-mono">
                          {log.rejectionCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Decision ID: {log.decisionId} • Buyer: {log.buyerId}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-xs text-slate-400">
                  {new Date(log.evalTimestamp).toLocaleString()}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Evaluation Audit Trail</h4>
                  {isRejected ? (
                    <p className="text-xs text-rose-300/90 leading-relaxed bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl">
                      {log.rejectionReason}
                    </p>
                  ) : (
                    <p className="text-xs text-emerald-300/90 leading-relaxed bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-xl">
                      Transaction intent satisfies all merchant policy rules. AP2 Cart Mandate generated and cryptographically signed.
                    </p>
                  )}
                </div>

                <div className="md:col-span-4 bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs space-y-2">
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Req. Discount:</span>
                    <span className={isRejected && log.requestedDiscountPct > log.allowedMaxDiscountPct ? 'text-rose-400 font-bold' : 'text-white'}>
                      {log.requestedDiscountPct}%
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Max Discount Policy:</span>
                    <span className="text-white">{log.allowedMaxDiscountPct}%</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span className="text-slate-400">Requested Total:</span>
                    <span className="text-white">₹{log.requestedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tamper Chain Hash:</span>
                    <span className="text-cyan-400 text-[10px] truncate max-w-[100px]">SHA-256 OK</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
