import type { LabResult } from '../components/dashboard/LabResultsPanel';
import { ResponseDepthCalibrator, type UserContext } from './responseDepthCalibrator';

export interface EmotionalContext {
  primaryEmotion: 'neutral' | 'concern' | 'relief' | 'motivation';
  intensity: number;
  triggers: string[];
  supportiveElements: string[];
}

export interface AgeAdaptedContent {
  level: 'child' | 'teen' | 'adult';
  format: 'visual' | 'text' | 'interactive';
  complexity: number;
  explanation: string;
  supportMaterial: string[];
}

export interface MicroTask {
  id: string;
  title: string;
  steps: string[];
  duration: number;
  action: {
    description: string;
  };
}

interface NeuroFocusOutput {
  emotional: EmotionalContext;
  adaptedContent: AgeAdaptedContent;
  microTasks: MicroTask[];
  supportContext: {
    familyInvolvement: string[];
    communityResources: string[];
    followUpStrategy: string;
  };
}

export class NeuroFocusEngine {
  private static instance: NeuroFocusEngine;
  private emotionContextProvider: any; // Will be typed properly when EmotionContextProvider is implemented
  private depthCalibrator: ResponseDepthCalibrator;

  private constructor() {
    this.depthCalibrator = ResponseDepthCalibrator.getInstance();
  }

  static getInstance(): NeuroFocusEngine {
    if (!NeuroFocusEngine.instance) {
      NeuroFocusEngine.instance = new NeuroFocusEngine();
    }
    return NeuroFocusEngine.instance;
  }

  setEmotionContextProvider(provider: any) {
    this.emotionContextProvider = provider;
  }

  async analyzeEmotionalContext(result: LabResult): Promise<EmotionalContext> {
    const latestValue = result.data[result.data.length - 1].value;
    const isOutOfRange =
      result.referenceRange &&
      (latestValue < result.referenceRange.min || latestValue > result.referenceRange.max);

    return {
      primaryEmotion: isOutOfRange ? 'concern' : 'neutral',
      intensity: isOutOfRange ? 0.7 : 0.3,
      triggers: this.identifyEmotionalTriggers(result),
      supportiveElements: this.generateSupportiveElements(result),
    };
  }

  async generateAgeAdaptedContent(
    result: LabResult,
    ageGroup: 'child' | 'teen' | 'adult'
  ): Promise<AgeAdaptedContent> {
    return {
      level: ageGroup,
      format: 'visual',
      complexity: this.adaptLanguageForAge(ageGroup).complexity,
      explanation: '',
      supportMaterial: [],
    };
  }

  async generateMicroTasks(result: LabResult): Promise<MicroTask[]> {
    const tasks: MicroTask[] = [];
    const latestValue = result.data[result.data.length - 1].value;

    // Example: High glucose monitoring task
    if (result.title.toLowerCase().includes('glucose') && latestValue > 126) {
      tasks.push({
        id: 'glucose-monitoring-1',
        title: 'Start daily glucose monitoring',
        steps: ['Monitor glucose levels daily', 'Record results', 'Consult healthcare provider'],
        duration: 30,
        action: {
          description: 'Monitor glucose levels daily',
        },
      });
    }

    return tasks;
  }

  async generateFullNeuroFocus(
    result: LabResult,
    ageGroup: 'child' | 'teen' | 'adult',
    userContext?: Partial<UserContext>
  ): Promise<NeuroFocusOutput> {
    // Convert ageGroup to UserContext if not provided
    const defaultContext = this.createContextFromAge(ageGroup);
    const context: UserContext = {
      ...defaultContext,
      ...userContext,
      // Ensure required fields are present
      comprehensionLevel: userContext?.comprehensionLevel || defaultContext.comprehensionLevel,
      preferredFormat: userContext?.preferredFormat || defaultContext.preferredFormat,
      attentionSpan: userContext?.attentionSpan || defaultContext.attentionSpan,
      technicalBackground: userContext?.technicalBackground ?? defaultContext.technicalBackground,
    };

    const [emotional, adaptedContent, microTasks, calibratedResponse] = await Promise.all([
      this.analyzeEmotionalContext(result),
      this.generateAgeAdaptedContent(result, ageGroup),
      this.generateMicroTasks(result),
      this.depthCalibrator.generateCalibratedResponse(result, context),
    ]);

    // Update format based on calibration
    adaptedContent.format =
      calibratedResponse.format.structure === 'stepwise' ? 'interactive' : 'visual';

    return {
      emotional,
      adaptedContent,
      microTasks,
      supportContext: {
        familyInvolvement: this.generateFamilyInvolvement(ageGroup),
        communityResources: this.findCommunityResources(result),
        followUpStrategy: this.createFollowUpStrategy(result, ageGroup),
      },
    };
  }

