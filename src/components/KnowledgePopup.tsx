// ============================================
// PharmaQuest AI - Knowledge Popup Component
// Contextual knowledge pop-ups triggered by events
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import { useKnowledgeStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

export function KnowledgePopup() {
  const { activePopup, hidePopup } = useKnowledgeStore();

  return (
    <AnimatePresence>
      {activePopup && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="fixed bottom-24 left-72 z-40 max-w-md"
        >
          <div className={cn(
            "rounded-2xl p-5 border shadow-2xl",
            activePopup.category === 'history' && "bg-amber-900/90 border-amber-500/50",
            activePopup.category === 'case-study' && "bg-red-900/90 border-red-500/50",
            activePopup.category === 'flashcard' && "bg-blue-900/90 border-blue-500/50",
            activePopup.category === 'research' && "bg-purple-900/90 border-purple-500/50"
          )}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center",
                  activePopup.category === 'history' && "bg-amber-500/30",
                  activePopup.category === 'case-study' && "bg-red-500/30",
                  activePopup.category === 'flashcard' && "bg-blue-500/30",
                  activePopup.category === 'research' && "bg-purple-500/30"
                )}>
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-white/70 text-xs uppercase tracking-wider">
                    {activePopup.category}
                  </span>
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <Sparkles className="w-3 h-3" />
                    AI Knowledge System
                  </div>
                </div>
              </div>
              <button
                onClick={hidePopup}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            <h3 className="text-white font-bold mb-2">{activePopup.title}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{activePopup.content}</p>

            {activePopup.source && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-white/50 text-xs">Source: {activePopup.source}</span>
                <button className="flex items-center gap-1 text-white/50 text-xs hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" />
                  Learn more
                </button>
              </div>
            )}
          </div>

          {/* Connecting arrow */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 rotate-45 bg-inherit border-r border-b border-inherit" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
