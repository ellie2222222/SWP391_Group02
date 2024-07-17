import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardMedia, Container, Box, Typography, Button, CircularProgress, styled, Card, CardActions, CardContent, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import Check from '@mui/icons-material/Check';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1.3rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c75',
    backgroundColor: 'transparent',
  },
});

const CustomStepLabel = styled(StepLabel)({
  '& .MuiStepLabel-label': {
    fontSize: '1.3rem',
    textTransform: 'capitalize'
  },
});

const CustomStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  color: ownerState.active ? theme.palette.primary.main : theme.palette.action.disabled,
  display: 'flex',
  height: 22,
  alignItems: 'center',
  justifyContent: 'center',
  '& .completed': {
    color: '#b48c72',
    zIndex: 1,
    fontSize: 24,
  },
  '& .circle': {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#b48c72',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
  },
}));

function CustomStepIcon(props) {
  const { active, completed, className, icon, status } = props;

  return (
    <CustomStepIconRoot ownerState={{ active }} className={className}>
      {status === 'completed' ? (
        <Check className="completed" />
      ) : completed ? (
        <Check className="completed" />
      ) : (
        <div className="circle">{icon}</div>
      )}
    </CustomStepIconRoot>
  );
}

const RequestList = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const steps = ['pending', 'quote', 'accepted', 'deposit', 'design', 'production', 'payment', 'warranty', 'completed'];

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get(`/requests/user-requests/`);
      setRequests(response.data.requests);
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching requests!', error);
      setLoading(false);
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'deposit' });
      setError('');
      fetchRequests();
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
    }
  };

  const handleDetailsDialog = (request) => {
    setSelectedRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handlePayment = async (request, type) => {
    try {
      const decoded = jwtDecode(user.token);
      const userResponse = await axiosInstance.get(`/users/` + decoded._id);

      let price;
      if (type === 'deposit') {
        price = request.quote_amount * 10 / 100;
      } else if (type === 'final') {
        price = request.quote_amount * 90 / 100;
      }

      const payment = await axiosInstance.post('/payment', {
        user_info: userResponse.data,
        product: request.jewelry_id,
        price: price,
      });

      const transaction = await axiosInstance.post('transactions', {
        trans_id: payment.data.trans_id,
        request_id: request._id,
        type,
      });

      window.location.href = payment.data.result.order_url;
    } catch (error) {
      console.error('Error, cannot proceed to payment', error);
    }
  };

  const getStatusStep = (status) => {
    return steps.indexOf(status);
  };

  useEffect(() => {
    fetchRequests();
  }, [user.token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box padding="40px 0" minHeight="60vh">
        <Typography variant="h2" component="p" marginBottom="20px" textAlign="center">Requests</Typography>
        {requests.map((request, index) => (
          <Card key={index} variant="outlined" sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5" component="p" mb={2}>Request #{index + 1}</Typography>
              <Typography variant="h5" component="p">Request ID: {request._id}</Typography>
              <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>Status: {request.request_status}</Typography>
              <Typography variant="h5">Type: {request.jewelry_id ? request.jewelry_id.type : 'Custom'}</Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Deposit Amount: {request.quote_amount ? (request.quote_amount * 10 / 100).toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Quote Amount: {request.quote_amount ? request.quote_amount.toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Box my={1}>
                <Typography variant="h5">Tracking Status:</Typography>
                <Stepper activeStep={getStatusStep(request.request_status)} alternativeLabel sx={{ marginTop: '20px' }}>
                  {steps.map((label, stepIndex) => {
                    const statusEntry = request.status_history.find(entry => entry.status === label);
                    const timestamp = statusEntry ? new Date(statusEntry.timestamp).toLocaleDateString() : '';
                    return (
                      <Step key={label}>
                        <CustomStepLabel 
                          StepIconComponent={(props) => <CustomStepIcon {...props} status={request.request_status} icon={stepIndex + 1} />}
                        >
                          {label === 'accepted' ? 'quote accept' : label} 
                        </CustomStepLabel>
                        <Typography variant='h6' align='center' mt={1} sx={{fontWeight: '300'}}>{timestamp && `${timestamp}`} </Typography>
                      </Step>
                    );
                  })}
                </Stepper>
              </Box>
            </CardContent>
            <CardActions>
              <CustomButton1 onClick={() => handleDetailsDialog(request)}>View Detail</CustomButton1>
              {request.request_status === 'accepted' && (
                <CustomButton1 onClick={() => handleAcceptRequest(request._id)}>Accept Quote</CustomButton1>
              )}
              {request.request_status === 'payment' && (
                <CustomButton1 onClick={() => handlePayment(request, 'final')}>Payment</CustomButton1>
              )}
              {request.request_status === 'deposit' && (
                <CustomButton1 onClick={() => handlePayment(request, 'deposit')}>Deposit</CustomButton1>
              )}
            </CardActions>
          </Card>
        ))}
        {error && (
          <Typography variant="h5" component="p" marginBottom="20px" color="red">{error}</Typography>
        )}
      </Box>

      {/* Dialog for Request Details */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onClose={() => setIsDetailsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle variant='h4' align='center' gutterBottom>Request Details</DialogTitle>
          <DialogContent>
            <Stepper activeStep={getStatusStep(selectedRequest.request_status)} alternativeLabel>
              {steps.map((label, stepIndex) => {
                const statusEntry = selectedRequest.status_history.find(entry => entry.status === label);
                const timestamp = statusEntry ? new Date(statusEntry.timestamp).toLocaleDateString() : '';
                return (
                  <Step key={label}>
                    <CustomStepLabel 
                      StepIconComponent={(props) => <CustomStepIcon {...props} status={selectedRequest.request_status} icon={stepIndex + 1} />}
                    >
                      {label === 'accepted' ? 'quote accept' : label} {timestamp && `(${timestamp})`}
                    </CustomStepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Typography variant="h5" component="p" marginTop="20px">
              {selectedRequest.request_description}
            </Typography>
            <Typography variant="h5" component="p">
              Status: {selectedRequest.request_status}
            </Typography>
            {selectedRequest.quote_content && (
              <>
                <Typography variant="h6" component="p" marginTop="20px">
                  Quote Content: {selectedRequest.quote_content}
                </Typography>
                <Typography variant="h6" component="p">
                  Quote Amount: {selectedRequest.quote_amount.toLocaleString()}₫
                </Typography>
              </>
            )}
            {selectedRequest.jewelry_id && selectedRequest.jewelry_id.images && (
              <Box marginTop="20px">
                <Typography variant="h6" component="p">Design Images:</Typography>
                <Box display="flex" flexWrap="wrap">
                  {selectedRequest.jewelry_id.images.map((image, index) => (
                    <Card key={index} sx={{ maxWidth: 200, margin: 1 }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={image}
                        alt={`design image ${index + 1}`}
                      />
                    </Card>
                  ))}
                </Box>
              </Box>
            )}
            {selectedRequest.production_start_date && (
              <Typography variant="h6" component="p" marginTop="20px">
                Production Start Date: {new Date(selectedRequest.production_start_date).toLocaleDateString()}
              </Typography>
            )}
            {selectedRequest.production_end_date && (
              <Typography variant="h6" component="p" marginTop="20px">
                Production End Date: {new Date(selectedRequest.production_end_date).toLocaleDateString()}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDetailsDialogOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72'}}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default RequestList;
