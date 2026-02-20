// ============================================
// PharmaQuest AI - Global State Store
// Zustand Store for Game & AI State
// ============================================

import { create } from 'zustand';
import { 
  GameState, 
  MentorState, 
  UserAnalytics, 
  Molecule, 
  Experiment,
  KnowledgeCard,
  MentorMessage,
  ModuleType,
  DifficultyLevel,
  Mission,
  Recommendation,
  Scenario
} from '@/types';

// === GAME STORE ===
interface GameStore extends GameState {
  setModule: (module: ModuleType) => void;
  setDifficulty: (level: DifficultyLevel) => void;
  addXP: (amount: number) => void;
  setMission: (mission: Mission | null) => void;
  completeMission: (missionId: string) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  currentModule: 'dashboard',
  difficulty: 'beginner',
  xp: 0,
  level: 1,
  streak: 0,
  completedMissions: [],
  currentMission: null,

  setModule: (module) => set({ currentModule: module }),
  setDifficulty: (level) => set({ difficulty: level }),
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    return { xp: newXP, level: newLevel };
  }),
  setMission: (mission) => set({ currentMission: mission }),
  completeMission: (missionId) => set((state) => ({
    completedMissions: [...state.completedMissions, missionId]
  })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 })
}));

// === MENTOR STORE ===
interface MentorStore extends MentorState {
  toggleVisibility: () => void;
  setTyping: (isTyping: boolean) => void;
  setMood: (mood: MentorState['currentMood']) => void;
  addMessage: (message: Omit<MentorMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useMentorStore = create<MentorStore>((set) => ({
  isVisible: true,
  isTyping: false,
  currentMood: 'neutral',
  messages: [
    {
      id: 'welcome',
      role: 'mentor',
      content: "Welcome to PharmaQuest AI! I'm Dr. Nova, your AI mentor. I'll guide you through pharmaceutical discoveries, explain complex concepts, and help you master drug development. What would you like to explore today?",
      timestamp: Date.now()
    }
  ],

  toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),
  setTyping: (isTyping) => set({ isTyping }),
  setMood: (mood) => set({ currentMood: mood }),
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, {
      ...message,
      id: `msg_${Date.now()}`,
      timestamp: Date.now()
    }]
  })),
  clearMessages: () => set({ messages: [] })
}));

// === MOLECULE STORE ===
interface MoleculeStore {
  currentMolecule: Molecule | null;
  moleculeLibrary: Molecule[];
  selectedElement: string;
  setCurrentMolecule: (molecule: Molecule | null) => void;
  setSelectedElement: (element: string) => void;
  addToLibrary: (molecule: Molecule) => void;
}

export const useMoleculeStore = create<MoleculeStore>((set) => ({
  currentMolecule: null,
  moleculeLibrary: [],
  selectedElement: 'C',

  setCurrentMolecule: (molecule) => set({ currentMolecule: molecule }),
  setSelectedElement: (element) => set({ selectedElement: element }),
  addToLibrary: (molecule) => set((state) => ({
    moleculeLibrary: [...state.moleculeLibrary, molecule]
  }))
}));

// === EXPERIMENT STORE ===
interface ExperimentStore {
  currentExperiment: Experiment | null;
  experimentHistory: Experiment[];
  setExperiment: (experiment: Experiment | null) => void;
  addStep: (step: Experiment['userSteps'][0]) => void;
  completeExperiment: (score: number, feedback: string) => void;
}

export const useExperimentStore = create<ExperimentStore>((set) => ({
  currentExperiment: null,
  experimentHistory: [],

  setExperiment: (experiment) => set({ currentExperiment: experiment }),
  addStep: (step) => set((state) => {
    if (!state.currentExperiment) return state;
    return {
      currentExperiment: {
        ...state.currentExperiment,
        userSteps: [...state.currentExperiment.userSteps, step]
      }
    };
  }),
  completeExperiment: (score, feedback) => set((state) => {
    if (!state.currentExperiment) return state;
    const completed = {
      ...state.currentExperiment,
      status: 'completed' as const,
      score,
      feedback
    };
    return {
      currentExperiment: null,
      experimentHistory: [...state.experimentHistory, completed]
    };
  })
}));

