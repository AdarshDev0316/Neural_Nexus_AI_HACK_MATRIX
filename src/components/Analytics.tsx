// ============================================
// PharmaQuest AI - Performance Analytics
// AI-powered learning insights
// ============================================

import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  Clock,
  Zap,
  Award,
  ChevronUp,
  ChevronDown,
  Activity
} from 'lucide-react';
import { useAnalyticsStore, useGameStore, useExperimentStore } from '@/store/gameStore';
import { cn } from '@/utils/cn';

export function Analytics() {
  const { analytics } = useAnalyticsStore();
  const { xp, level, streak } = useGameStore();
  const { experimentHistory } = useExperimentStore();

  // Calculate trends
  const recentScores = analytics.quizScores.slice(-5);
  const scoreTrend = recentScores.length > 1
    ? recentScores[recentScores.length - 1] - recentScores[0]
    : 0;

  // Mock improvement forecast
  const forecastData = [65, 68, 72, 75, 78, 82, 85, 88];

  const masteryData = Object.entries(analytics.conceptMastery).sort((a, b) => b[1] - a[1]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            Performance Analytics
          </h1>
          <p className="text-slate-400 mt-1">AI-powered insights into your learning journey</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm">
          <Activity className="w-4 h-4" />
          Real-time tracking
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total XP"
          value={xp.toLocaleString()}
          icon={Zap}
          color="yellow"
          change={`Level ${level}`}
          positive
        />
        <MetricCard
          title="Accuracy Rate"
          value={`${Math.round(analytics.accuracyRate * 100)}%`}
          icon={Target}
          color="emerald"
          change="+5% this week"
          positive
        />
        <MetricCard
          title="Study Streak"
          value={`${streak} days`}
          icon={Award}
          color="orange"
          change="Personal best!"
          positive
        />
        <MetricCard
          title="Session Time"
          value={formatDuration(analytics.sessionDuration + 3600)}
          icon={Clock}
          color="blue"
          change="45 min avg"
          positive
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Quiz Performance</h3>
            <div className={cn(
              "flex items-center gap-1 text-sm",
              scoreTrend >= 0 ? "text-emerald-400" : "text-red-400"
            )}>
              {scoreTrend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(scoreTrend)}% trend
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="flex items-end gap-2 h-40">
            {analytics.quizScores.map((score, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-400">{score}%</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${score}%` }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "w-full rounded-t-md",
                    score >= 80 && "bg-emerald-500",
                    score >= 60 && score < 80 && "bg-amber-500",
                    score < 60 && "bg-red-500"
                  )}
                />
                <span className="text-xs text-slate-500">Q{i + 1}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Improvement Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">AI Improvement Forecast</h3>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
              ML Prediction
            </span>
          </div>
          
          {/* Line Chart */}
          <div className="relative h-40">
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 12.5}
                  x2="100"
                  y2={i * 12.5}
                  stroke="#374151"
                  strokeWidth="0.5"
                />
              ))}
              
              {/* Area fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                d={`
                  M 0 ${50 - (forecastData[0] / 2)}
                  ${forecastData.map((d, i) => `L ${i * (100 / (forecastData.length - 1))} ${50 - (d / 2)}`).join(' ')}
                  L 100 50 L 0 50 Z
                `}
                fill="url(#gradient)"
              />
              
              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d={`
                  M 0 ${50 - (forecastData[0] / 2)}
                  ${forecastData.map((d, i) => `L ${i * (100 / (forecastData.length - 1))} ${50 - (d / 2)}`).join(' ')}
                `}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
              
              {/* Points */}
              {forecastData.map((d, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  cx={i * (100 / (forecastData.length - 1))}
                  cy={50 - (d / 2)}
                  r="2"
                  fill="#8b5cf6"
                />
              ))}
              
              {/* Future prediction (dashed) */}
              <line
                x1="62.5"
                y1={50 - 82 / 2}
                x2="87.5"
                y2={50 - 92 / 2}
                stroke="#8b5cf6"
                strokeWidth="2"
                strokeDasharray="2 2"
              />
            </svg>
            
            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500">
              <span>Week 1</span>
              <span>Week 4</span>
              <span>Week 8</span>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 mt-4">
            Based on your learning pattern, AI predicts <span className="text-purple-400 font-medium">92% mastery</span> in 8 weeks.
          </p>
        </motion.div>
      </div>

      {/* Concept Mastery Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Concept Mastery Heatmap
          </h3>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500" /> Weak
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-amber-500" /> Developing
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-500" /> Strong
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {masteryData.map(([concept, score], i) => (
            <motion.div
              key={concept}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex items-center gap-4"
            >
              <div className="w-40 text-sm text-slate-300 truncate">{concept}</div>
              <div className="flex-1 h-6 bg-slate-700 rounded-lg overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                  className={cn(
                    "h-full rounded-lg",
                    score >= 0.8 && "bg-gradient-to-r from-emerald-500 to-emerald-400",
                    score >= 0.5 && score < 0.8 && "bg-gradient-to-r from-amber-500 to-amber-400",
                    score < 0.5 && "bg-gradient-to-r from-red-500 to-red-400"
                  )}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {Math.round(score * 100)}%
                </span>
              </div>
              <div className={cn(
                "w-16 text-xs font-medium text-right",
                score >= 0.8 && "text-emerald-400",
                score >= 0.5 && score < 0.8 && "text-amber-400",
                score < 0.5 && "text-red-400"
              )}>
                {score >= 0.8 && "Strong"}
                {score >= 0.5 && score < 0.8 && "Growing"}
                {score < 0.5 && "Practice"}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Weak Concepts Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl p-5"
        >
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <ChevronDown className="w-5 h-5 text-red-400" />
            Focus Areas
          </h3>
          <div className="space-y-2">
            {analytics.weakConcepts.map((concept) => (
              <div key={concept} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-red-200">{concept}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-300/70 mt-3">AI suggests focusing on these areas</p>
        </motion.div>

        {/* Strong Concepts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-5"
        >
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <ChevronUp className="w-5 h-5 text-emerald-400" />
            Strengths
          </h3>
          <div className="space-y-2">
            {analytics.strongConcepts.map((concept) => (
              <div key={concept} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-200">{concept}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-300/70 mt-3">Keep up the excellent work!</p>
        </motion.div>

        {/* Experiment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800 border border-slate-700 rounded-xl p-5"
        >
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-blue-400" />
            Recent Experiments
          </h3>
          {experimentHistory.length === 0 ? (
            <p className="text-slate-400 text-sm">No experiments completed yet</p>
          ) : (
            <div className="space-y-2">
              {experimentHistory.slice(-3).map((exp) => (
                <div key={exp.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{exp.name}</span>
                  <span className={cn(
                    "font-medium",
                    (exp.score || 0) >= 80 && "text-emerald-400",
                    (exp.score || 0) >= 50 && (exp.score || 0) < 80 && "text-amber-400",
                    (exp.score || 0) < 50 && "text-red-400"
                  )}>
                    {exp.score}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: 'yellow' | 'emerald' | 'orange' | 'blue' | 'purple';
  change: string;
  positive: boolean;
}

function MetricCard({ title, value, icon: Icon, color, change, positive }: MetricCardProps) {
  const colorClasses = {
    yellow: 'from-yellow-500 to-amber-500',
    emerald: 'from-emerald-500 to-teal-500',
    orange: 'from-orange-500 to-red-500',
    blue: 'from-blue-500 to-indigo-500',
    purple: 'from-purple-500 to-pink-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4"
    >
      <div className={cn(
        "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-3",
        colorClasses[color]
      )}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-slate-400 text-sm">{title}</p>
      <div className={cn(
        "text-xs mt-2 flex items-center gap-1",
        positive ? "text-emerald-400" : "text-red-400"
      )}>
        {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </motion.div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}
