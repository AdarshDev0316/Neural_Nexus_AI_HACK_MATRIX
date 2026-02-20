// ============================================
// PharmaQuest AI - Main Dashboard
// Overview with AI-powered insights
// ============================================

import { motion } from 'framer-motion';
import { 
  Beaker, 
  Atom, 
  Brain, 
  Trophy, 
  TrendingUp, 
  Clock,
  Zap,
  Target,
  BookOpen,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useGameStore, useAnalyticsStore, useRecommendationStore } from '@/store/gameStore';
import { MISSIONS, RESEARCH_TRENDS, DRUG_DATABASE } from '@/data/pharmaData';
import { cn } from '@/utils/cn';

export function Dashboard() {
  const { xp, level, streak, completedMissions, setModule, setMission } = useGameStore();
  const { analytics } = useAnalyticsStore();
  const { recommendations } = useRecommendationStore();

  const xpToNextLevel = (level * 500) - xp;
  const xpProgress = ((xp % 500) / 500) * 100;

  const stats = [
    { label: 'Experiments', value: '24', icon: Beaker, color: 'from-emerald-500 to-teal-500' },
    { label: 'Molecules Built', value: '18', icon: Atom, color: 'from-blue-500 to-indigo-500' },
    { label: 'Quiz Score', value: `${analytics.quizScores[analytics.quizScores.length - 1] || 0}%`, icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Accuracy', value: `${Math.round(analytics.accuracyRate * 100)}%`, icon: Target, color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, Researcher!</h1>
          <p className="text-slate-400 mt-1">Continue your pharmaceutical discovery journey</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Streak */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 rounded-xl border border-orange-500/30">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-white font-bold">{streak}</span>
            <span className="text-orange-300 text-sm">day streak</span>
          </div>
          
          {/* Level & XP */}
          <div className="bg-slate-800 rounded-xl p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-bold">Level {level}</span>
              </div>
              <span className="text-indigo-400 text-sm">{xp} XP</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">{xpToNextLevel} XP to next level</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
          >
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
              stat.color
            )}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">AI-Powered Recommendations</h2>
            <span className="ml-auto px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
              Personalized for you
            </span>
          </div>
          
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <motion.button
                key={rec.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                onClick={() => {
                  if (rec.type === 'mission') {
                    setModule('molecule-builder');
                  }
                }}
                className="w-full flex items-center gap-4 p-4 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors group"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  rec.type === 'mission' && "bg-emerald-500/20 text-emerald-400",
                  rec.type === 'practice' && "bg-blue-500/20 text-blue-400",
                  rec.type === 'learning-path' && "bg-purple-500/20 text-purple-400"
                )}>
                  {rec.type === 'mission' && <Target className="w-5 h-5" />}
                  {rec.type === 'practice' && <Brain className="w-5 h-5" />}
                  {rec.type === 'learning-path' && <BookOpen className="w-5 h-5" />}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium">{rec.title}</h3>
                  <p className="text-slate-400 text-sm">{rec.reason}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Quick Start
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setModule('molecule-builder')}
                className="w-full p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
              >
                Build Molecule
              </button>
              <button
                onClick={() => setModule('virtual-lab')}
                className="w-full p-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Virtual Lab
              </button>
              <button
                onClick={() => setModule('quiz')}
                className="w-full p-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>

          {/* Concept Mastery */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              Concept Mastery
            </h3>
            <div className="space-y-3">
              {Object.entries(analytics.conceptMastery).slice(0, 4).map(([concept, score]) => (
                <div key={concept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{concept}</span>
                    <span className={cn(
                      "font-medium",
                      score >= 0.8 && "text-emerald-400",
                      score >= 0.5 && score < 0.8 && "text-amber-400",
                      score < 0.5 && "text-red-400"
                    )}>{Math.round(score * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        score >= 0.8 && "bg-emerald-500",
                        score >= 0.5 && score < 0.8 && "bg-amber-500",
                        score < 0.5 && "bg-red-500"
                      )}
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Research Trends & Drug Data */}
      <div className="grid grid-cols-2 gap-6">
        {/* Research Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Latest Research Trends
            </h3>
            <span className="text-xs text-slate-400">
              <Clock className="w-3 h-3 inline mr-1" />
              Updated hourly
            </span>
          </div>
          <div className="space-y-3">
            {RESEARCH_TRENDS.map((trend) => (
              <div key={trend.id} className="flex gap-3 p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer">
                <div className={cn(
                  "px-2 py-1 rounded text-xs font-medium shrink-0",
                  trend.category === 'AI/ML' && "bg-blue-500/20 text-blue-400",
                  trend.category === 'Gene Therapy' && "bg-purple-500/20 text-purple-400",
                  trend.category === 'Immunotherapy' && "bg-emerald-500/20 text-emerald-400",
                  trend.category === 'Neurology' && "bg-pink-500/20 text-pink-400"
                )}>
                  {trend.category}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-medium truncate">{trend.title}</h4>
                  <p className="text-slate-400 text-xs truncate">{trend.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FDA Approved Drugs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Beaker className="w-4 h-4 text-blue-400" />
              Pharmaceutical Intelligence
            </h3>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Live Data</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-xs border-b border-slate-700">
                  <th className="text-left pb-2">Drug</th>
                  <th className="text-left pb-2">Indication</th>
                  <th className="text-left pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {DRUG_DATABASE.map((drug) => (
                  <tr key={drug.id} className="border-b border-slate-700/50 hover:bg-slate-800 transition-colors">
                    <td className="py-2">
                      <span className="text-white font-medium">{drug.name}</span>
                      <span className="text-slate-400 text-xs block">{drug.genericName}</span>
                    </td>
                    <td className="py-2 text-slate-300 text-xs">{drug.indication}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                        {drug.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Available Missions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
      >
        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-400" />
          Available Missions
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {MISSIONS.map((mission) => (
            <button
              key={mission.id}
              onClick={() => {
                setMission(mission);
                setModule(mission.type === 'molecule' ? 'molecule-builder' : 'virtual-lab');
              }}
              disabled={completedMissions.includes(mission.id)}
              className={cn(
                "p-4 rounded-xl text-left transition-all",
                completedMissions.includes(mission.id)
                  ? "bg-slate-700/50 opacity-50 cursor-not-allowed"
                  : "bg-slate-800 hover:bg-slate-700 hover:shadow-lg"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  mission.difficulty === 'beginner' && "bg-green-500/20 text-green-400",
                  mission.difficulty === 'intermediate' && "bg-amber-500/20 text-amber-400",
                  mission.difficulty === 'advanced' && "bg-red-500/20 text-red-400"
                )}>
                  {mission.difficulty}
                </span>
                <span className="text-yellow-400 text-sm font-bold">+{mission.xpReward} XP</span>
              </div>
              <h4 className="text-white font-medium">{mission.title}</h4>
              <p className="text-slate-400 text-sm mt-1 line-clamp-2">{mission.description}</p>
              {mission.timeLimit && (
                <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(mission.timeLimit / 60)} min limit
                </p>
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
