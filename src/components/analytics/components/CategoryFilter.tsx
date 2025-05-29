import React from 'react';
import { HealthCategory } from '@/types/analytics';

interface CategoryFilterProps {
  selected: Array<keyof typeof HealthCategory>;
  onChange: (categories: Array<keyof typeof HealthCategory>) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selected,
  onChange,
}) => {
  const handleToggle = (category: keyof typeof HealthCategory) => {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else {
      onChange([...selected, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(HealthCategory).map(([key, label]) => (
        <button
          key={key}
          onClick={() => handleToggle(key as keyof typeof HealthCategory)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selected.includes(key as keyof typeof HealthCategory)
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}; 