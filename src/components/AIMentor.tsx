// ============================================
// PharmaQuest AI - AI Mentor Avatar Component
// Real-time conversational AI with animations
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Brain, Lightbulb } from 'lucide-react';
import { useMentorStore, useGameStore } from '@/store/gameStore';
import { eventDispatcher } from '@/services/EventDispatcher';
import { cn } from '@/utils/cn';

export function AIMentor() {
  const { 
    isVisible, 
    isTyping, 
    currentMood, 
    messages, 
    toggleVisibility, 
    setTyping, 
    setMood,
    addMessage 
  } = useMentorStore();
  
  const { currentModule, difficulty } = useGameStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to AI events
  useEffect(() => {
    const unsubHint = eventDispatcher.onResponse('hint_event', (response) => {
      setTyping(false);
      setMood('neutral');
      addMessage({ role: 'mentor', content: response.content });
    });

    const unsubExplain = eventDispatcher.onResponse('explain_event', (response) => {
      setTyping(false);
      setMood('happy');
      addMessage({ role: 'mentor', content: response.content });
    });

    return () => {
      unsubHint();
      unsubExplain();
    };
  }, [setTyping, setMood, addMessage]);

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage({ role: 'user', content: input });
    setTyping(true);
    setMood('neutral');

    // Dispatch to AI layer
    eventDispatcher.dispatch({
      type: 'hint_event',
      payload: { 
        query: input, 
        context: currentModule,
        difficulty 
      },
      timestamp: Date.now(),
      source: 'user_chat',
      priority: 'medium'
    });

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! In pharmaceutical chemistry, we often see this pattern...",
        "Let me explain this concept step by step. First, consider the molecular interactions...",
        "Excellent thinking! This relates to the principles of drug-receptor binding...",
        "I see you're curious about that. Here's what the research tells us...",
        "Great observation! This is actually a key concept in pharmacokinetics...",
      ];
      
      setTyping(false);
      setMood('happy');
      addMessage({ 
        role: 'mentor', 
        content: responses[Math.floor(Math.random() * responses.length)] 
      });
    }, 1500);

    setInput('');
  };

  const moodColors = {
    neutral: 'from-blue-500 to-indigo-600',
    happy: 'from-emerald-500 to-teal-600',
    concerned: 'from-amber-500 to-orange-600',
    excited: 'from-purple-500 to-pink-600'
  };

  const moodEmojis = {
    neutral: '🧑‍🔬',
    happy: '😊',
    concerned: '🤔',
    excited: '🎉'
  };

  if (!isVisible) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={toggleVisibility}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:shadow-xl transition-shadow"
      >
        <Bot className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.8 }}
      className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className={cn(
        "p-4 bg-gradient-to-r flex items-center gap-3",
        moodColors[currentMood]
      )}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            {moodEmojis[currentMood]}
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1 rounded-full border-2 border-dashed border-white/30"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white flex items-center gap-2">
            Dr. Nova <Sparkles className="w-4 h-4" />
          </h3>
          <p className="text-white/70 text-sm">AI Mentor • {difficulty} mode</p>
        </div>
        <button 
          onClick={toggleVisibility}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* AI Capabilities Bar */}
      <div className="px-4 py-2 bg-slate-800/50 flex gap-2 overflow-x-auto text-xs">
        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full flex items-center gap-1">
          <Brain className="w-3 h-3" /> Adaptive
        </span>
        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> Context-Aware
        </span>
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Real-time
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === 'user' && "flex-row-reverse"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
                msg.role === 'mentor' 
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                  : "bg-slate-700 text-slate-300"
              )}>
                {msg.role === 'mentor' ? '🧑‍🔬' : '👤'}
              </div>
              <div className={cn(
                "max-w-[75%] p-3 rounded-2xl text-sm",
                msg.role === 'mentor'
                  ? "bg-slate-800 text-slate-200 rounded-tl-sm"
                  : "bg-indigo-600 text-white rounded-tr-sm"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm">
              🧑‍🔬
            </div>
            <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-indigo-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Dr. Nova anything..."
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 px-4 py-2 rounded-xl border border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
