import { EventEmitter } from 'events';
import type { AgentRunner, AgentRunnerConfig, AgentOutput } from '../types/agent';
import { vitalSignsMonitorAgent } from '../agents/vitals/vital-signs-monitor.agent';

class HomyAgentRunner extends EventEmitter implements AgentRunner {
  private agents: Map<string, Function> = new Map();
  private configs: Map<string, AgentRunnerConfig> = new Map();

  constructor() {
    super();
    this.registerBuiltinAgents();
  }

  private registerBuiltinAgents() {
    this.agents.set('vital-signs-monitor', vitalSignsMonitorAgent);
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
      this.emit('agentComplete', { name, result });

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.emit('agentError', { name, error: errorMessage });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  public registerAgent(name: string, config: AgentRunnerConfig): void {
    this.configs.set(name, config);
    this.emit('agentRegistered', { name, config });
  }

  public on(event: string, handler: (data: any) => void): this {
    return super.on(event, handler);
  }

  public off(event: string, handler: (data: any) => void): this {
    return super.off(event, handler);
  }
}

export const agentRunner = new HomyAgentRunner();
