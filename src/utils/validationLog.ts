import { format as formatDate } from 'date-fns';
import type { Reminder } from '@/types/reminder';
import type { ValidationResult } from '@/components/reminder/ValidationRules';

type DataFormat = 'json' | 'csv';
type ExportFormat = DataFormat | 'ical';

export interface ValidationLogEntry {
  timestamp: string;
  operation: 'import' | 'export' | 'template';
  format: ExportFormat;
  success: boolean;
  itemCount: number;
  errors: string[];
  warnings: string[];
}

class ValidationLogger {
  private static instance: ValidationLogger;
  private logs: ValidationLogEntry[] = [];
  private maxLogs: number = 1000; // Keep last 1000 logs

  private constructor() {}

  public static getInstance(): ValidationLogger {
    if (!ValidationLogger.instance) {
      ValidationLogger.instance = new ValidationLogger();
    }
    return ValidationLogger.instance;
  }

  public logImport(
    format: DataFormat,
    reminders: Reminder[],
    validationResults: ValidationResult[],
    parseErrors: string[] = []
  ): void {
    const errors = [
      ...parseErrors,
      ...validationResults
        .flatMap((result) => result.errors)
        .filter((error) => error.severity === 'error')
        .map((error) => `${String(error.field)}: ${error.message}`),
    ];

    const warnings = validationResults
      .flatMap((result) => result.errors)
      .filter((error) => error.severity === 'warning')
      .map((error) => `${String(error.field)}: ${error.message}`);

    this.addLog({
      timestamp: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      operation: 'import',
      format,
      success: errors.length === 0,
      itemCount: reminders.length,
      errors,
      warnings,
    });
  }

  public logExport(format: ExportFormat, reminders: Reminder[], error?: Error): void {
    this.addLog({
      timestamp: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      operation: 'export',
      format,
      success: !error,
      itemCount: reminders.length,
      errors: error ? [error.message] : [],
      warnings: [],
    });
  }

  public logTemplate(format: DataFormat, error?: Error): void {
    this.addLog({
      timestamp: formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      operation: 'template',
      format,
      success: !error,
      itemCount: 0,
      errors: error ? [error.message] : [],
      warnings: [],
    });
  }

  public getLogs(): ValidationLogEntry[] {
    return [...this.logs];
  }

  public exportLog(format: DataFormat): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }

    const headers = [
      'Timestamp',
      'Operation',
      'Format',
      'Success',
      'Item Count',
      'Errors',
      'Warnings',
    ];
    const rows = this.logs.map((log) => [
      log.timestamp,
      log.operation,
      log.format,
      log.success.toString(),
      log.itemCount.toString(),
      log.errors.join('; '),
      log.warnings.join('; '),
    ]);

    return [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join(
      '\n'
    );
  }

  private addLog(entry: ValidationLogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }
}

export const validationLogger = ValidationLogger.getInstance();
