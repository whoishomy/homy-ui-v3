import type { LabResult } from '../components/dashboard/LabResultsPanel';

export interface UserContext {
  comprehensionLevel: 'basic' | 'intermediate' | 'advanced';
  preferredFormat: 'visual' | 'text' | 'mixed';
  attentionSpan: 'short' | 'medium' | 'long';
  technicalBackground: boolean;
  specialNeeds?: {
    type: 'visual' | 'cognitive' | 'language';
    accommodations: string[];
  };
}

export interface DepthConfig {
  detailLevel: number; // 0-1
  technicalTerms: boolean;
  visualSupport: boolean;
  interactiveElements: boolean;
  simplification: boolean;
  emphasis: Array<'clinical' | 'lifestyle' | 'technical' | 'emotional'>;
}

export interface CalibratedResponse {
  content: {
    main: string;
    simplified?: string;
    technical?: string;
  };
  format: {
    structure: 'bullet' | 'paragraph' | 'stepwise';
    visualAids: string[];
    interactiveHints: string[];
  };
  emphasis: {
    primary: string;
    secondary: string[];
    highlights: string[];
  };
  accessibility: {
    alternativeText: string;
    screenReaderNotes: string[];
    navigationHints: string[];
  };
}

export class ResponseDepthCalibrator {
  private static instance: ResponseDepthCalibrator;
  private defaultConfig: DepthConfig;

  private constructor() {
    this.defaultConfig = {
      detailLevel: 0.5,
      technicalTerms: false,
      visualSupport: true,
      interactiveElements: true,
      simplification: true,
      emphasis: ['lifestyle', 'emotional'],
    };
  }

  static getInstance(): ResponseDepthCalibrator {
    if (!ResponseDepthCalibrator.instance) {
      ResponseDepthCalibrator.instance = new ResponseDepthCalibrator();
    }
    return ResponseDepthCalibrator.instance;
  }

  calibrateForUser(context: UserContext): DepthConfig {
    return {
      detailLevel: this.calculateDetailLevel(context),
      technicalTerms: context.technicalBackground,
      visualSupport: context.preferredFormat !== 'text',
      interactiveElements: context.attentionSpan !== 'short',
      simplification: context.comprehensionLevel === 'basic',
      emphasis: this.determineEmphasis(context),
    };
  }

  async generateCalibratedResponse(
    result: LabResult,
    context: UserContext,
    config?: Partial<DepthConfig>
  ): Promise<CalibratedResponse> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const baseContent = this.generateBaseContent(result, finalConfig);

