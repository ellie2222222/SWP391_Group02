import React, { useEffect, useState } from 'react';
import { CardMedia, Container, Box, Typography, Button, CircularProgress, Grid, Divider, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, styled, Card, CardActions, CardContent, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions, Pagination, Stack, IconButton, Paper } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';
import Check from '@mui/icons-material/Check';
import { ToastContainer, toast } from 'react-toastify';
import UserFeedbackQuoteForm from './UserFeedbackQuoteForm';
import UserFeedbackDesignForm from './UserFeedbackDesignForm';
import { Info } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import zaloLogo from './assets/imgs/Logo_Zalo.svg';

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

const LargeTypography = styled(Typography)({
  fontSize: '1.3rem',
});

const CustomTableCell = styled(TableCell)({
  fontSize: '1.3rem',
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
  const { active, completed, className, icon, status, statusHistory, useAlternateSteps } = props;

  // Determine if this step has a timestamp
  const hasTimestamp = statusHistory.some(entry => entry.status === status && entry.timestamp);

  return (
    <CustomStepIconRoot ownerState={{ active }} className={className}>
      {useAlternateSteps ? (
        status === 'cancelled' ? (
          <ErrorIcon className="completed" />
        ) : hasTimestamp ? (
          <Check className="completed" />
        ) : (
          <ErrorIcon className="completed" />
        )
      ) : (
        status === 'completed' ? (
          <Check className="completed" />
        ) : completed ? (
          <Check className="completed" />
        ) : (
          <div className="circle">{icon}</div>
        )
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
  const [saleStaffNumber, setSaleStaffNumber] = useState('');
  const [isContactInfoDialogOpen, setIsContactInfoDialogOpen] = useState(false);
  const [isWarrantyDialogOpen, setIsWarrantyDialogOpen] = useState(false);

  const steps = ['pending', 'assigned', 'quote', 'accepted', 'deposit_design', 'design', 'design_completed', 'deposit_production', 'production', 'payment', 'warranty', 'completed'];
  const alternateSteps = ['pending', 'assigned', 'quote', 'accepted', 'deposit_design', 'design', 'design_completed', 'deposit_production', 'production', 'payment', 'warranty', 'cancelled'];

  const fetchRequests = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/requests/user-requests?page=${pageNumber}`);
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
      setError('');
      setLoading(false);
    } catch (error) {
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

  const getStaffContact = async (request) => {
    try {
      const response = await axiosInstance(`/users/get-staff-contact/${request._id}`);
      setSaleStaffNumber(response.data.saleStaffContact);
    } catch (error) {
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'deposit_design' });
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
      await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'deposit_production' });
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

      let price;
      if (type === 'deposit_design') {
        price = request.quote_amount * 20 / 100;
      } else if (type === 'deposit_production') {
        price = request.quote_amount * 30 / 100;
      } else if (type === 'final') {
        price = request.quote_amount * 50 / 100;
      }

      const payment = await axiosInstance.post('/payment', {
        product: request.jewelry_id,
        price: price,
      });

      await axiosInstance.post('/transactions', {
        trans_id: payment.data.trans_id,
        request_id: request._id,
        type,
      });

      window.location.href = payment.data.result.order_url;
      // window.open(payment.data.result.order_url, '_blank');
    } catch (error) {
      toast.error('Error, cannot proceed to payment', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
      });
    }
  };
  const handleWarrantyDialog = (request) => {
    setSelectedRequest(request);
    setIsWarrantyDialogOpen(true);
  };

  const getStatusStep = (status) => {
    if (status === 'cancelled') {
      return alternateSteps.indexOf(status);
    } else {
      return steps.indexOf(status);
    }
  };


  const getDisplayLabel = (label) => {
    switch (label) {
      case 'deposit_design':
        return 'deposit design';
      case 'design_completed':
        return 'user accept design';
      case 'accepted':
        return 'user accept quote';
      case 'quote':
        return 'manager approve quote';
      case 'deposit_production':
        return 'deposit production';
      default:
        return label;
    }
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

  const handleOpenContactInfoDialog = (request) => {
    getStaffContact(request);
    setIsContactInfoDialogOpen(true);
  };

  const handleCloseContactInfoDialog = () => {
    setIsContactInfoDialogOpen(false);
    setSaleStaffNumber('')
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
        {requests.length === 0 && (
          <Typography variant="h4" my={2}>No requests</Typography>
        )}
        {requests.map((request, index) => (
          <Card key={index} variant="outlined" sx={{ marginBottom: '20px', overflow: 'auto' }}>
            <CardContent>
              <Typography variant="h5" component="p">Request ID: {request._id}</Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Design Deposit Amount: {request.quote_amount ? (request.quote_amount * 20 / 100).toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Production Deposit Amount: {request.quote_amount ? (request.quote_amount * 30 / 100).toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                Quote Amount: {request.quote_amount ? request.quote_amount.toLocaleString() + '₫' : 'Awaiting Quote Amount'}
              </Typography>
              <Box display='flex' alignItems='center'>
                <Typography variant="h5">Staff Contact Information</Typography>
                <IconButton onClick={() => handleOpenContactInfoDialog(request)}>
                  <Info fontSize='large' />
                </IconButton>
              </Box>
              <Box my={1}>
                <Typography variant="h5">Status Progress:</Typography>
                <Stepper
                  activeStep={getStatusStep(request.request_status)}
                  alternativeLabel
                  sx={{ marginTop: '20px' }}
                >
                  {(request.request_status === 'cancelled' ? alternateSteps : steps).map((label, stepIndex) => {
                    const statusEntry = request.status_history.find(entry => entry.status === label);
                    const timestamp = statusEntry ? new Date(statusEntry.timestamp).toLocaleDateString() : '';
                    const displayLabel = getDisplayLabel(label);

                    return (
                      <Step key={label}>
                        <CustomStepLabel
                          StepIconComponent={(props) => <CustomStepIcon {...props} status={request.request_status === 'cancelled' ? label : request.request_status} statusHistory={request.status_history} useAlternateSteps={request.request_status === 'cancelled'} icon={stepIndex + 1} />}
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
              {request.request_status === 'completed' && (
                <CustomButton1 onClick={() => handleWarrantyDialog(request)}>
                  Warranty Detail
                </CustomButton1>
              )}
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
              {request.request_status === 'deposit_design' && (
                <CustomButton1 onClick={() => handlePayment(request, 'deposit_design')}>Deposit Design</CustomButton1>
              )}
              {request.request_status === 'deposit_production' && (
                <CustomButton1 onClick={() => handlePayment(request, 'deposit_production')}>Deposit Production</CustomButton1>
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
          <DialogTitle variant='h2' align='center'>Request Details</DialogTitle>
          <DialogContent>
            <Typography
              variant="h3"
              component="p"
              marginTop="20px"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                overflow: 'hidden',
                wordWrap: 'break-word'
              }}
              fontWeight={300}
              my={2}
            >
              Description
            </Typography>
            <Typography sx={{ fontSize: '1.3rem' }}>{selectedRequest.request_description || 'None'}</Typography>
            <Typography variant='h3' fontWeight={300} my={2}>Quote Information</Typography>
            {selectedRequest.quote_content && (
              <>
                <Typography
                  component="p"
                  marginTop="20px"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    fontSize: '1.3rem',
                  }}
                >
                  Quote Content: {selectedRequest.quote_content}
                </Typography>
                <Typography
                  component="p"
                  sx={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    wordWrap: 'break-word',
                    fontSize: '1.3rem',
                  }}
                >
                  Quote Amount: {selectedRequest.quote_amount.toLocaleString() + '₫' || 'N/A'}
                </Typography>
              </>
            )}
            <Typography variant='h3' fontWeight={300} my={2}>Jewelry Information</Typography>
            <Typography sx={{ fontSize: '1.3rem' }} mb={2}>Name: {selectedRequest?.jewelry_id?.name || 'N/A'}</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="h4">Items</Typography></TableCell>
                    <TableCell colSpan={4}><Typography variant="h4" align='center'>Details</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Category</Typography>
                    </TableCell>
                    <TableCell colSpan={4}>
                      <LargeTypography variant="body1" align='center'>{selectedRequest?.jewelry_id?.category || '-'}</LargeTypography>
                    </TableCell>
                  </TableRow>

                  {/* Material Section */}
                  <TableRow>
                    <TableCell rowSpan={2}>
                      <Typography variant="h6">Material</Typography>
                    </TableCell>
                    <TableCell colSpan={4}>
                      <LargeTypography variant="body1" align='center'>{selectedRequest?.jewelry_id?.material_id?.name || '-'}</LargeTypography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h6">Material Carat</Typography>
                    </TableCell>
                    <TableCell>
                      <LargeTypography variant="body1">{selectedRequest?.jewelry_id?.material_id?.carat || '-'}</LargeTypography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6">Material Weight</Typography>
                    </TableCell>
                    <TableCell>
                      <LargeTypography variant="body1">{selectedRequest?.jewelry_id ? selectedRequest?.jewelry_id?.material_weight + ' mace' : '-'} </LargeTypography>
                    </TableCell>
                  </TableRow>

                  {/* Gemstone Section */}
                  {selectedRequest?.jewelry_id?.gemstone_ids && selectedRequest?.jewelry_id?.gemstone_ids.length > 0 && (
                    selectedRequest?.jewelry_id?.gemstone_ids.map((gemstone) => (
                      <>
                        <TableRow>
                          <TableCell rowSpan={5}>
                            <Typography variant="h6">Main Gemstone</Typography>
                          </TableCell>
                          <TableCell colSpan={4}>
                            <LargeTypography variant="body1" align='center'>{gemstone.name || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Carat</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.carat || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Shape</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.cut || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Color</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.color || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Clarity</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.clarity || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Measurements</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.measurements || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Polish</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.polish || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Symmetry</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.symmetry || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Fluorescence</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{gemstone.fluorescence || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                  )}

                  {/* Subgemstone Section */}
                  {selectedRequest?.jewelry_id?.subgemstone_ids && selectedRequest?.jewelry_id?.subgemstone_ids.length > 0 && (
                    selectedRequest?.jewelry_id?.subgemstone_ids.map((subgemstone) => (
                      <>
                        <TableRow>
                          <TableCell rowSpan={5}>
                            <Typography variant="h6">Sub Gemstone</Typography>
                          </TableCell>
                          <TableCell colSpan={4}>
                            <LargeTypography variant="body1" align='center'>{subgemstone.name || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Carat</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.carat || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Shape</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.cut || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Color</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.color || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Clarity</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.clarity || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Measurements</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.measurements || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Polish</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.polish || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>
                            <Typography variant="h6">Gemstone Symmetry</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.symmetry || '-'}</LargeTypography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="h6">Gemstone Fluorescence</Typography>
                          </TableCell>
                          <TableCell>
                            <LargeTypography variant="body1">{subgemstone.fluorescence || '-'}</LargeTypography>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant='h3' fontWeight={300} my={2}>Images</Typography>
            <Grid container spacing={2}>
              {selectedRequest?.jewelry_id?.images.map((image, index) => (
                <Grid item xs={4}>
                  <CardMedia
                    key={index}
                    component="img"
                    alt="Jewelry"
                    image={image}
                    sx={{ width: '100%', margin: '0px' }}
                  />
                </Grid>
              ))}
            </Grid>
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

      <Dialog open={isContactInfoDialogOpen} onClose={handleCloseContactInfoDialog}>
        <DialogTitle variant='h4' align='center'>Contact Information</DialogTitle>
        <DialogContent>
          <Typography variant="h5">Sale Staff Contact Number: {saleStaffNumber || 'Sale Staff will be assigned to your request. Awaiting contact information'}</Typography>
          <CustomButton1
            href="https://chat.zalo.me/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Box
              component="img"
              src={zaloLogo}
              alt="Zalo"
              sx={{ width: 24, height: 24, marginRight: 1 }}
            />
            Zalo
          </CustomButton1>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactInfoDialog} sx={{ fontSize: "1.3rem", color: "#b48c72" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {selectedRequest && (
        <Dialog
          open={isWarrantyDialogOpen}
          onClose={() => setIsWarrantyDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ textAlign: 'center', fontWeight: '300' }} variant='h2'>
            Warranty
          </DialogTitle>
          <DialogContent>
            <Box sx={{ padding: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: '300', fontSize: '2rem' }}>
                        Warranty Details
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* User ID Row */}
                    {selectedRequest.user_id && (
                      <TableRow>
                        <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>User ID</CustomTableCell>
                        <CustomTableCell>{selectedRequest.user_id._id}</CustomTableCell>
                      </TableRow>
                    )}

                    {/* Username Row */}
                    {selectedRequest.user_id && (
                      <TableRow>
                        <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>User's Name</CustomTableCell>
                        <CustomTableCell>{selectedRequest.user_id.username}</CustomTableCell>
                      </TableRow>
                    )}

                    {/* Jewelry Details Rows */}

                    {selectedRequest.jewelry_id && (
                      <>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Jewelry Name</CustomTableCell>
                          <CustomTableCell>{selectedRequest.jewelry_id.name || 'N/A'}</CustomTableCell>
                        </TableRow>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Gemstone ID</CustomTableCell>
                          <CustomTableCell>{selectedRequest.jewelry_id.gemstone_id || 'N/A'}</CustomTableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Production Dates Rows */}
                    {selectedRequest.production_start_date && (
                      <>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Production Start Date</CustomTableCell>
                          <CustomTableCell>{new Date(selectedRequest.production_start_date).toLocaleDateString()}</CustomTableCell>
                        </TableRow>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Production End Date</CustomTableCell>
                          <CustomTableCell>{new Date(selectedRequest.production_end_date).toLocaleDateString()}</CustomTableCell>
                        </TableRow>
                      </>
                    )}

                    {/* Warranty Content Row */}
                    {selectedRequest.warranty_content && (
                      <TableRow>
                        <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Warranty Content</CustomTableCell>
                        <CustomTableCell>{selectedRequest.warranty_content}</CustomTableCell>
                      </TableRow>
                    )}

                    {/* Warranty Dates Rows */}
                    {selectedRequest.warranty_start_date && (
                      <>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Warranty Start Date</CustomTableCell>
                          <CustomTableCell>{new Date(selectedRequest.warranty_start_date).toLocaleDateString()}</CustomTableCell>
                        </TableRow>
                        <TableRow>
                          <CustomTableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Warranty End Date</CustomTableCell>
                          <CustomTableCell>{new Date(selectedRequest.warranty_end_date).toLocaleDateString()}</CustomTableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {selectedRequest.jewelry_id && selectedRequest.jewelry_id.gemstone_ids && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                  {selectedRequest.jewelry_id.gemstone_ids.map((gemstone, index) => (
                    <Card key={index} sx={{ maxWidth: 1000, m: 1 }}>
                      <CardMedia
                        component="img"
                        height="600"
                        image={gemstone.certificate_image}
                        alt={`Gemstone Certificate ${index + 1}`}
                      />
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Certificate of {gemstone.name}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
               {selectedRequest.jewelry_id && selectedRequest.jewelry_id.subgemstone_ids && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
                  {selectedRequest.jewelry_id.subgemstone_ids.map((gemstone, index) => (
                    <Card key={index} sx={{ maxWidth: 1000, m: 1 }}>
                      <CardMedia
                        component="img"
                        height="600"
                        image={gemstone.certificate_image}
                        alt={`Gemstone Certificate ${index + 1}`}
                      />
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Certificate of {gemstone.name}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsWarrantyDialogOpen(false)}
              sx={{ color: '#b48c72', fontSize: '1.3rem' }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}


    </Container>
  );
};

export default RequestList;
