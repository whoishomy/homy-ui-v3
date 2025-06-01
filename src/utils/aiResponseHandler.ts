import type { LabResult } from '@/types/lab-results';
import { EmergencyEscalationGuard } from './emergencyEscalationGuard';
import { HealthTaskValidator } from './healthTaskValidator';

interface AIContext {
  labResult: LabResult;
  userRole: string;
  timestamp: string;
  previousInsights?: Array<{
    timestamp: string;
    content: string;
    severity?: string;
  }>;
}

interface AIResponse {
  content: string;
  metadata: {
    severity: 'normal' | 'warning' | 'critical';
    confidence: number;
    tags: string[];
    references?: string[];
  };
  insights: Array<{
    type: string;
    value: number;
    interpretation: string;
    trend?: 'increasing' | 'decreasing' | 'stable';
  }>;
  recommendations?: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
    timeframe: string;
  }>;
}

interface EmergencyIndicator {
  type: 'value' | 'trend' | 'pattern' | 'combination';
  severity: 'warning' | 'critical';
  confidence: number;
  evidence: Array<{
    source: string;
    detail: string;
    value?: number;
  }>;
}

export class AIResponseHandler {
  private static instance: AIResponseHandler;
  private emergencyGuard: EmergencyEscalationGuard;
  private taskValidator: HealthTaskValidator;

  private constructor() {
    this.emergencyGuard = EmergencyEscalationGuard.getInstance();
    this.taskValidator = HealthTaskValidator.getInstance();
  }

  static getInstance(): AIResponseHandler {
    if (!AIResponseHandler.instance) {
      AIResponseHandler.instance = new AIResponseHandler();
    }
    return AIResponseHandler.instance;
  }

  async generateInsight(ctx: AIContext): Promise<AIResponse> {
    // Implement your AI insight generation logic here
    const aiResponse: AIResponse = await this.callAIModel(ctx);

    // Validate the response
    const validatedResponse = await this.validateResponse(aiResponse, ctx);

    // Check for emergencies
    if (this.detectEmergency(validatedResponse, ctx)) {
      return this.escalateWithWarning(validatedResponse, ctx);
    }

    return validatedResponse;
  }

  private async callAIModel(ctx: AIContext): Promise<AIResponse> {
    // This would be your actual AI model call
    // For now, returning a mock response
    return {
      content: `Analysis for ${ctx.labResult.testName}`,
      metadata: {
        severity: 'normal',
        confidence: 0.95,
        tags: ['routine', 'follow-up'],
      },
      insights: [
        {
          type: ctx.labResult.testName,
          value: ctx.labResult.value,
          interpretation: 'Within normal range',
          trend: 'stable',
        },
      ],
    };
  }

  private async validateResponse(response: AIResponse, ctx: AIContext): Promise<AIResponse> {
    // Validate against health task rules
    const validationTask = {
      id: `ai_validation_${Date.now()}`,
      type: 'monitoring' as const,
      parameters: {
        action: 'validate_ai_response',
        threshold: ctx.labResult.referenceRange.max,
      },
      context: {
        labResult: ctx.labResult,
        clinicalContext: response.content,
      },
    };

    const validation = await this.taskValidator.validateTask(validationTask);

    if (!validation.isValid) {
      response.metadata.severity = 'warning';
      response.recommendations = validation.recommendations.map((rec) => ({
        action: rec,
        priority: 'high',
        timeframe: 'immediate',
      }));
    }

    return response;
  }

  private detectEmergency(response: AIResponse, ctx: AIContext): EmergencyIndicator | null {
    const value = ctx.labResult.value;
    const indicators: EmergencyIndicator[] = [];

    // Check for critical values
    const { min, max } = ctx.labResult.referenceRange;
    const range = max - min;

    if (value > max + range * 0.5 || value < min - range * 0.5) {
      indicators.push({
        type: 'value',
        severity: 'critical',
        confidence: 0.95,
        evidence: [
          {
            source: 'lab_result',
            detail: 'Value significantly outside reference range',
            value: value,
          },
        ],
      });
    }

    // Check for dangerous trends
    if (ctx.labResult.history && ctx.labResult.history.length > 0) {
      const previousValue = ctx.labResult.history[ctx.labResult.history.length - 1].value;
      const change = Math.abs((value - previousValue) / previousValue);

      if (change > 0.3) {
        // 30% change
        indicators.push({
          type: 'trend',
          severity: 'warning',
          confidence: 0.85,
          evidence: [
            {
              source: 'trend_analysis',
              detail: 'Rapid change in values',
              value: change,
            },
          ],
        });
      }
    }

    // Check AI confidence
    if (response.metadata.confidence < 0.7) {
      indicators.push({
        type: 'pattern',
        severity: 'warning',
        confidence: response.metadata.confidence,
        evidence: [
          {
            source: 'ai_analysis',
            detail: 'Low confidence in AI interpretation',
          },
        ],
      });
    }

    // Return the most severe indicator
    return (
      indicators.sort((a, b) =>
        b.severity === 'critical' ? 1 : a.severity === 'critical' ? -1 : 0
      )[0] || null
    );
  }

  private async escalateWithWarning(response: AIResponse, ctx: AIContext): Promise<AIResponse> {
    // Add warning metadata
    response.metadata.severity = 'critical';
    response.metadata.tags.push('emergency');

    // Create emergency warning message
    const warningMessage = this.generateWarningMessage(response, ctx);
    response.content = `⚠️ EMERGENCY WARNING ⚠️\n\n${warningMessage}\n\n${response.content}`;

    // Trigger emergency escalation
    await this.emergencyGuard.evaluateLabResult(ctx.labResult);

    // Add emergency recommendations
    response.recommendations = [
      {
        action: 'Immediate medical attention required',
        priority: 'high',
        timeframe: 'immediate',
      },
      {
        action: 'Contact healthcare provider',
        priority: 'high',
        timeframe: 'immediate',
      },
      ...(response.recommendations || []),
    ];

    return response;
  }

  private generateWarningMessage(response: AIResponse, ctx: AIContext): string {
    const value = ctx.labResult.value;
    const { min, max, unit } = ctx.labResult.referenceRange;

    let message = 'CRITICAL VALUE DETECTED\n';
    message += `Current ${ctx.labResult.testName}: ${value} ${unit} (Reference: ${min}-${max} ${unit})\n`;
    message += 'Medical staff has been notified.\n';
    message += 'Please follow emergency protocol instructions.';

    return message;
  }

  // Public utility methods
  async getEmergencyStatus(): Promise<{
    hasActiveEmergency: boolean;
    activeEscalations: number;
    lastEscalation?: string;
  }> {
    const activeEscalations = await this.emergencyGuard.getActiveEscalations();
    return {
      hasActiveEmergency: activeEscalations.length > 0,
      activeEscalations: activeEscalations.length,
      lastEscalation: activeEscalations[0]?.timestamp,
    };
  }
}

}
