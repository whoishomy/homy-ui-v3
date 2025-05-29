'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  BarChart,
  Calendar,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validationLogger } from '@/utils/validationLog';
import type { ValidationLogEntry } from '@/utils/validationLog';

interface ValidationLogStats {
  totalOperations: number;
  successRate: number;
  errorRate: number;
  mostCommonErrors: Array<{ error: string; count: number }>;
  operationBreakdown: Record<string, number>;
  formatBreakdown: Record<string, number>;
}

const calculateStats = (logs: ValidationLogEntry[]): ValidationLogStats => {
  const stats: ValidationLogStats = {
    totalOperations: logs.length,
    successRate: 0,
    errorRate: 0,
    mostCommonErrors: [],
    operationBreakdown: {},
    formatBreakdown: {},
  };

  // Calculate success and error rates
  const successCount = logs.filter((log) => log.success).length;
  stats.successRate = (successCount / logs.length) * 100;
  stats.errorRate = 100 - stats.successRate;

  // Count operations and formats
  logs.forEach((log) => {
    stats.operationBreakdown[log.operation] = (stats.operationBreakdown[log.operation] || 0) + 1;
    stats.formatBreakdown[log.format] = (stats.formatBreakdown[log.format] || 0) + 1;
  });

  // Analyze common errors
  const errorMap = new Map<string, number>();
  logs.forEach((log) => {
    log.errors.forEach((error) => {
      errorMap.set(error, (errorMap.get(error) || 0) + 1);
    });
  });

  stats.mostCommonErrors = Array.from(errorMap.entries())
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return stats;
};

const LogEntry: React.FC<{ entry: ValidationLogEntry }> = ({ entry }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      className="mb-2 rounded-lg border bg-card p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {entry.success ? (
            <CheckCircle className="h-5 w-5 text-success" />
          ) : (
            <XCircle className="h-5 w-5 text-destructive" />
          )}
          <div>
            <p className="text-sm font-medium">
              {entry.operation.charAt(0).toUpperCase() + entry.operation.slice(1)} Operation
            </p>
            <p className="text-xs text-muted-foreground">
              {entry.timestamp} • {entry.format.toUpperCase()} • {entry.itemCount} items
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          {isExpanded ? 'Less' : 'More'} Details
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            {entry.errors.length > 0 && (
              <div className="mb-3">
                <p className="mb-1 text-sm font-medium text-destructive">Errors:</p>
                <ul className="list-inside list-disc space-y-1">
                  {entry.errors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {entry.warnings.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-medium text-warning">Warnings:</p>
                <ul className="list-inside list-disc space-y-1">
                  {entry.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-warning">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}> = ({ title, value, icon, description }) => (
  <div className="rounded-lg border bg-card p-4 shadow-sm">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  </div>
);

export function ValidationLogViewer() {
  const [filter, setFilter] = React.useState('');
  const [selectedOperation, setSelectedOperation] = React.useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState('list');

  const logs = validationLogger.getLogs();
  const stats = React.useMemo(() => calculateStats(logs), [logs]);

  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      if (selectedOperation && log.operation !== selectedOperation) return false;
      if (selectedFormat && log.format !== selectedFormat) return false;
      if (!filter) return true;

      const searchStr = filter.toLowerCase();
      return (
        log.operation.toLowerCase().includes(searchStr) ||
        log.format.toLowerCase().includes(searchStr) ||
        log.errors.some((e) => e.toLowerCase().includes(searchStr)) ||
        log.warnings.some((w) => w.toLowerCase().includes(searchStr))
      );
    });
  }, [logs, filter, selectedOperation, selectedFormat]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Validation Log</h2>
        <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List className="flex gap-2">
            <Tabs.Trigger
              value="list"
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <FileText className="h-4 w-4" />
              Log List
            </Tabs.Trigger>
            <Tabs.Trigger
              value="analytics"
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart className="h-4 w-4" />
              Analytics
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      <Tabs.Content value="list" className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedOperation(null)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(stats.operationBreakdown).map(([operation, count]) => (
            <Button
              key={operation}
              variant={selectedOperation === operation ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                setSelectedOperation(selectedOperation === operation ? null : operation)
              }
              className="gap-2"
            >
              {operation}
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">{count}</span>
            </Button>
          ))}
        </div>

        <ScrollArea.Root className="h-[600px]">
          <ScrollArea.Viewport className="h-full w-full">
            <div className="space-y-2">
              {filteredLogs.map((log, index) => (
                <LogEntry key={index} entry={log} />
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            orientation="vertical"
            className="flex w-2.5 touch-none select-none bg-transparent"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-full bg-muted" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Tabs.Content>

      <Tabs.Content value="analytics" className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Operations"
            value={stats.totalOperations}
            icon={<RefreshCw className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate.toFixed(1)}%`}
            icon={<CheckCircle className="h-5 w-5 text-success" />}
          />
          <StatCard
            title="Error Rate"
            value={`${stats.errorRate.toFixed(1)}%`}
            icon={<AlertTriangle className="h-5 w-5 text-destructive" />}
          />
          <StatCard
            title="Most Active Time"
            value={format(new Date(), 'HH:mm')}
            icon={<Clock className="h-5 w-5 text-primary" />}
            description="Based on operation frequency"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-sm font-medium">Most Common Errors</h3>
            <div className="space-y-3">
              {stats.mostCommonErrors.map(({ error, count }, index) => (
                <div key={index} className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-4 text-sm font-medium">Operation Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(stats.operationBreakdown).map(([operation, count]) => (
                <div key={operation} className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {operation.charAt(0).toUpperCase() + operation.slice(1)}
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Tabs.Content>
    </div>
  );
}
