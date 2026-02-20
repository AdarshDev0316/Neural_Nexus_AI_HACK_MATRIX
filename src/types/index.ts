// ============================================
// PharmaQuest AI - Type Definitions
// Multi-Layer Architecture Types
// ============================================

// === GAME ENGINE TYPES ===
export interface GameState {
  currentModule: ModuleType;
  difficulty: DifficultyLevel;
  xp: number;
  level: number;
  streak: number;
  completedMissions: string[];
  currentMission: Mission | null;
}

export type ModuleType = 'dashboard' | 'molecule-builder' | 'virtual-lab' | 'quiz' | 'research-hub' | 'analytics';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'molecule' | 'experiment' | 'quiz' | 'research';
  difficulty: DifficultyLevel;
  xpReward: number;
  objectives: Objective[];
  timeLimit?: number;
}

export interface Objective {
  id: string;
  description: string;
  completed: boolean;
}

// === MOLECULE TYPES ===
export interface Atom {
  id: string;
  element: string;
  symbol: string;
  color: string;
  position: { x: number; y: number; z: number };
  bonds: string[];
}

export interface Bond {
  id: string;
  atom1: string;
  atom2: string;
  type: 'single' | 'double' | 'triple';
}

export interface Molecule {
  id: string;
  name: string;
  formula: string;
  atoms: Atom[];
  bonds: Bond[];
  properties: MoleculeProperties;
}

export interface MoleculeProperties {
  molecularWeight: number;
  solubility: string;
  bioavailability: string;
  toxicity: string;
}

// === AI EVENT TYPES ===
export type AIEventType = 
  | 'hint_event'
  | 'explain_event'
  | 'knowledge_event'
  | 'feedback_event'
  | 'adapt_event'
  | 'recommend_event'
  | 'scenario_event';

export interface AIEvent {
  type: AIEventType;
  payload: Record<string, unknown>;
  timestamp: number;
  source: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AIResponse {
  eventId: string;
  type: AIEventType;
  content: string;
  metadata: Record<string, unknown>;
  timestamp: number;
}

// === MENTOR TYPES ===
export interface MentorMessage {
  id: string;
  role: 'mentor' | 'user';
  content: string;
  timestamp: number;
  animation?: 'thinking' | 'explaining' | 'celebrating' | 'warning';
}

export interface MentorState {
  isVisible: boolean;
  isTyping: boolean;
  currentMood: 'neutral' | 'happy' | 'concerned' | 'excited';
  messages: MentorMessage[];
}

// === ANALYTICS TYPES ===
export interface UserAnalytics {
  userId: string;
  sessionDuration: number;
  accuracyRate: number;
  conceptMastery: Record<string, number>;
  experimentSuccess: number;
  quizScores: number[];
  weakConcepts: string[];
  strongConcepts: string[];
  engagementLevel: number;
  riskToleranceScore: number;
}

export interface PerformanceMetrics {
  timeSpentPerTask: Record<string, number>;
  errorFrequency: Record<string, number>;
  completionRates: Record<string, number>;
  improvementTrend: number[];
}

// === EXPERIMENT TYPES ===
export interface ExperimentStep {
  id: string;
  action: string;
  chemical?: string;
  dosage?: number;
  duration?: number;
  isCorrect?: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  idealProtocol: ExperimentStep[];
  userSteps: ExperimentStep[];
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  score?: number;
  feedback?: string;
}

// === AYURVEDA BRIDGE TYPES ===
export interface AyurvedaCompound {
  id: string;
  name: string;
  plantSource: string;
  activeIngredients: string[];
  modernEquivalent?: string;
  therapeuticUses: string[];
  chemicalStructure: string;
}

export interface CompoundMatch {
  modernCompound: string;
  ayurvedaCompound: AyurvedaCompound;
  similarityScore: number;
  sharedIngredients: string[];
  insight: string;
}

// === KNOWLEDGE TYPES ===
export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  category: 'history' | 'case-study' | 'flashcard' | 'research';
  relevance: number;
  source?: string;
}

// === RECOMMENDATION TYPES ===
export interface Recommendation {
  id: string;
  type: 'mission' | 'practice' | 'learning-path';
  title: string;
  description: string;
  reason: string;
  priority: number;
}

// === SCENARIO TYPES ===
export interface Scenario {
  id: string;
  title: string;
  type: 'startup' | 'regulatory' | 'budget' | 'ethical';
  narrative: string;
  challenges: Challenge[];
  decisions: Decision[];
  outcome?: string;
}

export interface Challenge {
  id: string;
  description: string;
  constraints: string[];
}

export interface Decision {
  id: string;
  prompt: string;
  options: { id: string; text: string; consequence: string }[];
  selectedOption?: string;
}

// === PHARMA DATA TYPES ===
export interface DrugData {
  id: string;
  name: string;
  genericName: string;
  approvalStatus: string;
  approvalDate?: string;
  indication: string;
  manufacturer: string;
}

export interface ResearchTrend {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  source: string;
}
