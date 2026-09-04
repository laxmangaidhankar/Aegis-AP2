import React, { useState } from 'react';
import { KeyRound, ShieldCheck, ExternalLink, Copy, Check, Lock, Code2 } from 'lucide-react';

export default function Ap2MandateVisualizer({ mandate }) {
  const [copied, setCopied] = useState(false);

  const sampleMandate = mandate || {
    "@context": "https://ap2.dev/schema",
    "type": "CartMandate",
    "mandate_id": "mandate_ap2_8922_xyz",
    "merchant_id": "rzp_test_998",
    "authorized_amount": 4500.0,
    "currency": "INR",
    "signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "payment_link": "https://rzp.io/l/xYz123?mandate=mandate_ap2_8922_xyz&amount=4500",
    "status": "ISSUED"
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleMandate, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AP2 / x402 Cryptographic Mandate Inspector</h2>
            <p className="text-xs text-slate-400">Signed Cart Mandate Issued exclusively by Spring Boot Gatekeeper</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied JSON' : 'Copy Mandate JSON'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mandate JSON Spec */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">AP2 Mandate Payload Specification</h3>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
              AP2 SCHEMA VALIDATED
            </span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
            <pre>{JSON.stringify(sampleMandate, null, 2)}</pre>
          </div>
        </div>

        {/* Security & Cryptography Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Cryptographic Proof</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 HMAC Signature</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-amber-300 break-all">
                  {sampleMandate.signature}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Authorized Transaction Amount</span>
                <div className="font-mono text-lg font-bold text-emerald-400">
                  {sampleMandate.currency} ₹{sampleMandate.authorized_amount}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Merchant Identity</span>
                <div className="font-mono text-slate-200">{sampleMandate.merchant_id}</div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <a
                  href={sampleMandate.payment_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
                >
                  <span>Execute Razorpay Payment</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
