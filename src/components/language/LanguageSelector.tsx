'use client';

import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils/cn';
import type { Language } from '@/hooks/useLanguage';

const languages = [
  { code: 'tr' as const, label: 'Türkçe' },
  { code: 'en' as const, label: 'English' },
] as const;

type LanguageSelectorProps = {
  value: Language;
  onChange: (value: Language) => void;
  className?: string;
};

const LanguageSelector = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  LanguageSelectorProps
>(({ value, onChange, className }, ref) => (
  <SelectPrimitive.Root value={value} onValueChange={onChange}>
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex h-10 w-[120px] items-center justify-between rounded-md border border-input',
        'bg-background px-3 py-2 text-sm ring-offset-background',
        'placeholder:text-muted-foreground focus:outline-none focus:ring-2',
        'focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <SelectPrimitive.Value>
        {languages.find(lang => lang.code === value)?.label}
      </SelectPrimitive.Value>
      <SelectPrimitive.Icon>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'relative z-50 min-w-[120px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
        )}
      >
        <SelectPrimitive.Viewport className="p-1">
          {languages.map(({ code, label }) => (
            <SelectPrimitive.Item
              key={code}
              value={code}
              className={cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
                'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                code === value && 'bg-accent/50'
              )}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                  <Check className="h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
              </span>
              <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  </SelectPrimitive.Root>
)) as React.ForwardRefExoticComponent<
  LanguageSelectorProps & React.RefAttributes<HTMLButtonElement>
>;

LanguageSelector.displayName = 'LanguageSelector';

export { LanguageSelector }; 