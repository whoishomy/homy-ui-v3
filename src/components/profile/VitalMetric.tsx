interface Props {
  label: string;
  value: string;
  unit?: string;
}

export const VitalMetric = ({ label, value, unit }: Props) => {
  return (
    <div className="text-center space-y-1">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900 dark:text-white">
        {value} {unit && <span className="text-sm font-normal text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}; 