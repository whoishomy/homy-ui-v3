import { Agent, AgentTask } from '@/types/agent';

export type AgentEvent = {
  type: 'agent_update' | 'task_update' | 'task_created' | 'task_deleted';
  agentId: string;
  data: Partial<Agent> | AgentTask;
  timestamp: string;
};

class EventManager {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private listeners: Map<string, Set<(event: AgentEvent) => void>> = new Map();

  connect() {
    if (this.eventSource?.readyState === EventSource.OPEN) return;

    this.eventSource = new EventSource('/api/agents/events');

    this.eventSource.onopen = () => {
      console.log('🟢 SSE connection established');
      this.reconnectAttempts = 0;
    };

    this.eventSource.onerror = (error) => {
      console.error('🔴 SSE connection error:', error);
      this.eventSource?.close();
      this.handleReconnect();
    };

    this.eventSource.onmessage = (event) => {
      try {
        const agentEvent: AgentEvent = JSON.parse(event.data);
        this.notifyListeners(agentEvent);
      } catch (error) {
        console.error('Failed to parse event data:', error);
      }
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }

  private notifyListeners(event: AgentEvent) {
    const listeners = this.listeners.get(event.type);
    listeners?.forEach((listener) => listener(event));
  }

  subscribe(eventType: AgentEvent['type'], callback: (event: AgentEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(callback);
  }

  unsubscribe(eventType: AgentEvent['type'], callback: (event: AgentEvent) => void) {
    this.listeners.get(eventType)?.delete(callback);
  }

  disconnect() {
    this.eventSource?.close();
    this.eventSource = null;
    this.listeners.clear();
  }
}

export const eventManager = new EventManager();
