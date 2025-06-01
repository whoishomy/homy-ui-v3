import { EventEmitter } from 'events';
import type {
  AgentRunner,
  AgentRunnerConfig,
  AgentOutput,
  AgentRunnerStatus,
} from '../types/agent';
import { vitalSignsMonitorAgent } from '../agents/vitals/vital-signs-monitor.agent';

class HomyAgentRunner extends EventEmitter implements AgentRunner {
  private agents: Map<string, Function> = new Map();
  private configs: Map<string, AgentRunnerConfig> = new Map();
  private agentStatuses: Map<string, AgentRunnerStatus> = new Map();

  constructor() {
    super();
    this.registerBuiltinAgents();
  }

  private registerBuiltinAgents() {
    this.agents.set('vital-signs-monitor', vitalSignsMonitorAgent);
  }

  public getAllAgentStatus(): AgentRunnerStatus[] {
    return Array.from(this.agentStatuses.values());
  }

  public async runAgent(name: string, config?: AgentRunnerConfig): Promise<AgentOutput> {
    const agent = this.agents.get(name);
    if (!agent) {
      return {
        success: false,
        error: `Agent ${name} not found`,
      };
    }

    try {
      const context = {
        name,
        timestamp: new Date().toISOString(),
        data: config?.data,
      };

      const result = await agent(context);
      this.agentStatuses.set(name, {
        name,
        status: 'running',
        lastActiveAt: new Date().toISOString(),
      });
      this.emit('agentComplete', { name, result });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.agentStatuses.set(name, {
        name,
        status: 'error',
        lastActiveAt: new Date().toISOString(),
      });
      this.emit('agentError', { name, error: errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  public registerAgent(name: string, config: AgentRunnerConfig): void {
    this.configs.set(name, config);
    this.agentStatuses.set(name, { name, status: 'idle', lastActiveAt: new Date().toISOString() });
    this.emit('agentRegistered', { name, config });
  }

  public on(event: string, handler: (data: any) => void): this {
    return super.on(event, handler);
  }

  public off(event: string, handler: (data: any) => void): this {
    return super.off(event, handler);
  }

  public async enableAgent(name: string): Promise<void> {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    this.agentStatuses.set(name, {
      name,
      status: 'running',
      lastActiveAt: new Date().toISOString(),
    });
    this.emit('statusUpdate', this.agentStatuses.get(name));
  }

  public async disableAgent(name: string): Promise<void> {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }
    this.agentStatuses.set(name, { name, status: 'idle', lastActiveAt: new Date().toISOString() });
    this.emit('statusUpdate', this.agentStatuses.get(name));
  }
}

export const agentRunner = new HomyAgentRunner();