  private createContextFromAge(ageGroup: 'child' | 'teen' | 'adult'): UserContext {
    switch (ageGroup) {
      case 'child':
        return {
          comprehensionLevel: 'basic',
          preferredFormat: 'visual',
          attentionSpan: 'short',
          technicalBackground: false,
          specialNeeds: {
            type: 'cognitive',
            accommodations: ['simplified language', 'visual aids'],
          },
        };
      case 'teen':
        return {
          comprehensionLevel: 'intermediate',
          preferredFormat: 'mixed',
          attentionSpan: 'medium',
          technicalBackground: false,
          specialNeeds: {
            type: 'visual',
            accommodations: ['large print', 'high contrast'],
          },
        };
      default:
        return {
          comprehensionLevel: 'advanced',
          preferredFormat: 'mixed',
          attentionSpan: 'long',
          technicalBackground: true,
        };
    }
  }

  // Helper methods
  private identifyEmotionalTriggers(result: LabResult): string[] {
    const triggers = [];
    const latestValue = result.data[result.data.length - 1].value;

    if (result.referenceRange) {
      if (latestValue > result.referenceRange.max) {
        triggers.push('Above normal range');
      } else if (latestValue < result.referenceRange.min) {
        triggers.push('Below normal range');
      }
    }

    if (result.data.length > 1) {
      const previousValue = result.data[result.data.length - 2].value;
      if (Math.abs((latestValue - previousValue) / previousValue) > 0.2) {
        triggers.push('Significant change from previous');
      }
    }

    return triggers;
  }

  private generateSupportiveElements(result: LabResult): string[] {
    return [
      'Clear visual explanations',
      'Step-by-step guidance',
      'Positive reinforcement',
      'Progress tracking',
    ];
  }

  private adaptLanguageForAge(ageGroup: 'child' | 'teen' | 'adult'): {
    complexity: number;
    tone: string;
    visualAids: string[];
  } {
    switch (ageGroup) {
      case 'child':
        return {
          complexity: 0.3,
          tone: 'friendly and encouraging',
          visualAids: ['animations', 'simple charts', 'character guides'],
        };
      case 'teen':
        return {
          complexity: 0.6,
          tone: 'respectful and clear',
          visualAids: ['large print materials', 'simple graphs', 'step-by-step guides'],
        };
      default:
        return {
          complexity: 0.8,
          tone: 'professional and informative',
          visualAids: ['detailed charts', 'comparative graphs', 'scientific illustrations'],
        };
    }
  }

  private generateFamilyInvolvement(ageGroup: 'child' | 'teen' | 'adult'): string[] {
    switch (ageGroup) {
      case 'child':
        return ['Parent guidance', 'Family activities', 'Support network tips'];
      case 'teen':
        return ['Family discussion points', 'Independence strategies', 'Support balance'];
      case 'adult':
        return ['Self-management tips', 'Family communication', 'Support resources'];
    }
  }

  private findCommunityResources(result: LabResult): string[] {
    return [
      'Local support groups',
      'Educational workshops',
      'Healthcare provider network',
      'Online communities',
    ];
  }

  private createFollowUpStrategy(result: LabResult, ageGroup: 'child' | 'teen' | 'adult'): string {
    const baseStrategy = 'Regular monitoring and check-ups';

    switch (ageGroup) {
      case 'child':
        return `${baseStrategy} with family-friendly appointment scheduling`;
      case 'teen':
        return `${baseStrategy} with independence strategies and support balance`;
      default:
        return `${baseStrategy} with flexible scheduling options`;
    }
  }

  private async enhanceWithCalibration(
    adaptedContent: AgeAdaptedContent,
    calibratedResponse: any
  ): Promise<AgeAdaptedContent> {
    // Update format based on calibration
    adaptedContent.format =
      calibratedResponse.format.structure === 'stepwise' ? 'interactive' : 'visual';

    return adaptedContent;
  }
}
