// ============================================
// PharmaQuest AI - Quiz Arena
// Adaptive quiz system with AI feedback
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Trophy,
  ArrowRight,
  RotateCcw,
  Lightbulb
} from 'lucide-react';
import { useGameStore, useAnalyticsStore, useMentorStore } from '@/store/gameStore';
import { eventDispatcher } from '@/services/EventDispatcher';
import { cn } from '@/utils/cn';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'What does ADME stand for in pharmacokinetics?',
    options: [
      'Absorption, Distribution, Metabolism, Excretion',
      'Analysis, Detection, Monitoring, Evaluation',
      'Active Drug Mechanism Effects',
      'Adverse Drug Metabolic Events'
    ],
    correct: 0,
    explanation: 'ADME describes the four key processes that determine drug concentration and kinetics in the body.',
    difficulty: 'easy',
    category: 'Pharmacokinetics'
  },
  {
    id: 'q2',
    question: 'Which rule helps predict oral bioavailability of drug candidates?',
    options: [
      'Henderson-Hasselbalch equation',
      'Lipinski\'s Rule of Five',
      'Michaelis-Menten kinetics',
      'Beer-Lambert law'
    ],
    correct: 1,
    explanation: 'Lipinski\'s Rule of Five predicts that poor absorption is more likely when: MW > 500, LogP > 5, HBD > 5, HBA > 10.',
    difficulty: 'medium',
    category: 'Drug Design'
  },
  {
    id: 'q3',
    question: 'What is the primary mechanism of action of Aspirin?',
    options: [
      'Selective COX-2 inhibition',
      'Irreversible COX-1 and COX-2 inhibition',
      'Competitive antagonism of histamine receptors',
      'Inhibition of phosphodiesterase'
    ],
    correct: 1,
    explanation: 'Aspirin irreversibly acetylates cyclooxygenase enzymes, blocking prostaglandin and thromboxane synthesis.',
    difficulty: 'medium',
    category: 'Pharmacology'
  },
  {
    id: 'q4',
    question: 'In a Phase III clinical trial, what is the primary objective?',
    options: [
      'Determine maximum tolerated dose',
      'Establish pharmacokinetic profile',
      'Confirm efficacy and monitor adverse effects',
      'Identify drug-drug interactions'
    ],
    correct: 2,
    explanation: 'Phase III trials are large-scale studies that confirm therapeutic efficacy and identify adverse reactions in diverse patient populations.',
    difficulty: 'medium',
    category: 'Clinical Trials'
  },
  {
    id: 'q5',
    question: 'Which cytochrome P450 enzyme metabolizes approximately 50% of all drugs?',
    options: [
      'CYP1A2',
      'CYP2D6',
      'CYP3A4',
      'CYP2C9'
    ],
    correct: 2,
    explanation: 'CYP3A4 is the most abundant CYP enzyme in the liver and intestine, metabolizing about 50% of marketed drugs.',
    difficulty: 'hard',
    category: 'Drug Metabolism'
  }
];

