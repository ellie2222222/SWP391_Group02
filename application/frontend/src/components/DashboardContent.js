import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '../utils/axiosInstance';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [period, setPeriod] = useState('year'); // Default period
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Revenue',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstance.get(`/analytics/revenue?period=${period}`);
        setTotalRevenue(response.data.totalRevenue);

        setChartData({
          labels: [period.charAt(0).toUpperCase() + period.slice(1)],
          datasets: [
            {
              label: 'Total Revenue',
              data: [response.data.totalRevenue],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenueData();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  return (
    <div style={{ width: '50%', margin: '0 auto' }}>
      <h2>Total Revenue Dashboard</h2>
      <select value={period} onChange={handlePeriodChange}>
        <option value="month">Month</option>
        <option value="quarter">Quarter</option>
        <option value="year">Year</option>
      </select>
      <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
    </div>
  );
};

export default DashboardContent;
