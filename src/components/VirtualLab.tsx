// ============================================
// PharmaQuest AI - Virtual Lab Simulation
// Experiment Simulation with AI Feedback
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical,
  Thermometer,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Beaker,
  Scale,
  Droplet
} from 'lucide-react';
import { useExperimentStore, useGameStore, useMentorStore } from '@/store/gameStore';
import { eventDispatcher } from '@/services/EventDispatcher';
import { EXPERIMENT_PROTOCOLS } from '@/data/pharmaData';
import { cn } from '@/utils/cn';

interface Chemical {
  id: string;
  name: string;
  color: string;
  icon: 'flask' | 'beaker' | 'droplet';
}

const CHEMICALS: Chemical[] = [
  { id: 'salicylic', name: 'Salicylic Acid', color: '#ffffff', icon: 'flask' },
  { id: 'acetic', name: 'Acetic Anhydride', color: '#a5f3fc', icon: 'beaker' },
  { id: 'phosphoric', name: 'Phosphoric Acid', color: '#fef08a', icon: 'droplet' },
  { id: 'water', name: 'Distilled Water', color: '#93c5fd', icon: 'droplet' },
  { id: 'ethanol', name: 'Ethanol', color: '#c4b5fd', icon: 'flask' },
  { id: 'hcl', name: 'Hydrochloric Acid', color: '#fca5a5', icon: 'droplet' },
];

