import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const SeverityDonutChart = ({ summary }) => {
  const critical = summary?.criticalHazards || 2;
  const high = summary?.highHazards || 3;
  const medium = summary?.mediumHazards || 2;
  const low = summary?.lowHazards || 1;

  const data = {
    labels: ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [critical, high, medium, low],
        backgroundColor: [
          '#ef4444', // red
          '#f97316', // orange
          '#eab308', // yellow
          '#10b981', // green
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          padding: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return ` ${context.label}: ${context.raw} incidents`;
          }
        }
      }
    },
    cutout: '70%',
  };

  return (
    <div className="h-56 relative flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-2xl font-extrabold font-mono text-slate-800">
          {critical + high + medium + low}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400">
          Total Grievances
        </span>
      </div>
    </div>
  );
};
