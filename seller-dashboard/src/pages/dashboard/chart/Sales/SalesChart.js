import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import TopSellingProducts from './TopSellingProducts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => Math.random() * 1001, Math.random() * 1001),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => Math.random() * 1001, Math.random() * 1001),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export function SalesChart() {
  return (
    <div>
      <TopSellingProducts />
      <div className="bg-white shadow-md rounded-lg p-6 mt-10">
        <h2 className="text-lg font-medium mb-4">Sales Analysis</h2>
        <div className="flex justify-between">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  )
}

export default SalesChart