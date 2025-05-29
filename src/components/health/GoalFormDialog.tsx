'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Plus, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';

import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { useHealthGoalStore } from '@/stores/healthGoalStore';
import { healthGoalSchema, formToGoal } from '@/types/healthGoal';
import type { HealthGoal } from '@/types/healthGoal';

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<HealthGoal> & { id?: string };
}

const DEFAULT_METRICS: Record<HealthGoal['category'], HealthMetric[]> = {
  medication: [
    {
      id: 'dosage',
      name: 'Dosage',
      type: 'number',
      unit: 'mg',
      targetValue: 0,
    },
    {
      id: 'taken',
      name: 'Taken',
      type: 'boolean',
      targetValue: true,
    },
  ],
  exercise: [
    {
      id: 'duration',
      name: 'Duration',
      type: 'number',
      unit: 'minutes',
      targetValue: 30,
    },
    {
      id: 'intensity',
      name: 'Intensity',
      type: 'range',
      min: 1,
      max: 10,
      targetValue: 5,
    },
  ],
  nutrition: [
    {
      id: 'calories',
      name: 'Calories',
      type: 'number',
      unit: 'kcal',
      targetValue: 2000,
    },
    {
      id: 'water',
      name: 'Water Intake',
      type: 'number',
      unit: 'ml',
      targetValue: 2000,
    },
  ],
  vitals: [
    {
      id: 'heartRate',
      name: 'Heart Rate',
      type: 'number',
      unit: 'bpm',
      targetValue: 70,
    },
    {
      id: 'bloodPressure',
      name: 'Blood Pressure',
      type: 'options',
      options: ['Normal', 'High', 'Low'],
      targetValue: 'Normal',
    },
  ],
  sleep: [
    {
      id: 'duration',
      name: 'Duration',
      type: 'number',
      unit: 'hours',
      targetValue: 8,
    },
    {
      id: 'quality',
      name: 'Quality',
      type: 'range',
      min: 1,
      max: 5,
      targetValue: 3,
    },
  ],
  mental: [
    {
      id: 'mood',
      name: 'Mood',
      type: 'options',
      options: ['Great', 'Good', 'Neutral', 'Bad', 'Terrible'],
      targetValue: 'Good',
    },
    {
      id: 'stress',
      name: 'Stress Level',
      type: 'range',
      min: 1,
      max: 10,
      targetValue: 5,
    },
  ],
};

export function GoalFormDialog({ open, onOpenChange, defaultValues }: GoalFormDialogProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const addGoal = useHealthGoalStore(state => state.addGoal);
  const updateGoal = useHealthGoalStore(state => state.updateGoal);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HealthGoal>({
    resolver: zodResolver(healthGoalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'medication',
      startDate: new Date(),
      frequency: 'daily',
      status: 'active',
      metrics: [],
      reminders: [],
      tags: [],
      ...defaultValues,
    },
  });

  const category = watch('category');
  const startDate = watch('startDate');

  React.useEffect(() => {
    // Set default metrics when category changes
    setValue('metrics', DEFAULT_METRICS[category]);
  }, [category, setValue]);

  const onSubmit = async (data: HealthGoal) => {
    try {
      if (defaultValues?.id) {
        updateGoal(defaultValues.id, data);
        toast({
          title: 'Goal Updated',
          message: 'Your health goal has been updated successfully.',
          variant: 'success',
        });
      } else {
        addGoal(formToGoal(data));
        toast({
          title: 'Goal Created',
          message: 'Your new health goal has been created successfully.',
          variant: 'success',
        });
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        message: 'Failed to save health goal. Please try again.',
        variant: 'error',
      });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 shadow-lg data-[state=closed]:animate-slide-out-to-top-center data-[state=open]:animate-slide-in-from-top-center">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold">
              {defaultValues?.id ? 'Edit Health Goal' : 'Create Health Goal'}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-muted">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter goal title"
                error={errors.title?.message}
                {...register('title')}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter goal description (optional)"
                error={errors.description?.message}
                {...register('description')}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger error={errors.category?.message}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="vitals">Vitals</SelectItem>
                      <SelectItem value="sleep">Sleep</SelectItem>
                      <SelectItem value="mental">Mental Health</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover.Root open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <Popover.Trigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </Popover.Trigger>
                <Popover.Content
                  className="w-auto rounded-md border bg-popover p-0"
                  align="start"
                >
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DayPicker
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setIsDatePickerOpen(false);
                        }}
                        disabled={{ before: new Date() }}
                        className="border-none bg-transparent p-3"
                      />
                    )}
                  />
                </Popover.Content>
              </Popover.Root>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger error={errors.frequency?.message}>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Metrics */}
            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="rounded-md border p-4">
                {DEFAULT_METRICS[category].map((metric) => (
                  <div key={metric.id} className="mb-4 last:mb-0">
                    <div className="flex items-center justify-between">
                      <Label>{metric.name}</Label>
                      <span className="text-sm text-muted-foreground">
                        {metric.unit && `(${metric.unit})`}
                      </span>
                    </div>
                    {metric.type === 'number' && (
                      <Input
                        type="number"
                        min={metric.min}
                        max={metric.max}
                        defaultValue={metric.targetValue as number}
                        className="mt-1"
                      />
                    )}
                    {metric.type === 'boolean' && (
                      <Select defaultValue={String(metric.targetValue)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    {metric.type === 'range' && (
                      <Input
                        type="range"
                        min={metric.min}
                        max={metric.max}
                        defaultValue={metric.targetValue as number}
                        className="mt-1"
                      />
                    )}
                    {metric.type === 'options' && metric.options && (
                      <Select defaultValue={metric.targetValue as string}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {metric.options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : defaultValues?.id ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 