import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Typography, MenuItem, FormControl, Select, InputLabel, styled } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import LineChart from './LineChart';

const CustomFormControl = styled(FormControl)({
  minWidth: 120,
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
  },
});

const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalRequest, setTotalRequest] = useState(0);
  const [allRevenue, setAllRevenue] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [period, setPeriod] = useState('year');
  const [revenueData, setRevenueData] = useState([]);
  const [monthValue, setMonthValue] = useState(new Date().getMonth() + 1);
  const [quarterValue, setQuarterValue] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [yearValue, setYearValue] = useState(new Date().getFullYear());
  const [recentInvoices, setRecentInvoices] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchGraphRevenue = async () => {
    try {
      let response;

      if (period === 'month') {
        response = await axiosInstance.get(`/analytics/daily-revenue`, {
          params: { period: 'month', monthValue, yearValue }
        });
      } else if (period === 'quarter') {
        response = await axiosInstance.get(`/analytics/quarterly-revenue`, {
          params: { period: 'quarter', quarterValue, yearValue }
        });
      } else if (period === 'year') {
        response = await axiosInstance.get(`/analytics/monthly-revenue`, {
          params: { period: 'year', yearValue }
        });
      }

      setTotalRevenue(response.data.totalRevenue);
      setRevenueData(response.data.data);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/total-revenue`)

      setAllRevenue(response.data.totalRevenue);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentInvoices = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/recent-invoices`)

      setRecentInvoices(response.data.invoices);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchTotalRequests = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/completed-requests`)

      setTotalRequest(response.data.totalCompletedRequests);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchAllCustomers = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/all-customers`)

      setCustomers(response.data.customers);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAllCustomers();
    fetchTotalRequests();
    fetchRecentInvoices();
    fetchTotalRevenue();
    fetchGraphRevenue();
  }, [period, monthValue, quarterValue, yearValue]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const getRevenueText = () => {
    if (period === 'year') {
      return `Monthly revenue in ${yearValue}`;
    } else if (period === 'month') {
      return `Daily revenue in ${months[monthValue - 1]} ${yearValue}`;
    } else if (period === 'quarter') {
      return `Quarterly revenue in Q${quarterValue} ${yearValue}`;
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 7, backgroundColor: 'white' }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="150px" gap="20px" mb={3}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gridColumn="span 4" gap="2rem" borderRadius='5px' border="1px solid #b48c72">
          <Box display="flex" alignItems="center" justifyContent="center">
            <PersonIcon sx={{ fontSize: '2rem', mr: 1 }} />
            <Typography variant='h4'>Total customers</Typography>
          </Box>
          <Typography variant='h4'>{customers}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gridColumn="span 4" gap="2rem" borderRadius='5px' border="1px solid #b48c72">
          <Box display="flex" alignItems="center" justifyContent="center">
            <ShoppingCartIcon sx={{ fontSize: '2rem', mr: 1 }} />
            <Typography variant='h4'>Total requests</Typography>
          </Box>
          <Typography variant='h4'>{totalRequest}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gridColumn="span 4" gap="2rem" borderRadius='5px' border="1px solid #b48c72">
          <Box display="flex" alignItems="center" justifyContent="center">
            <PaidIcon sx={{ fontSize: '2rem', mr: 1 }} />
            <Typography variant='h4'>Total revenue generated</Typography>
          </Box>
          <Typography variant='h4'>{allRevenue.toLocaleString()}₫</Typography>
        </Box>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="200px" gap="20px" mb={3}>
        <Box gridRow="span 2" gridColumn="span 12" gap="2rem" borderRadius='5px' border="1px solid #b48c72">
          <Box display='flex' alignItems="center" justifyContent="space-between" padding='0 30px' mt={2}>
            <Box>
              <Typography variant='h4'>{getRevenueText()}</Typography>
              <Typography variant='h4'>Total: {totalRevenue.toLocaleString()}₫</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <CustomFormControl>
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
              </CustomFormControl>
              {period === 'month' && (
                <CustomFormControl>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={monthValue}
                    onChange={(e) => setMonthValue(e.target.value)}
                    label="Month"
                  >
                    {months.map((month, index) => (
                      <MenuItem key={month} value={index + 1}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </CustomFormControl>
              )}
              {period === 'quarter' && (
                <CustomFormControl>
                  <InputLabel id="quarter-select-label">Quarter</InputLabel>
                  <Select
                    labelId="quarter-select-label"
                    value={quarterValue}
                    onChange={(e) => setQuarterValue(e.target.value)}
                    label="Quarter"
                  >
                    <MenuItem value={1}>Q1</MenuItem>
                    <MenuItem value={2}>Q2</MenuItem>
                    <MenuItem value={3}>Q3</MenuItem>
                    <MenuItem value={4}>Q4</MenuItem>
                  </Select>
                </CustomFormControl>
              )}
              <CustomFormControl>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={yearValue}
                  onChange={(e) => setYearValue(e.target.value)}
                  label="Year"
                >
                  {/* Generate a range of years */}
                  {Array.from({ length: 10 }, (_, index) => (
                    <MenuItem key={index} value={new Date().getFullYear() - index}>
                      {new Date().getFullYear() - index}
                    </MenuItem>
                  ))}
                </Select>
              </CustomFormControl>
            </Box>
          </Box>

          <Box height="80%" width='100%' sx={{ paddingLeft: '30px' }}>
            <LineChart data={revenueData} />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection='column' gridRow="span 2" gridColumn="span 12" gap="2rem" maxHeight='470px'>
          <Box backgroundColor="#b48c72" borderRadius='5px'>
            <Typography variant='h4' p={1} sx={{ color: "#fff" }}>Recent Transactions</Typography>
          </Box>
          <Box backgroundColor="#b48c72" borderRadius='5px' display="flex" alignItems="center">
            <Typography variant='h5' p={1} sx={{ color: "#fff", fontWeight: "bold", flex: 1 }}>No</Typography>
            <Typography variant='h5' p={1} sx={{ color: "#fff", fontWeight: "bold", flex: 1 }}>Transactions ID</Typography>
            <Typography variant='h5' p={1} sx={{ color: "#fff", fontWeight: "bold", flex: 1 }}>Customer</Typography>
            <Typography variant='h5' p={1} sx={{ color: "#fff", fontWeight: "bold", flex: 1 }}>Date</Typography>
            <Typography variant='h5' p={1} sx={{ color: "#fff", fontWeight: "bold", flex: 1, textAlign: 'center' }}>Amount</Typography>
          </Box>
          <Box sx={{ overflowY: 'auto', maxHeight: '100%' }}>
            {recentInvoices.map((invoice, index) => (
              <Box key={invoice._id} p={1} borderRadius='5px' display="flex" alignItems="center" gap="20px" boxShadow={3} mb={2} bgcolor='rgba(255, 255, 255, 0.9)'>
                <Typography variant='h5' sx={{ flex: 1}}>{index + 1}</Typography>
                <Typography variant='h5' sx={{ flex: 1}}>{invoice.transaction_id._id}</Typography>
                <Typography variant='h5' sx={{ flex: 1}}>{invoice.transaction_id.request_id.user_id.email}</Typography>
                <Typography variant='h5' sx={{ flex: 1}}>{new Date(invoice.createdAt).toLocaleDateString()}</Typography>
                <Typography variant='h5' sx={{ flex: 1, padding: '10px', backgroundColor: "#b48c72", borderRadius: "10px", color: "#fff", textAlign: 'center' }}>{invoice.total_amount.toLocaleString()}₫</Typography>
              </Box>
            ))}
          </Box>
        </Box>
    </Box>
  );
};

export default DashboardContent;
