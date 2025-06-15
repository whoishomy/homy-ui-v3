'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  List,
  GanttChart,
  CalendarDays,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Switch } from '@/components/ui/Switch';
import { useHealthGoalStore } from '@/stores/healthGoalStore';
import { CATEGORY_ICONS } from '@/components/health/HealthGoalTracker';
import type {
  TimelineEvent,
  TimelineFilter,
  TimeScale,
  TimelineViewMode,
  TimelineGroup,
} from '@/types/timeline';
import {
  goalToTimelineEvent,
  filterTimelineEvents,
  timelineFilterSchema,
  groupTimelineEvents,
} from '@/types/timeline';
import type { HealthGoalCategory } from '@/types/healthGoal';

interface TimelineViewProps {
  className?: string;
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filter: TimelineFilter;
  onFilterChange: (filter: TimelineFilter) => void;
}

function FilterModal({ open, onOpenChange, filter, onFilterChange }: FilterModalProps) {
  const [localFilter, setLocalFilter] = React.useState(filter);

  React.useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const handleSave = () => {
    onFilterChange(localFilter);
    onOpenChange(false);
  };

  const handleCategoryToggle = (category: HealthGoalCategory) => {
    const categories = localFilter.categories || [];
    const newCategories = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    setLocalFilter((prev) => ({ ...prev, categories: newCategories }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Timeline</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Categories */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(CATEGORY_ICONS).map(([category]) => (
                <Button
                  key={category}
                  variant={
                    localFilter.categories?.includes(category as HealthGoalCategory)
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  onClick={() => handleCategoryToggle(category as HealthGoalCategory)}
                  className="justify-start gap-2"
                >
                  {CATEGORY_ICONS[category as HealthGoalCategory]}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* View Mode */}
          <div className="space-y-2">
            <label className="text-sm font-medium">View Mode</label>
            <Select
              value={localFilter.viewMode}
              onValueChange={(viewMode: TimelineViewMode) =>
                setLocalFilter((prev) => ({ ...prev, viewMode }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">List View</SelectItem>
                <SelectItem value="calendar">Calendar View</SelectItem>
                <SelectItem value="gantt">Gantt View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Time Scale */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Scale</label>
            <Select
              value={localFilter.scale}
              onValueChange={(scale: TimeScale) => setLocalFilter((prev) => ({ ...prev, scale }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Show Completed */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Show Completed Goals</label>
            <Switch
              checked={localFilter.showCompleted}
              onCheckedChange={(checked: boolean) =>
                setLocalFilter((prev) => ({ ...prev, showCompleted: checked }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TimelineView({ className }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [filter, setFilter] = React.useState<TimelineFilter>({
    startDate: startOfWeek(currentDate, { locale: tr }),
    endDate: endOfWeek(currentDate, { locale: tr }),
    viewMode: 'list',
    scale: 'week',
    showCompleted: true,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);

  const goals = useHealthGoalStore((state) => state.goals);

  // Convert goals to timeline events
  const events = React.useMemo(() => {
    return goals.map(goalToTimelineEvent);
  }, [goals]);

  // Filter events based on current filter
  const filteredEvents = React.useMemo(() => {
    return filterTimelineEvents(events, filter);
  }, [events, filter]);

  // Navigation handlers
  const handlePrevious = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    setFilter((prev) => ({
      ...prev,
      startDate: startOfWeek(newDate, { locale: tr }),
      endDate: endOfWeek(newDate, { locale: tr }),
    }));
  };

  const handleNext = () => {
    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    setFilter((prev) => ({
      ...prev,
      startDate: startOfWeek(newDate, { locale: tr }),
      endDate: endOfWeek(newDate, { locale: tr }),
    }));
  };

  // View mode handlers
  const handleViewModeChange = (mode: TimelineViewMode) => {
    setFilter((prev) => ({ ...prev, viewMode: mode }));
  };

  const handleScaleChange = (scale: TimeScale) => {
    setFilter((prev) => ({ ...prev, scale: scale }));
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Timeline</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleViewModeChange('list')}
            data-active={filter.viewMode === 'list'}
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleViewModeChange('calendar')}
            data-active={filter.viewMode === 'calendar'}
          >
            <CalendarDays className="h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleViewModeChange('gantt')}
            data-active={filter.viewMode === 'gantt'}
          >
            <GanttChart className="h-4 w-4" />
            Gantt
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[120px] text-center font-medium">
            {format(currentDate, 'MMMM yyyy', { locale: tr })}
          </div>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filter.scale} onValueChange={handleScaleChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select scale" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Daily</SelectItem>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsFilterModalOpen(true)}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="rounded-lg border bg-card">
        <AnimatePresence mode="wait">
          {filter.viewMode === 'list' && <TimelineList key="list" events={filteredEvents} />}
          {filter.viewMode === 'calendar' && (
            <TimelineCalendar key="calendar" events={filteredEvents} currentDate={currentDate} />
          )}
          {filter.viewMode === 'gantt' && <TimelineGantt key="gantt" events={filteredEvents} />}
        </AnimatePresence>
      </div>

      <FilterModal
        open={isFilterModalOpen}
        onOpenChange={setIsFilterModalOpen}
        filter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
}

interface TimelineListProps {
  events: TimelineEvent[];
}

function TimelineList({ events }: TimelineListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="divide-y"
    >
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-center justify-between p-4 transition-colors hover:bg-accent/5"
        >
          <div className="flex items-center gap-3">
            {CATEGORY_ICONS[event.category as HealthGoalCategory]}
            <div>
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {format(event.startDate, 'PPP', { locale: tr })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{event.progress.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Progress</div>
            </div>
            <div
              className="h-2 w-24 rounded-full bg-primary/20"
              role="progressbar"
              aria-valuenow={event.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${event.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

interface TimelineCalendarProps {
  events: TimelineEvent[];
  currentDate: Date;
}

function TimelineCalendar({ events, currentDate }: TimelineCalendarProps) {
  const days = React.useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(currentDate, { locale: tr }),
      end: endOfWeek(currentDate, { locale: tr }),
    });
  }, [currentDate]);

  // Group events by day
  const eventsByDay = React.useMemo(() => {
    const groups = groupTimelineEvents(events, 'day', days[0], days[days.length - 1]);
    return Object.fromEntries(
      groups.map((group: TimelineGroup) => [format(group.date, 'yyyy-MM-dd'), group.events])
    );
  }, [events, days]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-7 gap-px bg-muted p-4"
    >
      {/* Calendar header */}
      {days.map((day) => (
        <div key={day.toString()} className="p-2 text-center">
          <div className="text-sm font-medium">{format(day, 'EEE', { locale: tr })}</div>
          <div className="mt-1 text-2xl font-bold">{format(day, 'd')}</div>
        </div>
      ))}

      {/* Calendar events */}
      {days.map((day) => {
        const dayEvents = eventsByDay[format(day, 'yyyy-MM-dd')] || [];
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={day.toString()}
            className={`min-h-[120px] space-y-1 p-2 ${isToday ? 'bg-primary/5' : 'bg-card'}`}
          >
            {dayEvents.map((event: TimelineEvent) => (
              <div
                key={event.id}
                className="group relative flex items-center gap-2 rounded-md bg-primary/10 px-2 py-1 text-sm"
              >
                {CATEGORY_ICONS[event.category as HealthGoalCategory]}
                <span className="truncate font-medium">{event.title}</span>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-full bg-primary/20">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${event.progress}%` }}
                  />
                </div>

                {/* Tooltip */}
                <div className="invisible absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-full rounded-md bg-popover p-2 text-xs opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-muted-foreground">Progress: {event.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </motion.div>
  );
}

interface TimelineGanttProps {
  events: TimelineEvent[];
}

function TimelineGantt({ events }: TimelineGanttProps) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sort events by start date
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events]);

  // Calculate timeline range
  const timelineRange = React.useMemo(() => {
    if (events.length === 0) return { start: new Date(), end: new Date() };

    const start = new Date(Math.min(...events.map((e) => e.startDate.getTime())));
    const end = new Date(
      Math.max(...events.map((e) => e.endDate?.getTime() || e.startDate.getTime()))
    );

    // Ensure at least a week is shown
    if (end.getTime() - start.getTime() < 7 * 24 * 60 * 60 * 1000) {
      end.setDate(end.getDate() + 7);
    }

    return { start, end };
  }, [events]);

  // Generate timeline headers
  const timelineHeaders = React.useMemo(() => {
    const days = eachDayOfInterval({
      start: timelineRange.start,
      end: timelineRange.end,
    });

    return days.map((day) => ({
      date: day,
      label: format(day, 'd MMM', { locale: tr }),
    }));
  }, [timelineRange]);

  // Handle horizontal scroll
  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    containerRef.current.scrollLeft += scrollAmount;
    setScrollPosition(containerRef.current.scrollLeft);
  };

  if (events.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No events to display
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      {/* Scroll buttons */}
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleScroll('left')}
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button variant="ghost" size="sm" onClick={() => handleScroll('right')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Timeline container */}
      <div ref={containerRef} className="overflow-x-auto" style={{ scrollBehavior: 'smooth' }}>
        <div className="min-w-[800px]">
          {/* Timeline header */}
          <div className="flex border-b">
            <div className="w-48 shrink-0 border-r bg-muted p-2">
              <span className="text-sm font-medium">Goals</span>
            </div>
            <div className="flex flex-1">
              {timelineHeaders.map((header) => (
                <div
                  key={header.date.toString()}
                  className="w-10 shrink-0 border-r p-2 text-center"
                >
                  <span className="text-xs font-medium">{header.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline rows */}
          <div className="divide-y">
            {sortedEvents.map((event) => {
              const startIndex = timelineHeaders.findIndex(
                (h) => format(h.date, 'yyyy-MM-dd') === format(event.startDate, 'yyyy-MM-dd')
              );
              const endIndex = event.endDate
                ? timelineHeaders.findIndex(
                    (h) => format(h.date, 'yyyy-MM-dd') === format(event.endDate!, 'yyyy-MM-dd')
                  )
                : startIndex;
              const duration = endIndex - startIndex + 1;

              return (
                <div key={event.id} className="flex">
                  <div className="flex w-48 shrink-0 items-center gap-2 border-r p-2">
                    {CATEGORY_ICONS[event.category as HealthGoalCategory]}
                    <span className="truncate text-sm font-medium">{event.title}</span>
                  </div>
                  <div className="relative flex flex-1">
                    <div
                      className="absolute top-1/2 h-6 -translate-y-1/2 rounded bg-primary/10"
                      style={{
                        left: `${startIndex * 40}px`,
                        width: `${duration * 40}px`,
                      }}
                    >
                      <div
                        className="h-full rounded bg-primary/30 transition-all"
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                    {timelineHeaders.map((header) => (
                      <div key={header.date.toString()} className="w-10 shrink-0 border-r" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
