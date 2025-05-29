import React from 'react';
import { Switch, Select, MenuItem, TextField, Button, SelectChangeEvent } from '@mui/material';
import { Filter, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DateRange {
  start: string;
  end: string;
}

interface LabResultFilters {
  category: string;
  status: string;
  dateRange: DateRange;
  hasAiInsight: boolean;
}

interface Props {
  filters: LabResultFilters;
  onFilterChange: (filters: LabResultFilters) => void;
  className?: string;
}

export const LabResultFilterPanel: React.FC<Props> = ({ filters, onFilterChange, className }) => {
  const handleCategoryChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      category: event.target.value,
    });
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      status: event.target.value,
    });
  };

  const handleDateChange = (type: 'start' | 'end') => (date: string | null) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: date || '',
      },
    });
  };

  const handleAiInsightToggle = () => {
    onFilterChange({
      ...filters,
      hasAiInsight: !filters.hasAiInsight,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      category: '',
      status: '',
      dateRange: { start: '', end: '' },
      hasAiInsight: false,
    });
  };

  return (
    <div className={cn('p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtreler
        </h2>
        <Button
          onClick={handleClearFilters}
          startIcon={<X className="w-4 h-4" />}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Filtreleri Temizle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <Select
          value={filters.category}
          onChange={handleCategoryChange}
          displayEmpty
          className="w-full"
          aria-label="Kategori"
        >
          <MenuItem value="">Tüm Kategoriler</MenuItem>
          <MenuItem value="blood">Kan</MenuItem>
          <MenuItem value="urine">İdrar</MenuItem>
          <MenuItem value="imaging">Görüntüleme</MenuItem>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onChange={handleStatusChange}
          displayEmpty
          className="w-full"
          aria-label="Durum"
        >
          <MenuItem value="">Tüm Durumlar</MenuItem>
          <MenuItem value="normal">Normal</MenuItem>
          <MenuItem value="abnormal">Anormal</MenuItem>
          <MenuItem value="critical">Kritik</MenuItem>
        </Select>
      </div>

      {/* Date Range Filter */}
      <div
        role="group"
        aria-label="Tarih Aralığı"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <TextField
          label="Başlangıç Tarihi"
          type="date"
          value={filters.dateRange.start}
          onChange={(e) => handleDateChange('start')(e.target.value)}
          className="w-full"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Bitiş Tarihi"
          type="date"
          value={filters.dateRange.end}
          onChange={(e) => handleDateChange('end')(e.target.value)}
          className="w-full"
          InputLabelProps={{ shrink: true }}
        />
      </div>

      {/* AI Insight Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Sadece AI İçgörülü Sonuçlar
        </span>
        <Switch
          checked={filters.hasAiInsight}
          onChange={handleAiInsightToggle}
          aria-label="AI Insight"
          color="primary"
        />
      </div>
    </div>
  );
};
