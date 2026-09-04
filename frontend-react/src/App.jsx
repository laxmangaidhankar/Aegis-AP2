import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BuyerChat from './components/BuyerChat';
import PolicyManager from './components/PolicyManager';
import AuditLedgerViewer from './components/AuditLedgerViewer';
import Ap2MandateVisualizer from './components/Ap2MandateVisualizer';
import ArchitectureDiagram from './components/ArchitectureDiagram';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedMandate, setSelectedMandate] = useState(null);

  const handleSelectMandate = (mandate) => {
    setSelectedMandate(mandate);
    setActiveTab('mandate');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'chat' && <BuyerChat onSelectMandate={handleSelectMandate} />}
        {activeTab === 'policy' && <PolicyManager />}
        {activeTab === 'audit' && <AuditLedgerViewer />}
        {activeTab === 'mandate' && <Ap2MandateVisualizer mandate={selectedMandate} />}
        {activeTab === 'architecture' && <ArchitectureDiagram />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        Aegis-AP2 • Cryptographically Bounded Agentic Commerce Orchestrator • Built with MERN + Gemini API + Spring Boot + PostgreSQL
      </footer>
    </div>
  );
}
