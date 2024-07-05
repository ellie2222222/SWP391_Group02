import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import axiosInstance from '../utils/axiosInstance';
import { Box, Typography, MenuItem, FormControl, Select, InputLabel } from '@mui/material';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [period, setPeriod] = useState('year'); // Default period

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const initialChartData = () => ({
    labels: [],
    datasets: [
      {
        label: 'Total Revenue (VND)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  });

  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axiosInstance.get(`/analytics/revenue?period=${period}`);
        const revenueData = response.data.totalRevenue;

        const data = months.map((month, index) => {
          const monthData = revenueData.find(item => new Date(item.month).getMonth() === index);
          return monthData ? monthData.totalRevenue : 0;
        });

        setTotalRevenue(data.reduce((acc, val) => acc + val, 0));

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Revenue (VND)',
              data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              fill: false,
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
    <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 7 }}>
      <Typography variant="h2" gutterBottom>
        Total Revenue Dashboard
      </Typography>
      <FormControl variant="outlined" sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel id="period-select-label">Period</InputLabel>
        <Select
          labelId="period-select-label"
          value={period}
          onChange={handlePeriodChange}
          label="Period"
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="quarter">Quarter</MenuItem>
          <MenuItem value="year">Year</MenuItem>
        </Select>
      </FormControl>
      <Line data={chartData} options={{
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
              }
            }
          }
        }
      }} />
    </Box>
  );
};

export default DashboardContent;
