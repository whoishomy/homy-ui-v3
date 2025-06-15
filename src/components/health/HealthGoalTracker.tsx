'use client';

import * as React from 'react';
import {
  Activity,
  Plus,
  Filter,
  Calendar,
  BarChart2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pill,
  Dumbbell,
  Apple,
  Heart,
  Moon,
  Brain,
  Edit2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { useHealthGoalStore } from '@/stores/healthGoalStore';
import type { HealthGoalCategory, HealthGoalWithProgress, HealthGoal } from '@/types/healthGoal';
import { GoalFormDialog } from './GoalFormDialog';

export const CATEGORY_ICONS: Record<HealthGoalCategory, React.ReactNode> = {
  medication: <Pill className="h-5 w-5" />,
  exercise: <Dumbbell className="h-5 w-5" />,
  nutrition: <Apple className="h-5 w-5" />,
  vitals: <Heart className="h-5 w-5" />,
  sleep: <Moon className="h-5 w-5" />,
  mental: <Brain className="h-5 w-5" />,
};

interface GoalCardProps {
  goal: HealthGoalWithProgress;
  onSelect: () => void;
  onEdit: (goal: Partial<HealthGoal> & { id: string }) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onSelect, onEdit }) => {
  const {
    id,
    title,
    description,
    category,
    startDate,
    endDate,
    frequency,
    status,
    metrics,
    reminders,
    tags,
    notes,
    completionRate,
    streak,
    nextDue,
  } = goal;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit({
      id,
      title,
      description,
      category,
      startDate,
      endDate,
      frequency,
      status,
      metrics,
      reminders,
      tags,
      notes,
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/5"
      onClick={onSelect}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {CATEGORY_ICONS[category]}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Goal
            </p>
          </div>
        </div>
        {status === 'active' && (
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium">Active</span>
          </div>
        )}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Completion</p>
          <p className="text-lg font-semibold">{completionRate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-lg font-semibold">{streak} days</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Next Due</p>
          <p className="text-lg font-semibold">{nextDue ? nextDue.toLocaleDateString() : '—'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {metrics.map((metric, index) => (
            <span
              key={index}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {metric.name}
            </span>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleEdit}>
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit goal</span>
        </Button>
      </div>
    </motion.div>
  );
};

export function HealthGoalTracker() {
  const [filter, setFilter] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<HealthGoalCategory | null>(null);
  const [activeTab, setActiveTab] = React.useState('active');
  const [isGoalFormOpen, setIsGoalFormOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState<
    (Partial<HealthGoal> & { id?: string }) | null
  >(null);

  const goals = useHealthGoalStore((state) => state.goals);
  const getActiveGoals = useHealthGoalStore((state) => state.getActiveGoals);
  const getGoalsByCategory = useHealthGoalStore((state) => state.getGoalsByCategory);

  const handleGoalEdit = (goal: Partial<HealthGoal> & { id: string }) => {
    setSelectedGoal(goal);
    setIsGoalFormOpen(true);
  };

  const filteredGoals = React.useMemo(() => {
    let filtered = activeTab === 'active' ? getActiveGoals() : goals;

    if (selectedCategory) {
      filtered = getGoalsByCategory(selectedCategory);
    }

    if (filter) {
      const searchStr = filter.toLowerCase();
      filtered = filtered.filter(
        (goal) =>
          goal.title.toLowerCase().includes(searchStr) ||
          goal.description?.toLowerCase().includes(searchStr) ||
          goal.metrics.some((m) => m.name.toLowerCase().includes(searchStr))
      );
    }

    return filtered;
  }, [goals, filter, selectedCategory, activeTab, getActiveGoals, getGoalsByCategory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Health Goals</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setSelectedGoal(null);
              setIsGoalFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search goals..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Clear Filters
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {Object.entries(CATEGORY_ICONS).map(([category, icon]) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              setSelectedCategory(
                selectedCategory === category ? null : (category as HealthGoalCategory)
              )
            }
            className="gap-2"
          >
            {icon}
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex gap-2">
          <Tabs.Trigger
            value="active"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <CheckCircle className="h-4 w-4" />
            Active Goals
          </Tabs.Trigger>
          <Tabs.Trigger
            value="all"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Activity className="h-4 w-4" />
            All Goals
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onSelect={() => {}} onEdit={handleGoalEdit} />
          ))}
        </AnimatePresence>
      </div>

      <GoalFormDialog
        open={isGoalFormOpen}
        onOpenChange={setIsGoalFormOpen}
        defaultValues={selectedGoal ?? undefined}
      />
    </div>
  );
}
