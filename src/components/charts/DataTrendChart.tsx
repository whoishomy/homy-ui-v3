'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ScaleType,
  Scale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  title: string;
  data: { date: string; value: number }[];
  valueUnit: string;
  valueLabel: string;
  referenceRange?: {
    min: number;
    max: number;
  };
}

export const DataTrendChart = ({ title, data, valueUnit, valueLabel, referenceRange }: Props) => {
  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString('tr-TR')),
    datasets: [
      {
        label: valueLabel,
        data: data.map((d) => d.value),
        borderColor: 'rgb(74, 144, 226)',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        tension: 0.4,
        fill: true,
      },
      // Reference range lines
      ...(referenceRange
        ? [
            {
              label: 'Min',
              data: Array(data.length).fill(referenceRange.min),
              borderColor: 'rgba(255, 183, 77, 0.5)',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Max',
              data: Array(data.length).fill(referenceRange.max),
              borderColor: 'rgba(255, 183, 77, 0.5)',
              borderDash: [5, 5],
              pointRadius: 0,
              fill: '-1',
              backgroundColor: 'rgba(255, 183, 77, 0.1)',
            },
          ]
        : []),
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            let label = `${valueLabel}: ${value} ${valueUnit}`;

            if (referenceRange) {
              if (value < referenceRange.min) {
                label += ` (Düşük)`;
              } else if (value > referenceRange.max) {
                label += ` (Yüksek)`;
              } else {
                label += ` (Normal)`;
              }
            }

            return label;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          font: {
            size: 10,
          },
        },
      },
      y: {
        type: 'linear',
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 10,
          },
          callback: function (value) {
            return `${value} ${valueUnit}`;
          },
        },
        ...(referenceRange && {
          min: Math.min(referenceRange.min * 0.8, Math.min(...data.map((d) => d.value))),
          max: Math.max(referenceRange.max * 1.2, Math.max(...data.map((d) => d.value))),
        }),
      },
    },
  };

  return (
    <div className="h-32">
      <Line data={chartData} options={options} />
    </div>
  );
};
