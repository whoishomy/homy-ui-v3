import type { HealthInsight, InsightContext } from '@/types/analytics';
import type { InsightGenerationParams, InsightGenerationOptions } from '../interfaces/AIInsightProvider';
import { BaseInsightMiddleware, type MiddlewareContext, type NextFunction } from './InsightMiddleware';

export interface SanitizeOptions {
  maxTokens?: number;
  maxPromptLength?: number;
  enablePii?: boolean;
  enableHipaaCompliance?: boolean;
  customPatterns?: RegExp[];
  allowedLanguages?: string[];
  contentPolicy?: {
    allowProfanity?: boolean;
    allowPersonalInfo?: boolean;
    allowMedicalTerms?: boolean;
  };
}

const DEFAULT_SANITIZE_OPTIONS: Required<SanitizeOptions> = {
  maxTokens: 4096, // OpenAI GPT-3.5/4 token limit
  maxPromptLength: 32768, // Characters
  enablePii: true,
  enableHipaaCompliance: true,
  customPatterns: [],
  allowedLanguages: ['en', 'tr'],
  contentPolicy: {
    allowProfanity: false,
    allowPersonalInfo: false,
    allowMedicalTerms: true,
  },
};

// PII detection patterns
const PII_PATTERNS = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
  SSN: /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g,
  CREDIT_CARD: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  IP_ADDRESS: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
};