export function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const { addXP } = useGameStore();
  const { addQuizScore, addConceptMastery } = useAnalyticsStore();
  const { addMessage } = useMentorStore();

  const currentQuestion = QUESTIONS[currentIndex];

  // Timer
  useEffect(() => {
    if (isAnswered || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeout();
          return 30;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isComplete]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      eventDispatcher.dispatch({
        type: 'feedback_event',
        payload: { result: 'timeout', question: currentQuestion.id },
        timestamp: Date.now(),
        source: 'quiz',
        priority: 'medium'
      });
    }
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correct;

    if (isCorrect) {
      const xpGain = currentQuestion.difficulty === 'easy' ? 20 : currentQuestion.difficulty === 'medium' ? 35 : 50;
      setScore((s) => s + 1);
      addXP(xpGain);
    }

    // Update concept mastery
    const currentMastery = 0.5;
    const newMastery = isCorrect ? Math.min(currentMastery + 0.1, 1) : Math.max(currentMastery - 0.05, 0);
    addConceptMastery(currentQuestion.category, newMastery);

    // Dispatch AI event
    eventDispatcher.dispatch({
      type: 'feedback_event',
      payload: {
        result: isCorrect ? 'correct' : 'incorrect',
        question: currentQuestion.id,
        category: currentQuestion.category
      },
      timestamp: Date.now(),
      source: 'quiz',
      priority: 'medium'
    });
  };

  const nextQuestion = () => {
    if (currentIndex >= QUESTIONS.length - 1) {
      const finalScore = Math.round((score / QUESTIONS.length) * 100);
      addQuizScore(finalScore);
      setIsComplete(true);

      // AI feedback
      let feedback = '';
      if (finalScore >= 80) {
        feedback = `🎉 Excellent performance! You scored ${finalScore}%. Your knowledge of pharmaceutical concepts is strong!`;
      } else if (finalScore >= 60) {
        feedback = `👍 Good effort! You scored ${finalScore}%. Keep practicing to strengthen weak areas.`;
      } else {
        feedback = `📚 You scored ${finalScore}%. Let's review the concepts together. I'm here to help!`;
      }

      addMessage({ role: 'mentor', content: feedback });
      
      eventDispatcher.dispatch({
        type: 'adapt_event',
        payload: { performance: finalScore / 100 },
        timestamp: Date.now(),
        source: 'quiz',
        priority: 'high'
      });
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
      setShowHint(false);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(30);
    setIsComplete(false);
    setShowHint(false);
  };

  const requestHint = () => {
    setShowHint(true);
    eventDispatcher.dispatch({
      type: 'hint_event',
      payload: { context: 'quiz', question: currentQuestion.id },
      timestamp: Date.now(),
      source: 'quiz',
      priority: 'medium'
    });
  };

  if (isComplete) {
    const finalScore = Math.round((score / QUESTIONS.length) * 100);
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center border border-slate-700"
        >
          <div className={cn(
            "w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center",
            finalScore >= 80 && "bg-emerald-500",
            finalScore >= 60 && finalScore < 80 && "bg-amber-500",
            finalScore < 60 && "bg-red-500"
          )}>
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-6">Here's how you performed</p>

          <div className="bg-slate-900 rounded-xl p-4 mb-6">
            <div className="text-4xl font-bold text-white mb-1">{finalScore}%</div>
            <div className="text-slate-400">
              {score} / {QUESTIONS.length} correct
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-emerald-400 font-bold">{score}</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="text-red-400 font-bold">{QUESTIONS.length - score}</div>
              <div className="text-xs text-slate-400">Incorrect</div>
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Quiz Arena
          </h2>
          <p className="text-slate-400 text-sm">Test your pharmaceutical knowledge</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold">{score}</span>
            <span className="text-slate-400">/ {QUESTIONS.length}</span>
          </div>

          {/* Timer */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl",
            timeLeft <= 10 ? "bg-red-500/20 text-red-400" : "bg-slate-800 text-white"
          )}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 h-2 rounded-full",
              i < currentIndex && "bg-emerald-500",
              i === currentIndex && "bg-indigo-500",
              i > currentIndex && "bg-slate-700"
            )}
          />
        ))}
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex flex-col"
      >
        {/* Question */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn(
              "px-2 py-1 rounded text-xs font-medium",
              currentQuestion.difficulty === 'easy' && "bg-green-500/20 text-green-400",
              currentQuestion.difficulty === 'medium' && "bg-amber-500/20 text-amber-400",
              currentQuestion.difficulty === 'hard' && "bg-red-500/20 text-red-400"
            )}>
              {currentQuestion.difficulty}
            </span>
            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
              {currentQuestion.category}
            </span>
          </div>
          <h3 className="text-xl text-white font-medium">
            {currentQuestion.question}
          </h3>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 mb-4"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-indigo-300 font-medium text-sm">AI Hint</h4>
                  <p className="text-indigo-200/80 text-sm mt-1">
                    Think about the fundamental principles. The correct answer relates to core pharmacokinetic concepts.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {currentQuestion.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === currentQuestion.correct;
            const showResult = isAnswered;

            return (
              <motion.button
                key={i}
                whileHover={!isAnswered ? { scale: 1.02 } : {}}
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleAnswer(i)}
                disabled={isAnswered}
                className={cn(
                  "p-4 rounded-xl text-left transition-all border-2 flex items-start gap-3",
                  !showResult && "bg-slate-800 border-slate-700 hover:border-indigo-500 text-white",
                  showResult && isCorrect && "bg-emerald-500/20 border-emerald-500 text-emerald-100",
                  showResult && isSelected && !isCorrect && "bg-red-500/20 border-red-500 text-red-100",
                  showResult && !isSelected && !isCorrect && "bg-slate-800/50 border-slate-700 text-slate-400",
                  isAnswered && "cursor-default"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold",
                  !showResult && "bg-slate-700 text-slate-300",
                  showResult && isCorrect && "bg-emerald-500 text-white",
                  showResult && isSelected && !isCorrect && "bg-red-500 text-white",
                  showResult && !isSelected && !isCorrect && "bg-slate-700 text-slate-500"
                )}>
                  {showResult && isCorrect ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : showResult && isSelected && !isCorrect ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-slate-800 rounded-xl p-4 border border-slate-700"
            >
              <h4 className="text-white font-medium mb-2">Explanation</h4>
              <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between items-center mt-4">
          {!isAnswered && (
            <button
              onClick={requestHint}
              disabled={showHint}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-indigo-500/30 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Get Hint
            </button>
          )}
          
          {isAnswered && (
            <div /> // Spacer
          )}

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={nextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              {currentIndex >= QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
