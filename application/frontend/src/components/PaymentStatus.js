import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useParams } from 'react-router-dom';

const PaymentStatus = () => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const { id } = useParams();
  const urlParams = new URLSearchParams(window.location.search);

  const getPaymentStatus = async () => {
    const transId = urlParams.get('apptransid');
    const amount = urlParams.get('amount')
    setTransactionId(transId);

    try {
      const orderStatus = await axiosInstance.post(`/order-status/${transId}`);
      
      if (orderStatus.data.return_code === 1) {
        setOrderStatus(orderStatus.data);

        const updateRequest = await axiosInstance.post('/invoices/', {
          transaction_id: transId,
          payment_method: 'domestic_card',
          payment_gateway: 'zalopay',
          total_amount: amount,
        })

        console.log(updateRequest)
        
        setError('');
      }
    } catch (error) {
      console.error('There was an error processing order status', error);
      setError('There was an error getting order status');
    }
  };

  useEffect(() => {
    getPaymentStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container maxWidth="sm" sx={{ minHeight: "50vh" }}>
      <Box mt={5}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {orderStatus ? (
              <Box>
                <Typography variant="h4" gutterBottom>
                  Order Status
                </Typography>
                <Typography variant="body1">Transaction ID: {transactionId}</Typography>
                <Typography variant="body1">Status: {orderStatus.return_message}</Typography>
                <Typography variant="body1">Amount: {orderStatus.amount}</Typography>
              </Box>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default PaymentStatus;
