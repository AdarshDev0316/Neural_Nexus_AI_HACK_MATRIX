// ============================================
// PharmaQuest AI - Research Hub
// Pharmaceutical Intelligence Dashboard
// ============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  TrendingUp,
  ExternalLink,
  Database,
  Leaf,
  ArrowRight,
  Sparkles,
  Filter,
  RefreshCw
} from 'lucide-react';
import { AYURVEDA_COMPOUNDS, DRUG_DATABASE, RESEARCH_TRENDS, KNOWLEDGE_CARDS } from '@/data/pharmaData';
import { cn } from '@/utils/cn';

export function ResearchHub() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'trends' | 'drugs' | 'ayurveda' | 'knowledge'>('trends');

  const filteredCompounds = AYURVEDA_COMPOUNDS.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.plantSource.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrugs = DRUG_DATABASE.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.genericName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Research Hub
          </h1>
          <p className="text-slate-400 mt-1">Pharmaceutical Intelligence Engine</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search compounds, drugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'trends', label: 'Research Trends', icon: TrendingUp },
          { id: 'drugs', label: 'Drug Database', icon: Database },
          { id: 'ayurveda', label: 'Ayurveda Bridge', icon: Leaf },
          { id: 'knowledge', label: 'Knowledge Base', icon: Sparkles }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Research Trends Tab */}
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {RESEARCH_TRENDS.map((trend, i) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    trend.category === 'AI/ML' && "bg-blue-500/20 text-blue-400",
                    trend.category === 'Gene Therapy' && "bg-purple-500/20 text-purple-400",
                    trend.category === 'Immunotherapy' && "bg-emerald-500/20 text-emerald-400",
                    trend.category === 'Neurology' && "bg-pink-500/20 text-pink-400"
                  )}>
                    {trend.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-white font-medium mb-2">{trend.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{trend.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{trend.source}</span>
                  <span>{trend.date}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Drug Database Tab */}
        {activeTab === 'drugs' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-slate-900">
                <tr className="text-left text-sm text-slate-400">
                  <th className="p-4">Drug Name</th>
                  <th className="p-4">Generic Name</th>
                  <th className="p-4">Indication</th>
                  <th className="p-4">Manufacturer</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrugs.map((drug, i) => (
                  <motion.tr
                    key={drug.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-slate-700 hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-white font-medium">{drug.name}</span>
                    </td>
                    <td className="p-4 text-slate-300">{drug.genericName}</td>
                    <td className="p-4 text-slate-400 text-sm">{drug.indication}</td>
                    <td className="p-4 text-slate-400 text-sm">{drug.manufacturer}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {drug.approvalStatus}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Ayurveda Bridge Tab */}
        {activeTab === 'ayurveda' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Ayurveda–Modern Medicine Bridge AI</h3>
                  <p className="text-emerald-300/70 text-sm">Connecting traditional wisdom with modern pharmacology</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm">
                This AI module performs compound similarity matching and semantic search to connect
                Ayurvedic plant compounds with their modern pharmaceutical equivalents.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {filteredCompounds.map((compound, i) => (
                <motion.div
                  key={compound.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-white font-medium">{compound.name}</h3>
                    <span className="text-xs text-slate-500 font-mono">{compound.chemicalStructure}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-400">Source:</span>
                      <span className="text-emerald-300">{compound.plantSource}</span>
                    </div>
                    {compound.modernEquivalent && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-400">Modern:</span>
                        <span className="text-blue-300">{compound.modernEquivalent}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {compound.therapeuticUses.slice(0, 3).map((use) => (
                      <span
                        key={use}
                        className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                      >
                        {use}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="text-xs text-slate-400 mb-2">Active Ingredients</h4>
                    <div className="flex flex-wrap gap-1">
                      {compound.activeIngredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 rounded text-xs"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'knowledge' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-4"
          >
            {KNOWLEDGE_CARDS.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-xl p-5 border",
                  card.category === 'history' && "bg-amber-900/20 border-amber-500/30",
                  card.category === 'case-study' && "bg-red-900/20 border-red-500/30",
                  card.category === 'flashcard' && "bg-blue-900/20 border-blue-500/30",
                  card.category === 'research' && "bg-purple-900/20 border-purple-500/30"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium capitalize",
                    card.category === 'history' && "bg-amber-500/20 text-amber-400",
                    card.category === 'case-study' && "bg-red-500/20 text-red-400",
                    card.category === 'flashcard' && "bg-blue-500/20 text-blue-400",
                    card.category === 'research' && "bg-purple-500/20 text-purple-400"
                  )}>
                    {card.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Sparkles className="w-3 h-3" />
                    {Math.round(card.relevance * 100)}% relevant
                  </div>
                </div>

                <h3 className="text-white font-medium mb-2">{card.title}</h3>
                <p className="text-slate-300 text-sm">{card.content}</p>

                {card.source && (
                  <p className="text-xs text-slate-500 mt-3">Source: {card.source}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