// === ANALYTICS STORE ===
interface AnalyticsStore {
  analytics: UserAnalytics;
  updateAccuracy: (rate: number) => void;
  addConceptMastery: (concept: string, score: number) => void;
  addQuizScore: (score: number) => void;
  incrementSessionTime: (seconds: number) => void;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  analytics: {
    userId: 'user_demo_001',
    sessionDuration: 0,
    accuracyRate: 0.75,
    conceptMastery: {
      'Molecular Structure': 0.8,
      'Drug Metabolism': 0.6,
      'Pharmacokinetics': 0.7,
      'Clinical Trials': 0.5,
      'Organic Chemistry': 0.85
    },
    experimentSuccess: 0.72,
    quizScores: [85, 92, 78, 88],
    weakConcepts: ['Clinical Trials', 'Drug Metabolism'],
    strongConcepts: ['Organic Chemistry', 'Molecular Structure'],
    engagementLevel: 0.85,
    riskToleranceScore: 0.6
  },

  updateAccuracy: (rate) => set((state) => ({
    analytics: { ...state.analytics, accuracyRate: rate }
  })),
  addConceptMastery: (concept, score) => set((state) => ({
    analytics: {
      ...state.analytics,
      conceptMastery: { ...state.analytics.conceptMastery, [concept]: score }
    }
  })),
  addQuizScore: (score) => set((state) => ({
    analytics: {
      ...state.analytics,
      quizScores: [...state.analytics.quizScores, score]
    }
  })),
  incrementSessionTime: (seconds) => set((state) => ({
    analytics: {
      ...state.analytics,
      sessionDuration: state.analytics.sessionDuration + seconds
    }
  }))
}));

// === KNOWLEDGE STORE ===
interface KnowledgeStore {
  knowledgeCards: KnowledgeCard[];
  activePopup: KnowledgeCard | null;
  showPopup: (card: KnowledgeCard) => void;
  hidePopup: () => void;
}

export const useKnowledgeStore = create<KnowledgeStore>((set) => ({
  knowledgeCards: [],
  activePopup: null,
  showPopup: (card) => set({ activePopup: card }),
  hidePopup: () => set({ activePopup: null })
}));

// === RECOMMENDATION STORE ===
interface RecommendationStore {
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
}

export const useRecommendationStore = create<RecommendationStore>((set) => ({
  recommendations: [
    {
      id: 'rec_1',
      type: 'mission',
      title: 'Build Aspirin Molecule',
      description: 'Master acetylsalicylic acid synthesis',
      reason: 'Strengthens your weak area: Organic Synthesis',
      priority: 1
    },
    {
      id: 'rec_2',
      type: 'practice',
      title: 'Clinical Trial Design Quiz',
      description: 'Practice trial methodology concepts',
      reason: 'Based on your Clinical Trials score (50%)',
      priority: 2
    },
    {
      id: 'rec_3',
      type: 'learning-path',
      title: 'ADME Pathway Module',
      description: 'Deep dive into drug metabolism',
      reason: 'Next step in your learning journey',
      priority: 3
    }
  ],
  setRecommendations: (recs) => set({ recommendations: recs })
}));

// === SCENARIO STORE ===
interface ScenarioStore {
  currentScenario: Scenario | null;
  scenarioHistory: Scenario[];
  setScenario: (scenario: Scenario | null) => void;
  completeScenario: () => void;
}

export const useScenarioStore = create<ScenarioStore>((set) => ({
  currentScenario: null,
  scenarioHistory: [],
  setScenario: (scenario) => set({ currentScenario: scenario }),
  completeScenario: () => set((state) => {
    if (!state.currentScenario) return state;
    return {
      currentScenario: null,
      scenarioHistory: [...state.scenarioHistory, state.currentScenario]
    };
  })
}));
