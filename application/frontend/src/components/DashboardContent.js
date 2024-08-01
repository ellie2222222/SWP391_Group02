//Manager dashboard
import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Box, Typography, MenuItem, FormControl, Select, InputLabel, styled, CircularProgress, Grid, Icon, CardMedia, Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import LineChart from './LineChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import GemstonesBarChart from './GemstonesBarChart';
import MaterialsBarChart from './MaterialsBarChart';
import CategoriesPieChart from './CategoriesPieChart';

const CustomFormControl = styled(FormControl)({
  // minWidth: 120,
  "& .MuiInputLabel-root": {
    fontSize: "1.3rem",
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  "& .MuiOutlinedInput-root": {
    fontSize: "1.3rem",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
  },
});

const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
})

const DashboardContent = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedRequest, setCompletedRequest] = useState(0);
  const [allRevenue, setAllRevenue] = useState(0);
  const [currentRevenue, setCurrentRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState();
  const [customers, setCustomers] = useState(0);
  const [revenueData, setRevenueData] = useState([]);
  const [periodEmployee, setPeriodEmployee] = useState('month');
  const [monthValueEmployee, setMonthValueEmployee] = useState(new Date().getMonth() + 1);
  const [yearValueEmployee, setYearValueEmployee] = useState(new Date().getFullYear());
  const [employeeRevenue, setEmployeeRevenue] = useState(0);
  const [periodGraph, setPeriodGraph] = useState('year');
  const [monthValueGraph, setMonthValueGraph] = useState(new Date().getMonth() + 1);
  const [quarterValueGraph, setQuarterValueGraph] = useState(Math.floor(new Date().getMonth() / 3) + 1);
  const [yearValueGraph, setYearValueGraph] = useState(new Date().getFullYear());
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [loadingRevenueGraph, setLoadingRevenueGraph] = useState(false);
  const [loadingRecentInvoices, setLoadingRecentInvoices] = useState(false);
  const [topSellingMaterials, setTopSellingMaterials] = useState([]);
  const [categories, setCategories] = useState([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchCategoryCounts = async () => {
    try {
      const response = await axiosInstance.get("/analytics/category-counts");
      setCategories(response.data.jewelryCategories);
    } catch (error) {

    }
  };

  const fetchTopSellingMaterials = async () => {
    try {
      const response = await axiosInstance.get("/analytics/top-selling-materials");
      setTopSellingMaterials(response.data.topMaterials);
    } catch (error) {

    }
  };

  const fetchEmployeeWithMostSales = async () => {
    try {
      if (periodEmployee === 'year') {
        setMonthValueEmployee('');
      } else if (periodEmployee !== 'year' && !monthValueEmployee) {
        setMonthValueEmployee(new Date().getMonth() + 1);
      }

      const response = await axiosInstance.get(`/analytics/top-sales-employee`, {
        params: {
          period: periodEmployee,
          monthValue: monthValueEmployee,
          yearValue: yearValueEmployee,
        }
      })

      setEmployeeRevenue(response.data.topSeller)
    } catch (error) {

    }
  };

  const fetchGraphRevenue = async () => {
    let response;
    try {
      setLoadingRevenueGraph(true);

      if (periodGraph === 'month') {
        response = await axiosInstance.get(`/analytics/daily-revenue`, {
          params: { period: 'month', monthValue: monthValueGraph, yearValue: yearValueGraph }
        });
      } else if (periodGraph === 'quarter') {
        response = await axiosInstance.get(`/analytics/quarterly-revenue`, {
          params: { period: 'quarter', monthValue: quarterValueGraph, yearValue: yearValueGraph }
        });
      } else if (periodGraph === 'year') {
        response = await axiosInstance.get(`/analytics/monthly-revenue`, {
          params: { period: 'year', yearValue: yearValueGraph }
        });
      }

      setTotalRevenue(response.data.totalRevenue);
      setRevenueData(response.data.data);

    } catch (error) {

    } finally {
      if (response) setLoadingRevenueGraph(false);
    }
  };

  const fetchCurrentRevenue = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/current-revenue?period=month`)

      setCurrentRevenue(response.data.totalRevenueCurrent);
      setRevenueGrowth(response.data.growthPercent);
    } catch (error) {

    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/total-revenue`)

      setAllRevenue(response.data.totalRevenue);
    } catch (error) {

    }
  };

  const fetchRecentInvoices = async () => {
    try {
      setLoadingRecentInvoices(true);
      const response = await axiosInstance.get(`/analytics/recent-invoices`)

      setRecentInvoices(response.data.invoices);
    } catch (error) {

    } finally {
      setLoadingRecentInvoices(false);
    }
  }

  const fetchTotalRequests = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/completed-requests`)

      setCompletedRequest(response.data.totalCompletedRequests);
    } catch (error) {

    }
  }

  const fetchAllCustomers = async () => {
    try {
      const response = await axiosInstance.get(`/analytics/all-customers`)

      setCustomers(response.data.customers);
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchEmployeeWithMostSales();
    fetchCurrentRevenue();
    fetchAllCustomers();
    fetchTotalRequests();
    fetchRecentInvoices();
    fetchTotalRevenue();
    fetchTopSellingMaterials();
    fetchCategoryCounts();
  }, []);


  useEffect(() => {
    fetchEmployeeWithMostSales();
  }, [periodEmployee, monthValueEmployee, yearValueEmployee]);

  useEffect(() => {
    fetchGraphRevenue();
  }, [periodGraph, monthValueGraph, quarterValueGraph, yearValueGraph]);

  const handlePeriodGraphChange = (event) => {
    setPeriodGraph(event.target.value);
  };

  const handlePeriodEmployeeChange = (event) => {
    setPeriodEmployee(event.target.value);
  };

  const getRevenueText = () => {
    if (periodGraph === 'year') {
      return `Monthly revenue in ${yearValueGraph}`;
    } else if (periodGraph === 'month') {
      return `Daily revenue in ${months[monthValueGraph - 1]} ${yearValueGraph}`;
    } else if (periodGraph === 'quarter') {
      return `Quarterly revenue in Q${quarterValueGraph} ${yearValueGraph}`;
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 7, backgroundColor: 'white' }}>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="150px" gap="20px" mb={3}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gap="2rem" borderRadius='5px' border="2px solid #b48c72"
          sx={{
            gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <PersonIcon fontSize='large' />
            <Typography variant='h4'>Total customers</Typography>
          </Box>
          <Typography variant='h4' sx={{ fontWeight: '300' }}>{customers}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gap="2rem" borderRadius='5px' border="2px solid #b48c72"
          sx={{
            gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <ShoppingCartIcon fontSize='large' />
            <Typography variant='h4'>Total requests</Typography>
          </Box>
          <Typography variant='h4' sx={{ fontWeight: '300' }}>{completedRequest}</Typography>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gap="2rem" borderRadius='5px' border="2px solid #b48c72"
          sx={{
            gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" textAlign='center' gap={1}>
            <PaidIcon fontSize='large' />
            <Typography variant='h4'>Total revenue generated</Typography>
          </Box>
          <Typography variant='h4' sx={{ fontWeight: '300' }}>{allRevenue.toLocaleString() + '₫' || 'N/A'}</Typography>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="300px" gap="2rem" mb={3}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection='column' gap="2rem" borderRadius='5px' border="2px solid #b48c72"
          sx={{
            gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            <PaidIcon fontSize='large' />
            <Typography variant='h4'>This month revenue ({months[new Date().getMonth()]})</Typography>
          </Box>
          <Typography variant='h4' sx={{ fontWeight: '300' }}>{currentRevenue.toLocaleString()}₫</Typography>
          <Box display='flex' alignItems='center' gap='0.5rem'>
            <Icon>
              {revenueGrowth >= 0 ? <TrendingUpIcon sx={{ color: revenueGrowth >= 0 ? 'green' : 'red' }} /> : <TrendingDownIcon sx={{ color: revenueGrowth >= 0 ? 'green' : 'red' }} />}
            </Icon>
            <Typography variant='h6' color={revenueGrowth >= 0 ? 'green' : 'red'}>
              {revenueGrowth}% {revenueGrowth >= 0 ? 'increase' : 'decrease'} compared to last month
            </Typography>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-around" gap="2rem" borderRadius='5px' border="2px solid #b48c72"
          sx={{
            gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 8' }, // Responsive grid span
          }}
        >
          <Box display="flex" alignItems="left" flexDirection='column' gap='1rem' ml={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <PaidIcon fontSize='large' />
              <Typography variant='h4'>Employee with most sales of {months[monthValueEmployee - 1] || ''} {yearValueEmployee}</Typography>
            </Box>
            <Typography variant='h4' sx={{ fontWeight: '300' }}>Name: {employeeRevenue?.userName ? employeeRevenue?.userName : 'N/A'}</Typography>
            <Typography variant='h4' sx={{ fontWeight: '300' }}>Email: {employeeRevenue?.email ? employeeRevenue?.email : 'N/A'}</Typography>
            <Typography variant='h4' sx={{ fontWeight: '300' }}>{employeeRevenue?.totalSales ? employeeRevenue?.totalSales?.toLocaleString() + '₫' : 'N/A'}</Typography>
          </Box>
          <Box display="grid" gap={2} mr={1}
            sx={{
              gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
            }}
          >
            <CustomFormControl>
              <InputLabel id="periodGraph-select-label">Period</InputLabel>
              <Select
                labelId="periodGraph-select-label"
                value={periodEmployee}
                onChange={handlePeriodEmployeeChange}
                label="Period"
              >
                <CustomMenuItem value="month">Month</CustomMenuItem>
                <CustomMenuItem value="year">Year</CustomMenuItem>
              </Select>
            </CustomFormControl>
            {periodEmployee === 'month' && (
              <CustomFormControl
                sx={{
                  gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
                }}
              >
                <InputLabel id="month-select-label">Month</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={monthValueEmployee}
                  onChange={(e) => setMonthValueEmployee(e.target.value)}
                  label="Month"
                >
                  {months.map((month, index) => (
                    <CustomMenuItem key={index} value={index + 1}>
                      {month}
                    </CustomMenuItem>
                  ))}
                </Select>
              </CustomFormControl>
            )}
            <CustomFormControl
              sx={{
                gridColumn: { xs: 'span 12', sm: 'span 12', md: 'span 4' }, // Responsive grid span
              }}
            >
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                value={yearValueEmployee}
                onChange={(e) => setYearValueEmployee(e.target.value)}
                label="Year"
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <CustomMenuItem key={index} value={new Date().getFullYear() - index}>
                    {new Date().getFullYear() - index}
                  </CustomMenuItem>
                ))}
              </Select>
            </CustomFormControl>
          </Box>
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="200px" gap="20px" mb={3}>
        <Box gridRow="span 3" gridColumn="span 12" gap="2rem" borderRadius='5px' border="2px solid #b48c72">
          <Box display='flex' alignItems="center" justifyContent="space-between" padding='0 30px' my={2}>
            <Box>
              <Typography variant='h4'>{getRevenueText()}</Typography>
              <Typography variant='h4'>Total: {totalRevenue.toLocaleString()}₫</Typography>
            </Box>
            <Box display="flex" gap={2}>
              <CustomFormControl>
                <InputLabel id="periodGraph-select-label">Period</InputLabel>
                <Select
                  labelId="periodGraph-select-label"
                  value={periodGraph}
                  onChange={handlePeriodGraphChange}
                  label="Period"
                >
                  <CustomMenuItem value="month">Month</CustomMenuItem>
                  <CustomMenuItem value="quarter">Quarter</CustomMenuItem>
                  <CustomMenuItem value="year">Year</CustomMenuItem>
                </Select>
              </CustomFormControl>
              {periodGraph === 'month' && (
                <CustomFormControl>
                  <InputLabel id="month-select-label">Month</InputLabel>
                  <Select
                    labelId="month-select-label"
                    value={monthValueGraph}
                    onChange={(e) => setMonthValueGraph(e.target.value)}
                    label="Month"
                  >
                    {months.map((month, index) => (
                      <CustomMenuItem key={index} value={index + 1}>
                        {month}
                      </CustomMenuItem>
                    ))}
                  </Select>
                </CustomFormControl>
              )}
              {periodGraph === 'quarter' && (
                <CustomFormControl>
                  <InputLabel id="quarter-select-label">Quarter</InputLabel>
                  <Select
                    labelId="quarter-select-label"
                    value={quarterValueGraph}
                    onChange={(e) => setQuarterValueGraph(e.target.value)}
                    label="Quarter"
                  >
                    <CustomMenuItem value={1}>Q1</CustomMenuItem>
                    <CustomMenuItem value={2}>Q2</CustomMenuItem>
                    <CustomMenuItem value={3}>Q3</CustomMenuItem>
                    <CustomMenuItem value={4}>Q4</CustomMenuItem>
                  </Select>
                </CustomFormControl>
              )}
              <CustomFormControl>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  value={yearValueGraph}
                  onChange={(e) => setYearValueGraph(e.target.value)}
                  label="Year"
                >
                  {/* Generate a range of years */}
                  {Array.from({ length: 10 }, (_, index) => (
                    <CustomMenuItem key={index} value={new Date().getFullYear() - index}>
                      {new Date().getFullYear() - index}
                    </CustomMenuItem>
                  ))}
                </Select>
              </CustomFormControl>
            </Box>
          </Box>

          <Box height="80%" width='100%' sx={{ paddingLeft: '30px' }}>
            {loadingRevenueGraph ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            ) : (
              <Box height='100%'>
                <LineChart data={revenueData} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box container mb={3}>
        <Box mb={1}>
          <Box backgroundColor="#b48c72" borderRadius="5px" boxShadow={2}>
            <Typography variant="h4" p={1} sx={{ color: "#fff" }}>
              Recent Transactions
            </Typography>
          </Box>
        </Box>
        <Box>
          <Box backgroundColor="#b48c72" borderRadius="5px" display="flex" alignItems="center" boxShadow={2} color="#fff" mb={1}>
            <Typography variant="h5" p={1} sx={{ fontWeight: "bold", flex: 1 }}>No</Typography>
            <Typography variant="h5" p={1} sx={{ fontWeight: "bold", flex: 1 }}>Transactions ID</Typography>
            <Typography variant="h5" p={1} sx={{ fontWeight: "bold", flex: 1 }}>Customer</Typography>
            <Typography variant="h5" p={1} sx={{ fontWeight: "bold", flex: 1 }}>Date</Typography>
            <Typography variant="h5" p={1} sx={{ fontWeight: "bold", flex: 1, textAlign: 'center' }}>Amount</Typography>
          </Box>
        </Box>
        <Box sx={{ overflowY: 'auto', maxHeight: '350px', height: '350px', border: '2px solid #b48c72', borderRadius: '5px' }}>
          {loadingRecentInvoices ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            recentInvoices.map((invoice, index) => (
              <Box key={index} p={1} borderRadius="5px" display="flex" alignItems="center" gap="20px" boxShadow={3} mt={index === 0 ? 0 : 2} bgcolor="rgba(255, 255, 255, 0.9)">
                <Typography variant="h5" sx={{ flex: 1, fontWeight: 'bold' }}>{index + 1}</Typography>
                <Typography variant="h5" sx={{ flex: 1 }}>{invoice?.transaction_id?._id || 'N/A'}</Typography>
                <Typography variant="h5" sx={{ flex: 1 }}>{invoice?.transaction_id?.request_id?.user_id?.email || 'N/A'}</Typography>
                <Typography variant="h5" sx={{ flex: 1 }}>{new Date(invoice?.createdAt).toLocaleDateString()}</Typography>
                <Typography variant="h5" sx={{ flex: 1, padding: '10px', backgroundColor: "#b48c72", borderRadius: "10px", color: "#fff", textAlign: 'center' }}>
                  {invoice.total_amount.toLocaleString()}₫
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mb={3}>
        <Box gridColumn="span 6" gap="2rem" borderRadius="5px" border="2px solid #b48c72" height='500px'>
          <Box py={2}>
            <Typography variant="h4" align='center'>Top-Selling Materials</Typography>
          </Box>
          <Box height='90%' width='100%'>
            <MaterialsBarChart data={topSellingMaterials} />
          </Box>
        </Box>
        <Box gridColumn="span 6" gap="2rem" borderRadius="5px" border="2px solid #b48c72" height='500px'>
          <Box py={2}>
            <Typography variant="h4" align='center'>Categories</Typography>
          </Box>
          <Box height='90%' width='100%'>
            <CategoriesPieChart data={categories} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardContent;
