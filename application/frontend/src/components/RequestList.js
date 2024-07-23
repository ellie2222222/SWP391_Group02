import React, { useEffect, useState } from 'react';
import { CardMedia, Container, Box, Typography, Button, CircularProgress, styled, Card, CardActions, CardContent, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, Stack } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import Check from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';
import UserFeedbackQuoteForm from './UserFeedbackQuoteForm';
import UserFeedbackDesignForm from './UserFeedbackDesignForm';
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
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isDesignFeedbackDialogOpen, setIsDesignFeedbackDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const steps = ['pending', 'quote', 'accepted', 'deposit', 'design', 'design_completed', 'production', 'payment', 'warranty', 'completed'];

  const fetchRequests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/requests/user-requests?page=${pageNumber}`);
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('There was an error fetching requests!', error);
      setLoading(false);
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
      toast.error('There was an error fetching requests!', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'deposit' });
      setError('');
      fetchRequests(page);  
      toast.success('Accept quote successfully', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
      toast.error('Accept quote fail', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  const handleAcceptDesignRequest = async (requestId) => {
    try {
      await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'production' });
      setError('');
      fetchRequests(page);
      toast.success('Accept design successfully', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
      toast.error('Accept design fail', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
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
        price = request.quote_amount * 30 / 100;
      } else if (type === 'final') {
        price = request.quote_amount * 70 / 100;
      }

      const payment = await axiosInstance.post('/payment', {
        user_info: userResponse.data,
        product: request.jewelry_id,
        price: price,
      });

      await axiosInstance.post('transactions', {
        trans_id: payment.data.trans_id,
        request_id: request._id,
        type,
      });

      window.location.href = payment.data.result.order_url;
    } catch (error) {
      console.error('Error, cannot proceed to payment', error);
      toast.error('Error, cannot proceed to payment', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const getStatusStep = (status) => {
    return steps.indexOf(status);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchRequests(value);
  };
  const handleCloseFeedBackDialog = () => {
    setIsFeedbackDialogOpen(false);
    setSelectedRequest(null);
  };
  const handleOpenFeedbackDialog = (request) => {
    setSelectedRequest(request);
    setIsFeedbackDialogOpen(true);
  };
  const handleCloseDesignFeedBackDialog = () => {
    setIsDesignFeedbackDialogOpen(false);
    setSelectedRequest(null);
  };
  const handleOpenDesignFeedbackDialog = (request) => {
    setSelectedRequest(request);
    setIsDesignFeedbackDialogOpen(true);
  };

  const handleRejectRequest = async (values) => {
    try {
      await axiosInstance.patch(`/requests/user-fb-quote/${selectedRequest._id}`, values);
      await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
      setError('');
      fetchRequests(page);
      handleCloseFeedBackDialog();
      toast.success('Quote reject successfully!', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
      toast.error('Failed to reject the quote.', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  const handleRejectDesignRequest = async (values) => {
    try {
      await axiosInstance.patch(`/requests/user-fb-design/${selectedRequest._id}`, values);
      await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
      setError('');
      fetchRequests(page);
      handleCloseDesignFeedBackDialog();
      toast.success('Design Reject successfully!', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
      toast.error('Failed to reject the design.', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    fetchRequests(page);
  }, [user.token, page]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box minHeight="60vh">
        <Typography variant="h2" component="p" textAlign="center" my={2}>Requests</Typography>
        {requests.map((request, index) => (
          <Card key={index} variant="outlined" sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5" component="p">Request ID: {request._id}</Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Deposit Amount: {request.quote_amount ? (request.quote_amount * 10 / 100).toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Quote Amount: {request.quote_amount ? request.quote_amount.toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Box my={1}>
                <Typography variant="h5">Status Progress:</Typography>
                <Stepper activeStep={getStatusStep(request.request_status)} alternativeLabel sx={{ marginTop: '20px' }}>
                  {steps.map((label, stepIndex) => {
                    const statusEntry = request.status_history.find(entry => entry.status === label);
                    const timestamp = statusEntry ? new Date(statusEntry.timestamp).toLocaleDateString() : '';
                    let displayLabel
                    displayLabel = label === 'design_completed' ? 'user accept design' : label;
                    displayLabel = displayLabel === 'accepted' ? 'user accept quote' : displayLabel;
                    displayLabel = displayLabel === 'quote' ? 'manager approve quote' : displayLabel;
                    return (
                      <Step key={label}>
                        <CustomStepLabel
                          StepIconComponent={(props) => <CustomStepIcon {...props} status={request.request_status} icon={stepIndex + 1} />}
                        >
                          {displayLabel}
                        </CustomStepLabel>
                        <Typography variant='h6' align='center' mt={1} sx={{ fontWeight: '300' }}>{timestamp && `${timestamp}`} </Typography>
                      </Step>
                    );
                  })}
                </Stepper>

              </Box>
            </CardContent>
            <CardActions>
              <CustomButton1 onClick={() => handleDetailsDialog(request)}>View Detail</CustomButton1>
              {request.request_status === 'accepted' && (
                <>
                  <CustomButton1 onClick={() => handleAcceptRequest(request._id)}>Accept Quote</CustomButton1>
                  <CustomButton1 onClick={() => handleOpenFeedbackDialog(request)}>Reject Quote</CustomButton1>
                </>
              )}
              {request.request_status === 'design_completed' && (
                <>
                  <CustomButton1 onClick={() => handleAcceptDesignRequest(request._id)} > Accept Design</CustomButton1>
                  <CustomButton1 onClick={() => handleOpenDesignFeedbackDialog(request)}>Reject Design</CustomButton1>
                </>
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

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={2}>
        <Stack spacing={2}>
          <Pagination
            size="large"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </Stack>
      </Box>

      {/* Dialog for Request Details */}
      {selectedRequest && (
        <Dialog open={isDetailsDialogOpen} onClose={() => setIsDetailsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle variant='h4' align='center' gutterBottom>Request Details</DialogTitle>
          <DialogContent>
            <Typography
              variant="h5"
              component="p"
              marginTop="20px"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                wordWrap: 'break-word'
              }}
            >
              Description: {selectedRequest.request_description}
            </Typography>
            {selectedRequest.quote_content && (
              <>
                <Typography
                  variant="h6"
                  component="p"
                  marginTop="20px"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    wordWrap: 'break-word'
                  }}
                >
                  Quote Content: {selectedRequest.quote_content}
                </Typography>
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    wordWrap: 'break-word'
                  }}
                >
                  Quote Amount: {selectedRequest.quote_amount.toLocaleString()}₫
                </Typography>
              </>
            )}
            {selectedRequest.jewelry_id && selectedRequest.jewelry_id.images && (
              <Box marginTop="20px">
                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    wordWrap: 'break-word'
                  }}
                >
                  Design Images:
                </Typography>
                <Box display="flex" flexWrap="wrap">
                  {selectedRequest.jewelry_id.images.map((image, index) => (
                    <Card key={index} sx={{ maxWidth: 200, margin: "10px 20px 0 0" }}>
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
              <Typography
                variant="h6"
                component="p"
                mt={2}
                sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                Production Start Date: {new Date(selectedRequest.production_start_date).toLocaleDateString()}
              </Typography>
            )}
            {selectedRequest.production_end_date && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                Production End Date: {new Date(selectedRequest.production_end_date).toLocaleDateString()}
              </Typography>
            )}
            {selectedRequest.warranty_content && (
              <Typography
                variant="h6"
                component="p"
                mt={2}
                sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                Warranty Content: {selectedRequest.warranty_content}
              </Typography>
            )}
            {selectedRequest.warranty_start_date && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                Production End Date: {new Date(selectedRequest.warranty_start_date).toLocaleDateString()}
              </Typography>
            )}
            {selectedRequest.warranty_end_date && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  wordWrap: 'break-word'
                }}
              >
                Production End Date: {new Date(selectedRequest.warranty_end_date).toLocaleDateString()}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDetailsDialogOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

      )}
      <Dialog open={isFeedbackDialogOpen} onClose={handleCloseFeedBackDialog}>
        <DialogContent>
          <UserFeedbackQuoteForm initialValues={selectedRequest} onSubmit={handleRejectRequest} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedBackDialog} sx={{ fontSize: "1.3rem", color: "#b48c72" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isDesignFeedbackDialogOpen} onClose={handleCloseDesignFeedBackDialog}>
        <DialogContent>
          <UserFeedbackDesignForm initialValues={selectedRequest} onSubmit={handleRejectDesignRequest} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDesignFeedBackDialog} sx={{ fontSize: "1.3rem", color: "#b48c72" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestList;
