import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import React from 'react';

// Register the required components and scales
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale);

const WeatherChart = () => {
  const data = {
    labels: ['03/08', '05/08', '10/08', '15/08', '20/08', '25/08'],
    datasets: [
      {
        label: 'Rainfall',
        data: [0, 20, 15, 30, 10, 5],
        fill: false,
        borderColor: 'teal',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',  // Define 'category' type for x-axis if it's a categorical scale like dates or labels
      },
      y: {
        type: 'linear',  // Explicitly define 'linear' for y-axis to fix the error
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeatherChart;