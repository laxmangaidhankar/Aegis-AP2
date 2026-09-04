import React, { useState, useEffect } from 'react';
import { ShieldCheck, Save, RefreshCw, DollarSign, Percent, Package, AlertCircle } from 'lucide-react';
import { fetchMerchantPolicy, updateMerchantPolicy, fetchProducts } from '../services/api';

export default function PolicyManager() {
  const [policy, setPolicy] = useState({
    max_discount_percentage: 15,
    max_transaction_value: 100000,
    allowed_currency: 'INR',
    max_quantity_per_order: 20
  });
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const pData = await fetchMerchantPolicy();
      if (pData) setPolicy(pData);
      const prData = await fetchProducts();
      if (prData) setProducts(prData);
    } catch (err) {
      console.warn('Using default policy view:', err);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const updated = await updateMerchantPolicy(policy);
      setPolicy(updated);
      setMessage('Merchant Policy updated successfully in PostgreSQL database!');
    } catch (err) {
      setMessage(`Updated in memory: ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Merchant Policy Engine Guardrails</h2>
              <p className="text-xs text-slate-400">PostgreSQL Authoritative Rule Store for Spring Boot Gatekeeper</p>
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="Reload Policies"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {message && (
        <div className="bg-emerald-950/50 border border-emerald-800/80 text-emerald-300 p-4 rounded-xl text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Policy Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Percent className="w-4 h-4 text-cyan-400" />
            <span>Maximum Discount Limit</span>
          </h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Max Discount Authorized (%)</label>
            <input
              type="number"
              value={policy.max_discount_percentage || ''}
              onChange={(e) => setPolicy({ ...policy, max_discount_percentage: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              AI Negotiation ceiling. Any Gemini intent exceeding this percentage will trigger immediate REJECT.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Transaction Value Cap</span>
          </h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Maximum Order Cap (₹)</label>
            <input
              type="number"
              value={policy.max_transaction_value || ''}
              onChange={(e) => setPolicy({ ...policy, max_transaction_value: parseFloat(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Hard financial cap per transaction mandate.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Quantity Limits</span>
          </h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Max Units per Transaction</label>
            <input
              type="number"
              value={policy.max_quantity_per_order || ''}
              onChange={(e) => setPolicy({ ...policy, max_quantity_per_order: parseInt(e.target.value, 10) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3">Currency Restriction</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Allowed Currency Code</label>
            <input
              type="text"
              value={policy.allowed_currency || 'INR'}
              onChange={(e) => setPolicy({ ...policy, allowed_currency: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-tr from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving to PostgreSQL...' : 'Save Guardrail Policy'}</span>
        </button>
      </div>

      {/* Product Catalog Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white border-b border-slate-800 pb-3 mb-4">
          Merchant Product Catalog & Max Negotiable Discounts
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Base Price</th>
                <th className="py-2.5 px-3">Max Discount</th>
                <th className="py-2.5 px-3">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {products.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 text-cyan-400 font-bold">{item.sku}</td>
                  <td className="py-3 px-3 font-sans text-slate-200">{item.name}</td>
                  <td className="py-3 px-3 text-emerald-400">₹{item.base_price}</td>
                  <td className="py-3 px-3 text-amber-400">{item.max_negotiable_discount}%</td>
                  <td className="py-3 px-3 text-slate-400">{item.stock_quantity} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
