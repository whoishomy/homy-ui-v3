'use client';

import { forwardRef } from 'react';
import { Select } from './Select';
import { useTranslation } from 'next-i18next';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const LanguageSelector = forwardRef<HTMLSelectElement, LanguageSelectorProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const { t } = useTranslation('common');

    return (
      <Select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        {...props}
      >
        <option value="tr">{t('languages.tr')}</option>
        <option value="en">{t('languages.en')}</option>
      </Select>
    );
  }
);
