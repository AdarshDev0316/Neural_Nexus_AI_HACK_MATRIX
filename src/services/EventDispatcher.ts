// ============================================
// PharmaQuest AI - Event Dispatcher
// Event-Driven Architecture Core
// ============================================

import { AIEvent, AIEventType, AIResponse } from '@/types';

type EventCallback = (event: AIEvent) => void;
type ResponseCallback = (response: AIResponse) => void;

class EventDispatcher {
  private static instance: EventDispatcher;
  private eventListeners: Map<AIEventType, EventCallback[]> = new Map();
  private responseListeners: Map<string, ResponseCallback[]> = new Map();
  private eventLog: AIEvent[] = [];
  private responseLog: AIResponse[] = [];

  private constructor() {
    console.log('[EventDispatcher] Initialized - Event-Driven Architecture Active');
  }

  public static getInstance(): EventDispatcher {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  // Subscribe to events
  public subscribe(eventType: AIEventType, callback: EventCallback): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  // Dispatch event to AI layer
  public dispatch(event: AIEvent): void {
    console.log(`[EventDispatcher] Dispatching: ${event.type}`, event.payload);
    this.eventLog.push(event);
    
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => callback(event));
    }

    // Process through AI layer
    this.processAIEvent(event);
  }

  // Simulate AI processing and WebSocket response
  private async processAIEvent(event: AIEvent): Promise<void> {
    // Simulate network latency for realistic feel
    const latency = 300 + Math.random() * 500;
    
    await new Promise(resolve => setTimeout(resolve, latency));

    const response: AIResponse = {
      eventId: `resp_${Date.now()}`,
      type: event.type,
      content: '',
      metadata: {},
      timestamp: Date.now()
    };

    // Route to appropriate AI service (simulated)
    switch (event.type) {
      case 'hint_event':
        response.content = this.generateHint(event.payload);
        response.metadata = { source: 'AI_Mentor_Service' };
        break;
      case 'explain_event':
        response.content = this.generateExplanation(event.payload);
        response.metadata = { source: 'AI_Mentor_Service' };
        break;
      case 'knowledge_event':
        response.content = this.generateKnowledge(event.payload);
        response.metadata = { source: 'Knowledge_Retrieval_Service' };
        break;
      case 'feedback_event':
        response.content = this.generateFeedback(event.payload);
        response.metadata = { source: 'Experiment_Feedback_AI' };
        break;
      case 'adapt_event':
        response.content = this.generateAdaptation(event.payload);
        response.metadata = { source: 'Adaptive_Learning_Engine' };
        break;
      default:
        response.content = 'Processing...';
    }

    this.responseLog.push(response);
    this.notifyResponse(response);
  }

  // Subscribe to responses
  public onResponse(eventType: AIEventType, callback: ResponseCallback): () => void {
    const key = eventType;
    if (!this.responseListeners.has(key)) {
      this.responseListeners.set(key, []);
    }
    this.responseListeners.get(key)!.push(callback);
    
    return () => {
      const listeners = this.responseListeners.get(key);
      if (listeners) {
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
      }
    };
  }

  private notifyResponse(response: AIResponse): void {
    const listeners = this.responseListeners.get(response.type);
    if (listeners) {
      listeners.forEach(callback => callback(response));
    }
  }

  // AI Response Generators (Simulated LLM responses)
  private generateHint(payload: Record<string, unknown>): string {
    const hints: Record<string, string[]> = {
      molecule: [
        "💡 Try checking the bond angles - they affect molecular stability.",
        "💡 Remember: Carbon forms 4 bonds, Nitrogen forms 3, Oxygen forms 2.",
        "💡 Consider the electronegativity difference for polar bonds.",
        "💡 Functional groups determine chemical behavior!"
      ],
      experiment: [
        "💡 The order of reagent addition matters in this reaction.",
        "💡 Check your temperature settings - enzymes denature at high temps.",
        "💡 Sample size affects statistical significance.",
        "💡 Control groups are essential for valid results."
      ],
      quiz: [
        "💡 Think about the mechanism, not just the outcome.",
        "💡 Consider pharmacokinetics: ADME principles.",
        "💡 Drug-receptor interactions follow lock-and-key model."
      ]
    };

    const context = (payload.context as string) || 'molecule';
    const contextHints = hints[context] || hints.molecule;
    return contextHints[Math.floor(Math.random() * contextHints.length)];
  }

  private generateExplanation(payload: Record<string, unknown>): string {
    const topic = (payload.topic as string) || 'general';
    const explanations: Record<string, string> = {
      molecule_complete: "🎉 Excellent work! You've successfully constructed the molecule. The bond geometry you created allows for optimal electron distribution, which is crucial for biological activity.",
      experiment_complete: "🔬 Great experiment! Your methodology followed proper scientific protocol. The results demonstrate the principle of dose-response relationships in pharmacology.",
      bond_error: "⚠️ The bond you created violates the octet rule. Each atom seeks to fill its outer electron shell - carbon needs 4 bonds, oxygen needs 2.",
      general: "📚 This concept relates to fundamental principles of medicinal chemistry..."
    };
    return explanations[topic] || explanations.general;
  }

  private generateKnowledge(payload: Record<string, unknown>): string {
    const topic = (payload.topic as string) || 'general';
    const knowledge: Record<string, string> = {
      aspirin: "📖 Did you know? Aspirin (acetylsalicylic acid) was derived from salicin found in willow bark. Hippocrates documented its use in 400 BCE!",
      penicillin: "📖 Alexander Fleming's discovery of penicillin in 1928 was serendipitous - he noticed mold killing bacteria on a contaminated petri dish.",
      insulin: "📖 Insulin was first extracted from dog pancreas by Banting and Best in 1921, revolutionizing diabetes treatment.",
      general: "📖 Drug discovery typically takes 10-15 years and costs over $2 billion from concept to market approval."
    };
    return knowledge[topic] || knowledge.general;
  }

  private generateFeedback(payload: Record<string, unknown>): string {
    const accuracy = (payload.accuracy as number) || 0.5;
    if (accuracy > 0.9) {
      return "✅ Outstanding! Your experimental technique is precise. All steps followed the optimal protocol.";
    } else if (accuracy > 0.7) {
      return "👍 Good work! Minor deviations noted. Consider the timing of reagent additions for better results.";
    } else if (accuracy > 0.5) {
      return "📊 Acceptable results. Review the protocol steps - some key procedures were out of sequence.";
    } else {
      return "⚠️ Results need improvement. Let's review the fundamental principles together. Would you like step-by-step guidance?";
    }
  }

  private generateAdaptation(payload: Record<string, unknown>): string {
    const performance = (payload.performance as number) || 0.5;
    if (performance > 0.8) {
      return "📈 Difficulty increased! You're ready for advanced challenges. New complex molecules unlocked.";
    } else if (performance < 0.4) {
      return "📉 Adjusting difficulty. Let's strengthen foundational concepts before proceeding.";
    }
    return "⚖️ Current difficulty maintained. Continue building your skills!";
  }

  // Get event logs for analytics
  public getEventLog(): AIEvent[] {
    return [...this.eventLog];
  }

  public getResponseLog(): AIResponse[] {
    return [...this.responseLog];
  }
}

export const eventDispatcher = EventDispatcher.getInstance();