// HIPAA-specific patterns
const HIPAA_PATTERNS = {
  PATIENT_ID: /\b(P|PT|PAT|ID)[-#]?\d{4,10}\b/gi,
  MEDICAL_RECORD: /\b(MR|MRN|RECORD)[-#]?\d{4,10}\b/gi,
  DIAGNOSIS_CODE: /\b[A-Z]\d{2}(\.\d{1,2})?\b/g, // ICD-10 format
  PROVIDER_ID: /\b(NPI|DEA)[-#]?\d{6,10}\b/gi,
};

// Prompt injection patterns
const INJECTION_PATTERNS = {
  SYSTEM_PROMPT: /\b(system:|assistant:|user:|system prompt:|<\|system\|>)/gi,
  COMMAND_INJECTION: /(```|\$|>|\||\{|\}|\/\/|\/\*|\*\/|;|\[|\])/g,
  ROLE_CONFUSION: /\b(ignore|disregard|forget|bypass) (previous|above|earlier|all) (instructions|commands|rules|context)\b/gi,
};

export class SanitizeError extends Error {
  constructor(
    message: string,
    public readonly type: 'pii' | 'hipaa' | 'injection' | 'policy' | 'validation',
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SanitizeError';
  }
}

export class SanitizeMiddleware extends BaseInsightMiddleware {
  private readonly options: Required<SanitizeOptions>;

  constructor(options: Partial<SanitizeOptions> = {}) {
    super();
    this.options = { ...DEFAULT_SANITIZE_OPTIONS, ...options };
  }

  async generateInsight(
    params: InsightGenerationParams,
    options: InsightGenerationOptions,
    context: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    // Sanitize input parameters
    const sanitizedParams = this.sanitizeParams(params);
    const sanitizedOptions = this.sanitizeOptions(options);

    // Get insight with sanitized inputs
    const insight = await next();

    // Sanitize output
    return this.sanitizeInsight(insight);
  }

  async generateInsightForPersona(
    context: InsightContext,
    options: InsightGenerationOptions,
    middlewareContext: MiddlewareContext,
    next: NextFunction<HealthInsight>
  ): Promise<HealthInsight> {
    // Sanitize persona context
    const sanitizedContext = this.sanitizePersonaContext(context);
    const sanitizedOptions = this.sanitizeOptions(options);

    // Get insight with sanitized inputs
    const insight = await next();

    // Sanitize output
    return this.sanitizeInsight(insight);
  }

  private sanitizeParams(params: InsightGenerationParams): InsightGenerationParams {
    // Validate token length
    if (JSON.stringify(params).length > this.options.maxPromptLength) {
      throw new SanitizeError(
        `Input exceeds maximum length of ${this.options.maxPromptLength} characters`,
        'validation'
      );
    }

    // Check for injection attempts
    this.checkInjectionPatterns(JSON.stringify(params));

    // Sanitize metrics data
    const sanitizedMetrics = this.sanitizeMetrics(params.metrics);

    return {
      ...params,
      metrics: sanitizedMetrics,
    };
  }

  private sanitizePersonaContext(context: InsightContext): InsightContext {
    // Validate context size
    if (JSON.stringify(context).length > this.options.maxPromptLength) {
      throw new SanitizeError(
        `Context exceeds maximum length of ${this.options.maxPromptLength} characters`,
        'validation'
      );
    }

    // Check for injection attempts
    this.checkInjectionPatterns(JSON.stringify(context));

    // Remove PII from persona data if enabled
    if (this.options.enablePii) {
      context = this.removePii(context);
    }

    return context;
  }

  private sanitizeOptions(options: InsightGenerationOptions): InsightGenerationOptions {
    return {
      ...options,
      maxTokens: Math.min(options.maxTokens ?? this.options.maxTokens, this.options.maxTokens),
      language: this.validateLanguage(options.language),
    };
  }

  private sanitizeInsight(insight: HealthInsight): HealthInsight {
    // Check content policy
    this.enforceContentPolicy(insight.message);

    // Remove any PII from the generated insight
    if (this.options.enablePii) {
      insight.message = this.removePiiFromText(insight.message);
    }

    // Apply HIPAA compliance rules
    if (this.options.enableHipaaCompliance) {
      insight.message = this.applyHipaaCompliance(insight.message);
    }

    return insight;
  }

  private sanitizeMetrics(metrics: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(metrics)) {
      // Remove any PII or sensitive data from metric values
      if (typeof value === 'string') {
        sanitized[key] = this.removePiiFromText(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private checkInjectionPatterns(text: string): void {
    for (const [type, pattern] of Object.entries(INJECTION_PATTERNS)) {
      if (pattern.test(text)) {
        throw new SanitizeError(
          `Potential prompt injection detected: ${type}`,
          'injection',
          { pattern: type, text }
        );
      }
    }
  }

  private removePii(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? this.removePiiFromText(obj) : obj;
    }

    const sanitized: any = Array.isArray(obj) ? [] : {};

    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = this.removePii(value);
    }

    return sanitized;
  }

  private removePiiFromText(text: string): string {
    let sanitized = text;

    // Apply PII patterns
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
      sanitized = sanitized.replace(pattern, `[REDACTED_${type}]`);
    }

    // Apply custom patterns
    for (const pattern of this.options.customPatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED_CUSTOM]');
    }

    return sanitized;
  }

  private applyHipaaCompliance(text: string): string {
    let compliant = text;

    // Apply HIPAA patterns
    for (const [type, pattern] of Object.entries(HIPAA_PATTERNS)) {
      compliant = compliant.replace(pattern, `[REDACTED_${type}]`);
    }

    return compliant;
  }

  private enforceContentPolicy(text: string): void {
    const policy = this.options.contentPolicy;

    if (!policy.allowProfanity && this.containsProfanity(text)) {
      throw new SanitizeError('Content contains prohibited profanity', 'policy');
    }

    if (!policy.allowPersonalInfo && this.containsPersonalInfo(text)) {
      throw new SanitizeError('Content contains prohibited personal information', 'policy');
    }

    if (!policy.allowMedicalTerms && this.containsMedicalTerms(text)) {
      throw new SanitizeError('Content contains prohibited medical terms', 'policy');
    }
  }

  private validateLanguage(language?: string): string {
    if (!language) {
      return this.options.allowedLanguages[0];
    }

    if (!this.options.allowedLanguages.includes(language)) {
      throw new SanitizeError(
        `Language "${language}" is not allowed. Allowed languages: ${this.options.allowedLanguages.join(', ')}`,
        'validation'
      );
    }

    return language;
  }

  private containsProfanity(text: string): boolean {
    // TODO: Implement profanity detection using a comprehensive word list
    return false;
  }

  private containsPersonalInfo(text: string): boolean {
    // Check for common personal information patterns
    return Object.values(PII_PATTERNS).some(pattern => pattern.test(text));
  }

  private containsMedicalTerms(text: string): boolean {
    // TODO: Implement medical terms detection if needed
    return false;
  }
} 