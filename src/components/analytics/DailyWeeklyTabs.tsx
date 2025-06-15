'use client';

import { Tabs, TabsList, TabsTrigger, TabsProps } from '@/components/ui/Tabs';

interface DailyWeeklyTabsProps {
  value: 'daily' | 'weekly';
  onValueChange: (value: 'daily' | 'weekly') => void;
}

export function DailyWeeklyTabs({ value, onValueChange }: DailyWeeklyTabsProps) {
  return (
    <div className="flex items-center justify-between">
      <Tabs
        value={value}
        onValueChange={(value: TabsProps['value']) => onValueChange(value as 'daily' | 'weekly')}
        className="w-full max-w-[200px]"
      >
        <TabsList className="w-full">
          <TabsTrigger value="daily" className="flex-1">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1">
            Weekly
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
