import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { CardMedia,Container, Box, Typography, Button, CircularProgress, styled, TextField, Card, CardActions, CardContent, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import {jwtDecode} from 'jwt-decode'; // Corrected import

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginTop: '20px',
    '&:hover': {
        color: '#b48c75',
        backgroundColor: 'transparent',
    },
});

const steps = ['pending', 'quote', 'accepted', 'design', 'production', 'payment', 'warranty', 'completed'];
const RequestList = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null); // Changed to null for conditional rendering

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get(`/requests/user-requests/`);
            setRequests(response.data);
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
            await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'design' });
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

    const handlePayment = async (request) => {
        try {
            const decoded = jwtDecode(user.token);
            const userResponse = await axiosInstance.get(`/users/` + decoded._id);
            
            let price;
            if (request.type === "Sample") {
                if (request.on_sale === true) {
                    price = request.jewelry_id.price;
                } else {
                    price = request.jewelry_id.price - (request.jewelry_id.price * (request.jewelry_id.sale_percentage / 100));
                }
            } else {
                price = request.quote_amount;
            }
            console.log(price)

            const payment = await axiosInstance.post('/payment', {
                user_info: userResponse.data,
                product: request.jewelry_id,
                price: price,
            });

            const transaction = await axiosInstance.post('transactions', {
                trans_id: payment.data.trans_id,
                request_id: request._id,
            });

            window.open(payment.data.result.order_url, '_blank');
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
                            <Typography variant="h5" component="p" marginBottom="20px">Request #{index + 1}</Typography>
                            <Typography variant="h5" component="p">Request ID: {request._id}</Typography>
                            <Typography variant="h5">Status: {request.request_status}</Typography>
                            <Typography variant="h5">Type: {request.jewelry_id ? request.jewelry_id.type : 'Custom'}</Typography>
                            {request.jewelry_id && request.jewelry_id.type === 'Sample' && (
                                <>
                                    {request.jewelry_id.on_sale ? (
                                        <>
                                            <Typography variant="h5" sx={{ color: 'red', fontWeight: '300', mr: 1, display: 'inline-block' }}>
                                                Price: {(request.jewelry_id.price - (request.jewelry_id.price * (request.jewelry_id.sale_percentage / 100))).toLocaleString()}₫
                                            </Typography>
                                            <Typography variant="h6" sx={{ textDecoration: 'line-through', fontWeight: '300', display: 'inline-block' }}>
                                                {request.jewelry_id.price.toLocaleString()}₫
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                                            Price: {request.jewelry_id.price.toLocaleString()}₫
                                        </Typography>
                                    )}
                                </>
                            )}
                            {request.jewelry_id && request.jewelry_id.type === 'Custom' && (
                                <Typography variant="h5" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                                    Price: {request.quote_amount.toLocaleString()}₫
                                </Typography>
                            )}
                            <Stepper activeStep={getStatusStep(request.request_status)} alternativeLabel sx={{ marginTop: '20px' }} >
                                {steps.map((label) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </CardContent>
                        <CardActions>
                            <CustomButton1 onClick={() => handleDetailsDialog(request)}>View Detail</CustomButton1>
                            {request.request_status === 'accepted' && (
                                <>
                                    <CustomButton1 onClick={() => handleAcceptRequest(request._id)}>Accept Quote</CustomButton1>
                                </>
                            )}
                            {request.request_status === 'payment' && (
                                <CustomButton1 onClick={() => handlePayment(request)}>Payment</CustomButton1>
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
                    <DialogTitle>Request Details</DialogTitle>
                    <DialogContent>
                        <Stepper activeStep={getStatusStep(selectedRequest.request_status)} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        <Typography variant="h5" component="p" marginTop="20px">
                            Request ID: {selectedRequest._id}
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
                        <Button onClick={() => setIsDetailsDialogOpen(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default RequestList;