export function VirtualLab() {
  const { currentExperiment, setExperiment, completeExperiment } = useExperimentStore();
  const { addXP } = useGameStore();
  const { addMessage } = useMentorStore();

  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [dosage, setDosage] = useState(1);
  const [temperature, setTemperature] = useState(25);
  const [isHeating, setIsHeating] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [vesselContents, setVesselContents] = useState<{ chemical: Chemical; amount: number }[]>([]);
  const [stepLog, setStepLog] = useState<{ action: string; correct: boolean; time: number }[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);
  const [experimentComplete, setExperimentComplete] = useState(false);

  // Initialize experiment
  useEffect(() => {
    if (!currentExperiment) {
      setExperiment({
        id: 'exp_' + Date.now(),
        name: 'Aspirin Synthesis',
        description: 'Synthesize acetylsalicylic acid from salicylic acid',
        idealProtocol: EXPERIMENT_PROTOCOLS.aspirin_synthesis.steps.map(s => ({
          id: s.id,
          action: s.action,
          chemical: s.chemical,
          dosage: s.dosage,
          duration: s.duration
        })),
        userSteps: [],
        status: 'in-progress'
      });
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Temperature change when heating
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isHeating && temperature < 100) {
      interval = setInterval(() => {
        setTemperature(t => Math.min(t + 1, 100));
      }, 200);
    } else if (!isHeating && temperature > 25) {
      interval = setInterval(() => {
        setTemperature(t => Math.max(t - 0.5, 25));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isHeating, temperature]);

  const addChemicalToVessel = () => {
    if (!selectedChemical) return;

    setVesselContents(prev => {
      const existing = prev.find(c => c.chemical.id === selectedChemical.id);
      if (existing) {
        return prev.map(c =>
          c.chemical.id === selectedChemical.id
            ? { ...c, amount: c.amount + dosage }
            : c
        );
      }
      return [...prev, { chemical: selectedChemical, amount: dosage }];
    });

    const step = {
      action: `Added ${dosage}ml of ${selectedChemical.name}`,
      correct: checkStepCorrectness('add', selectedChemical.name),
      time: timer
    };
    setStepLog(prev => [...prev, step]);

    // Dispatch AI feedback event
    eventDispatcher.dispatch({
      type: 'feedback_event',
      payload: {
        action: 'add_chemical',
        chemical: selectedChemical.name,
        amount: dosage,
        stepIndex: stepLog.length
      },
      timestamp: Date.now(),
      source: 'virtual_lab',
      priority: 'medium'
    });

    if (!step.correct) {
      setFeedback({
        type: 'warning',
        message: `⚠️ Check your protocol - the order or amount might not be optimal.`
      });
    } else {
      setFeedback({
        type: 'success',
        message: `✅ Correct step! ${selectedChemical.name} added successfully.`
      });
      addXP(10);
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  const checkStepCorrectness = (action: string, chemical?: string): boolean => {
    const protocol = EXPERIMENT_PROTOCOLS.aspirin_synthesis.steps;
    const currentStepIndex = stepLog.length;
    
    if (currentStepIndex >= protocol.length) return false;
    
    const expectedStep = protocol[currentStepIndex];
    if (action === 'add' && expectedStep.chemical) {
      return expectedStep.chemical.toLowerCase().includes(chemical?.toLowerCase().split(' ')[0] || '');
    }
    return true;
  };

  const heatVessel = () => {
    setIsHeating(!isHeating);
    const step = {
      action: isHeating ? 'Stopped heating' : 'Started heating',
      correct: true,
      time: timer
    };
    setStepLog(prev => [...prev, step]);
  };

  const completeExperimentHandler = () => {
    const correctSteps = stepLog.filter(s => s.correct).length;
    const totalSteps = stepLog.length;
    const accuracy = totalSteps > 0 ? correctSteps / totalSteps : 0;
    const score = Math.round(accuracy * 100);

    eventDispatcher.dispatch({
      type: 'feedback_event',
      payload: {
        accuracy,
        totalSteps,
        correctSteps
      },
      timestamp: Date.now(),
      source: 'virtual_lab',
      priority: 'high'
    });

    let feedbackMessage = '';
    if (score >= 90) {
      feedbackMessage = '🎉 Outstanding! Your experimental technique is excellent!';
      addXP(200);
    } else if (score >= 70) {
      feedbackMessage = '👍 Good work! Some minor deviations from protocol.';
      addXP(100);
    } else if (score >= 50) {
      feedbackMessage = '📊 Acceptable results. Review the protocol steps.';
      addXP(50);
    } else {
      feedbackMessage = '⚠️ Results need improvement. Would you like guidance?';
      addXP(25);
    }

    addMessage({
      role: 'mentor',
      content: feedbackMessage + ` Score: ${score}%. Steps completed: ${totalSteps}.`
    });

    setExperimentComplete(true);
    completeExperiment(score, feedbackMessage);
  };

  const resetExperiment = () => {
    setVesselContents([]);
    setStepLog([]);
    setTimer(0);
    setTemperature(25);
    setIsHeating(false);
    setIsTimerRunning(false);
    setExperimentComplete(false);
    setFeedback(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex bg-slate-900">
      {/* Experiment Info Panel */}
      <div className="w-72 bg-slate-800 border-r border-slate-700 p-4 flex flex-col">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-emerald-400" />
          {currentExperiment?.name || 'Virtual Lab'}
        </h2>

        <p className="text-slate-400 text-sm mb-4">
          {currentExperiment?.description || 'Select an experiment to begin'}
        </p>

        {/* Protocol Steps */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-sm font-medium text-slate-300 mb-2">Protocol Steps</h3>
          <div className="space-y-2">
            {EXPERIMENT_PROTOCOLS.aspirin_synthesis.steps.map((step, i) => (
              <div
                key={step.id}
                className={cn(
                  "p-2 rounded-lg text-xs",
                  i < stepLog.length
                    ? stepLog[i].correct
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                    : i === stepLog.length
                    ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500"
                    : "bg-slate-700/50 text-slate-400"
                )}
              >
                <span className="font-medium">Step {i + 1}:</span> {step.action}
                {step.dosage && <span className="opacity-70"> ({step.dosage}ml)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-white">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span className="font-mono text-lg">{formatTime(timer)}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                {isTimerRunning ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
              </button>
              <button
                onClick={resetExperiment}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <button
            onClick={completeExperimentHandler}
            disabled={stepLog.length === 0 || experimentComplete}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            {experimentComplete ? 'Completed!' : 'Finish Experiment'}
          </button>
        </div>
      </div>

      {/* Main Lab Area */}
      <div className="flex-1 p-6">
        <div className="h-full flex flex-col">
          {/* Chemical Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2">Chemicals</h3>
            <div className="flex gap-2 flex-wrap">
              {CHEMICALS.map((chem) => (
                <button
                  key={chem.id}
                  onClick={() => setSelectedChemical(chem)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all",
                    selectedChemical?.id === chem.id
                      ? "bg-indigo-500 text-white ring-2 ring-indigo-400"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  )}
                >
                  {chem.icon === 'flask' && <FlaskConical className="w-4 h-4" />}
                  {chem.icon === 'beaker' && <Beaker className="w-4 h-4" />}
                  {chem.icon === 'droplet' && <Droplet className="w-4 h-4" />}
                  {chem.name}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 mb-4">
            {/* Dosage */}
            <div className="bg-slate-800 rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                <Scale className="w-4 h-4" />
                Dosage (ml)
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={dosage}
                  onChange={(e) => setDosage(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="text-white font-mono w-12 text-right">{dosage.toFixed(1)}</span>
              </div>
            </div>

            {/* Temperature */}
            <div className="bg-slate-800 rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-2">
                <Thermometer className="w-4 h-4" />
                Temperature (°C)
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${temperature}%` }}
                    className={cn(
                      "h-full transition-colors",
                      temperature < 40 && "bg-blue-500",
                      temperature >= 40 && temperature < 70 && "bg-amber-500",
                      temperature >= 70 && "bg-red-500"
                    )}
                  />
                </div>
                <span className={cn(
                  "font-mono w-12 text-right",
                  temperature < 40 && "text-blue-400",
                  temperature >= 40 && temperature < 70 && "text-amber-400",
                  temperature >= 70 && "text-red-400"
                )}>
                  {Math.round(temperature)}°
                </span>
              </div>
            </div>

            {/* Heat Control */}
            <button
              onClick={heatVessel}
              className={cn(
                "px-6 rounded-xl font-medium transition-all flex items-center gap-2",
                isHeating
                  ? "bg-red-500 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              )}
            >
              <Thermometer className="w-5 h-5" />
              {isHeating ? 'Stop Heat' : 'Heat'}
            </button>

            {/* Add Chemical */}
            <button
              onClick={addChemicalToVessel}
              disabled={!selectedChemical}
              className="px-6 bg-indigo-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors flex items-center gap-2"
            >
              <Droplet className="w-5 h-5" />
              Add to Vessel
            </button>
          </div>

          {/* Reaction Vessel */}
          <div className="flex-1 bg-slate-800 rounded-2xl p-6 relative overflow-hidden">
            {/* Vessel Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Beaker */}
                <svg width="200" height="250" viewBox="0 0 200 250" className="opacity-30">
                  <path
                    d="M40 50 L40 200 Q40 230 70 230 L130 230 Q160 230 160 200 L160 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                  <path
                    d="M30 50 L170 50"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  />
                </svg>

                {/* Liquid Contents */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] rounded-b-3xl transition-all duration-500"
                  style={{
                    height: `${Math.min(vesselContents.reduce((sum, c) => sum + c.amount * 10, 0), 150)}px`,
                    background: vesselContents.length > 0
                      ? `linear-gradient(to top, ${vesselContents.map(c => c.chemical.color).join(', ')})`
                      : 'transparent',
                    opacity: 0.7
                  }}
                />

                {/* Bubbles when heating */}
                <AnimatePresence>
                  {isHeating && temperature > 50 && (
                    <>
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 0, opacity: 0 }}
                          animate={{ y: -100, opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          className="absolute bottom-20 w-3 h-3 bg-white/30 rounded-full"
                          style={{ left: 80 + i * 10 }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Vessel Contents List */}
            <div className="absolute top-4 left-4 bg-slate-900/80 rounded-lg p-3 min-w-[200px]">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Vessel Contents</h4>
              {vesselContents.length === 0 ? (
                <p className="text-slate-500 text-xs">Empty - add chemicals to begin</p>
              ) : (
                <div className="space-y-1">
                  {vesselContents.map((content) => (
                    <div key={content.chemical.id} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: content.chemical.color }}
                      />
                      <span className="text-white">{content.chemical.name}</span>
                      <span className="text-slate-400 ml-auto">{content.amount.toFixed(1)}ml</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Toast */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "absolute bottom-4 right-4 px-4 py-3 rounded-xl flex items-center gap-2",
                    feedback.type === 'success' && "bg-emerald-500/90",
                    feedback.type === 'warning' && "bg-amber-500/90",
                    feedback.type === 'error' && "bg-red-500/90"
                  )}
                >
                  {feedback.type === 'success' && <CheckCircle className="w-5 h-5 text-white" />}
                  {feedback.type === 'warning' && <AlertTriangle className="w-5 h-5 text-white" />}
                  {feedback.type === 'error' && <XCircle className="w-5 h-5 text-white" />}
                  <span className="text-white text-sm">{feedback.message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Log */}
            <div className="absolute top-4 right-4 bg-slate-900/80 rounded-lg p-3 max-w-[250px] max-h-[200px] overflow-y-auto">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Action Log</h4>
              {stepLog.length === 0 ? (
                <p className="text-slate-500 text-xs">No actions yet</p>
              ) : (
                <div className="space-y-1">
                  {stepLog.slice(-5).map((step, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-xs px-2 py-1 rounded",
                        step.correct ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      )}
                    >
                      [{formatTime(step.time)}] {step.action}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