    return {
      content: {
        main: baseContent,
        simplified: finalConfig.simplification ? this.simplifyContent(baseContent) : undefined,
        technical: finalConfig.technicalTerms ? this.addTechnicalDetails(result) : undefined,
      },
      format: this.determineFormat(context, finalConfig),
      emphasis: this.generateEmphasis(result, finalConfig),
      accessibility: this.ensureAccessibility(context),
    };
  }

  private calculateDetailLevel(context: UserContext): number {
    let level =
      context.comprehensionLevel === 'advanced'
        ? 0.8
        : context.comprehensionLevel === 'intermediate'
          ? 0.5
          : 0.3;

    if (context.technicalBackground) level += 0.1;
    if (context.attentionSpan === 'short') level -= 0.2;

    return Math.max(0.1, Math.min(1, level));
  }

  private determineEmphasis(
    context: UserContext
  ): Array<'clinical' | 'lifestyle' | 'technical' | 'emotional'> {
    const emphasis: Array<'clinical' | 'lifestyle' | 'technical' | 'emotional'> = [];

    if (context.technicalBackground) {
      emphasis.push('technical', 'clinical');
    } else {
      emphasis.push('lifestyle', 'emotional');
    }

    if (context.comprehensionLevel === 'advanced') {
      emphasis.push('clinical');
    }

    return emphasis;
  }

  private generateBaseContent(result: LabResult, config: DepthConfig): string {
    const latestValue = result.data[result.data.length - 1].value;
    const isNormal = this.isWithinRange(latestValue, result.referenceRange);

    return config.detailLevel > 0.7
      ? this.generateDetailedContent(result, isNormal)
      : this.generateSimpleContent(result, isNormal);
  }

  private isWithinRange(value: number, range?: { min: number; max: number }): boolean {
    if (!range) return true;
    return value >= range.min && value <= range.max;
  }

  private generateDetailedContent(result: LabResult, isNormal: boolean): string {
    const trend = this.analyzeTrend(result);
    return `Your ${result.title} level is ${isNormal ? 'within normal range' : 'outside normal range'}. 
    The current value shows a ${trend} trend compared to previous measurements. 
    This indicates ${this.interpretTrend(trend, isNormal)}.`;
  }

  private generateSimpleContent(result: LabResult, isNormal: boolean): string {
    return `Your ${result.title} test ${isNormal ? 'looks good' : 'needs attention'}. 
    ${isNormal ? 'Keep up the good work!' : "Let's work on improving this."}`;
  }

  private analyzeTrend(result: LabResult): string {
    if (result.data.length < 2) return 'stable';

    const latest = result.data[result.data.length - 1].value;
    const previous = result.data[result.data.length - 2].value;
    const change = ((latest - previous) / previous) * 100;

    if (Math.abs(change) < 5) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }

  private interpretTrend(trend: string, isNormal: boolean): string {
    if (isNormal) {
      return trend === 'stable'
        ? 'good maintenance of healthy levels'
        : 'changing but still within healthy range';
    }
    return trend === 'stable'
      ? 'persistent deviation from normal range'
      : 'active change that requires attention';
  }

  private simplifyContent(content: string): string {
    return content
      .replace(/within normal range/g, 'normal')
      .replace(/outside normal range/g, 'not normal')
      .replace(/indicates/g, 'shows')
      .replace(/measurements/g, 'tests');
  }

  private addTechnicalDetails(result: LabResult): string {
    const latestValue = result.data[result.data.length - 1].value;
    return `Technical Analysis:
    - Current Value: ${latestValue}
    - Reference Range: ${result.referenceRange?.min}-${result.referenceRange?.max}
    - Deviation: ${this.calculateDeviation(latestValue, result.referenceRange)}%
    - Statistical Significance: ${this.calculateSignificance(result)}`;
  }

  private calculateDeviation(value: number, range?: { min: number; max: number }): number {
    if (!range) return 0;
    const mean = (range.max + range.min) / 2;
    return Math.round(((value - mean) / mean) * 100);
  }

  private calculateSignificance(result: LabResult): string {
    if (result.data.length < 2) return 'Insufficient data';
    const latestValue = result.data[result.data.length - 1].value;
    const previousValue = result.data[result.data.length - 2].value;
    const change = Math.abs((latestValue - previousValue) / previousValue);
    return change > 0.2 ? 'High' : change > 0.1 ? 'Medium' : 'Low';
  }

  private determineFormat(
    context: UserContext,
    config: DepthConfig
  ): {
    structure: 'bullet' | 'paragraph' | 'stepwise';
    visualAids: string[];
    interactiveHints: string[];
  } {
    return {
      structure: context.attentionSpan === 'short' ? 'bullet' : 'paragraph',
      visualAids: config.visualSupport ? this.selectVisualAids(context) : [],
      interactiveHints: config.interactiveElements ? this.generateInteractiveHints() : [],
    };
  }

  private selectVisualAids(context: UserContext): string[] {
    const baseAids = ['trend-graph', 'range-indicator'];

    if (context.specialNeeds?.type === 'visual') {
      return ['high-contrast-graph', 'large-print-values'];
    }

    return context.comprehensionLevel === 'basic'
      ? ['simple-chart', 'color-indicators']
      : [...baseAids, 'detailed-analysis-chart'];
  }

  private generateInteractiveHints(): string[] {
    return ['Click for detailed view', 'Hover for reference range', 'Drag to compare values'];
  }

  private generateEmphasis(
    result: LabResult,
    config: DepthConfig
  ): {
    primary: string;
    secondary: string[];
    highlights: string[];
  } {
    const isNormal = this.isWithinRange(
      result.data[result.data.length - 1].value,
      result.referenceRange
    );

    return {
      primary: isNormal ? 'Maintaining healthy levels' : 'Attention required',
      secondary: this.generateSecondaryPoints(result, config),
      highlights: this.generateHighlights(result, isNormal),
    };
  }

  private generateSecondaryPoints(result: LabResult, config: DepthConfig): string[] {
    const points = [];

    if (config.emphasis.includes('lifestyle')) {
      points.push('Impact on daily activities');
    }
    if (config.emphasis.includes('clinical')) {
      points.push('Clinical significance');
    }
    if (config.emphasis.includes('technical')) {
      points.push('Statistical analysis');
    }

    return points;
  }

  private generateHighlights(result: LabResult, isNormal: boolean): string[] {
    return isNormal
      ? ['Healthy range', 'Good progress', 'Maintenance tips']
      : ['Action needed', 'Improvement steps', 'Follow-up plan'];
  }

  private ensureAccessibility(context: UserContext): {
    alternativeText: string;
    screenReaderNotes: string[];
    navigationHints: string[];
  } {
    return {
      alternativeText: this.generateAltText(context),
      screenReaderNotes: this.generateScreenReaderNotes(context),
      navigationHints: this.generateNavigationHints(context),
    };
  }

  private generateAltText(context: UserContext): string {
    return context.specialNeeds?.type === 'visual'
      ? 'Detailed description of test results and their meaning'
      : 'Summary of test results';
  }

  private generateScreenReaderNotes(context: UserContext): string[] {
    return [
      'Use arrow keys to navigate',
      'Press Enter to expand details',
      'Press Escape to collapse',
    ];
  }

  private generateNavigationHints(context: UserContext): string[] {
    return ['Top section: Summary', 'Middle section: Details', 'Bottom section: Actions'];
  }
}
