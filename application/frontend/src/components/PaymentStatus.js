import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/system';
import { Link } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import { jwtDecode } from 'jwt-decode';

const LargeTypography = styled(Typography)({
  fontSize: '1.3rem', // Increased font size
});

const PaymentStatus = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const urlParams = new URLSearchParams(window.location.search);
  const { user } = useAuth();

  const getPaymentStatus = async () => {
    const transId = urlParams.get('apptransid');
    const amount = urlParams.get('amount');
    const bankcode = urlParams.get('bankcode');
    let pm;
    if (bankcode === "CC") {
      pm = "credit_card"
    } else if (bankcode === "SBIS") {
      pm = "domestic_card"
    } else {
      pm = "other"
    }
    setTransactionId(transId);

    try {
      const orderStatus = await axiosInstance.post(`/order-status/${transId}`);
      setOrderStatus(orderStatus.data);
      setLoading(false);

      if (orderStatus.data.return_code === 1) {
        await axiosInstance.post('/invoices/', {
          transaction_id: transId,
          payment_method: pm,
          payment_gateway: 'zalopay',
          total_amount: amount,
        });
      }
    } catch (error) {
      setError('There was an error getting order status');
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentStatus();
  }, []);

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '10px', width: '100%', boxShadow: 2 }}>
          {orderStatus ? (
            <>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
              {orderStatus.return_code == 1 ? (
                <CheckCircleOutlineIcon sx={{ fontSize: '8em', color: '#63f558' }} />
              ) : (
                <HighlightOffRoundedIcon sx={{ fontSize: '8em', color: 'red' }} />
              )}
            </Box>
              <Typography variant="h4" align='center' gutterBottom>
                Order Status
              </Typography>
              <LargeTypography variant="body1">Transaction ID: {transactionId}</LargeTypography>
              <LargeTypography variant="body1">Status: {orderStatus.return_message}</LargeTypography>
              <LargeTypography variant="body1">Amount: {orderStatus.amount}</LargeTypography>
              <Link component={RouterLink} to={`/profile/${user._id}`} underline="none" sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                <KeyboardBackspaceIcon sx={{ mr: 1, color: '#b48c72' }} />
                <LargeTypography variant="body1" sx={{ fontWeight: 'bold', color: '#b48c72' }}>
                  Back to request list
                </LargeTypography>
              </Link>
            </>
          ) : (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
};

export default PaymentStatus;
