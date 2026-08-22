import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const WardRiskBarChart = ({ wardRankings = [] }) => {
  const wards = wardRankings.length > 0 ? wardRankings.slice(0, 6) : [
    { wardName: 'Ward 04 - Lakshmipuram', avgRiskScore: 94 },
    { wardName: 'Ward 02 - Brodipet', avgRiskScore: 88 },
    { wardName: 'Ward 01 - Arundelpet', avgRiskScore: 82 },
    { wardName: 'Ward 05 - Pattabhipuram', avgRiskScore: 74 },
    { wardName: 'Ward 08 - Old Guntur', avgRiskScore: 68 },
    { wardName: 'Ward 07 - Gorantla', avgRiskScore: 52 },
  ];

  const labels = wards.map(w => w.wardName.replace('Ward ', 'W'));
  const scores = wards.map(w => w.avgRiskScore || 50);

  const backgroundColors = scores.map(s =>
    s >= 80 ? 'rgba(239, 68, 68, 0.85)' : s >= 65 ? 'rgba(249, 115, 22, 0.85)' : 'rgba(234, 179, 8, 0.85)'
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Average AI Hazard Risk Score (0-100)',
        data: scores,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return ` Composite Risk: ${context.raw} / 100`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      },
      y: {
        max: 100,
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};
