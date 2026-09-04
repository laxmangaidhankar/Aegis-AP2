import React from 'react';
import { Cpu, Lock, Database, ShieldCheck, ArrowRight, Layers, FileCode, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">The "Split-Brain" Architecture Model</h2>
            <p className="text-xs text-slate-400">Strict Isolation between Probabilistic AI Reasoning & Deterministic Financial Policy Execution</p>
          </div>
        </div>
      </div>

      {/* Visual Flow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Box 1: Probabilistic Negotiator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 mb-3">
              <Cpu className="w-5 h-5" />
              <span className="font-bold text-sm">1. AI Negotiator</span>
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Google Gemini API + Express</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Conversational buyer intelligence layer. Understands requirements, negotiates volume discounts, and generates structured <code className="text-cyan-300">Transaction_Intent</code> JSON.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="text-rose-400">⛔ Read-Only Catalog Access</div>
              <div className="text-rose-400">⛔ NO Razorpay Key Access</div>
              <div className="text-emerald-400">✓ Structured JSON Output</div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400">
            <span>Outputs Intent Payload</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Box 2: Deterministic Policy Gatekeeper */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 text-amber-400 mb-3">
              <Lock className="w-5 h-5" />
              <span className="font-bold text-sm">2. Deterministic Gatekeeper</span>
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Spring Boot Policy Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Stateless Java rule verification engine. Intercepts intent payloads and evaluates against strict merchant policy limits before issuing payments.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="text-emerald-400">✓ Evaluates Max Discount %</div>
              <div className="text-emerald-400">✓ Evaluates Transaction Cap</div>
              <div className="text-emerald-400">✓ Exclusive Razorpay Credential Holder</div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-amber-400">
            <span>Approve or Reject</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Box 3: PostgreSQL Ledger & AP2 Payment */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div>
            <div className="flex items-center space-x-2 text-purple-400 mb-3">
              <Database className="w-5 h-5" />
              <span className="font-bold text-sm">3. PostgreSQL & AP2 Protocol</span>
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Audit Ledger & Razorpay</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Authoritative financial ledger. Records decisions with SHA-256 tamper-proof hash chains. Generates signed AP2 Cart Mandates & Razorpay payment links.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-1">
              <div className="text-emerald-400">✓ Immutable Audit Ledger</div>
              <div className="text-emerald-400">✓ Signed Cart Mandates</div>
              <div className="text-emerald-400">✓ Razorpay Webhook Verifier</div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400">
            <span>Final Settlement</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Trust Boundary Principle Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Core Security Philosophy</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          LLMs are probabilistic and prone to prompt injection or hallucinated discounts. By decoupling conversational AI from payment execution, Aegis-AP2 guarantees that no matter what an LLM output claims, financial transactions are strictly bounded by deterministic Java code and PostgreSQL merchant guardrails.
        </p>
      </div>
    </div>
  );
}
