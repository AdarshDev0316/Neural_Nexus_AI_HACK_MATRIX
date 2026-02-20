// ============================================
// PharmaQuest AI - Main Application
// Multi-Layer AI-Powered Educational Platform
// ============================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { VirtualLab } from '@/components/VirtualLab';
import { Quiz } from '@/components/Quiz';
import { Analytics } from '@/components/Analytics';
import { ResearchHub } from '@/components/ResearchHub';
import { AIMentor } from '@/components/AIMentor';
import { useGameStore, useAnalyticsStore } from '@/store/gameStore';
import { KnowledgePopup } from '@/components/KnowledgePopup';

export function App() {
  const { currentModule } = useGameStore();
  const { incrementSessionTime } = useAnalyticsStore();

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      incrementSessionTime(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementSessionTime]);

  // Render current module
  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'molecule-builder':
        return <MoleculeBuilder />;
      case 'virtual-lab':
        return <VirtualLab />;
      case 'quiz':
        return <Quiz />;
      case 'analytics':
        return <Analytics />;
      case 'research-hub':
        return <ResearchHub />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Module Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative h-full"
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* AI Mentor Avatar - Always visible */}
      <AIMentor />

      {/* Knowledge Popup */}
      <KnowledgePopup />
    </div>
  );
}
