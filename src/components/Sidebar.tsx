// ============================================
// PharmaQuest AI - Navigation Sidebar
// ============================================

import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Atom,
  FlaskConical,
  Brain,
  BarChart3,
  BookOpen,
  Settings,
  LogOut,
  Sparkles,
  Dna
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';
import type { ModuleType } from '@/types';

interface NavItem {
  id: ModuleType;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'molecule-builder', label: 'Molecule Builder', icon: Atom },
  { id: 'virtual-lab', label: 'Virtual Lab', icon: FlaskConical },
  { id: 'quiz', label: 'Quiz Arena', icon: Brain },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'research-hub', label: 'Research Hub', icon: BookOpen },
];

export function Sidebar() {
  const { currentModule, setModule, level, xp } = useGameStore();

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Dna className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold flex items-center gap-1">
              PharmaQuest
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h1>
            <p className="text-slate-500 text-xs">AI-Powered Learning</p>
          </div>
        </div>
      </div>

      {/* User Level */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-xs">Level {level}</span>
            <span className="text-indigo-400 text-xs font-medium">{xp} XP</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(xp % 500) / 5}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModule(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive && "text-indigo-400"
              )} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-2 h-2 rounded-full bg-indigo-400"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-xl p-3 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-xs font-medium">AI Systems Active</span>
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Mentor AI</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Adaptive Engine</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Knowledge Base</span>
              <span className="text-green-400">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          Exit
        </button>
      </div>
    </div>
  );
}
