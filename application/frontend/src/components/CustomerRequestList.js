import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled, TextField } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginTop: '20px',
    '&:hover': {
        color: '#b48c72', // Change text color on hover
        backgroundColor: 'transparent',
    },
});

const CustomerRequestList = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get(`/requests`);
                setRequests(response.data);
                setError('');
                setLoading(false);
            } catch (error) {
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error);
            }
        };

        fetchRequests();
    }, [user.token]);

    const handleAcceptRequest = () => {

    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Box padding="40px 0">
                <Typography variant="h2" component="p" marginBottom="20px" textAlign="center">Requests</Typography>
                {requests.map((request, index) => (
                    <Box marginBottom="20px" key={index}>
                        <Typography variant="h5" component="p" marginBottom='20px'>Request #{index + 1}</Typography>
                        <Typography variant="h5" component="p" marginBottom='20px'>Request ID: {request._id}</Typography>
                        <Typography variant="h5" component="p" marginBottom='20px'>User ID: {request.user_id}</Typography>
                        <Typography variant="h5" component="p" marginBottom='20px'>Description: {request.request_description}</Typography>
                        <Typography variant="h5" component="p">Status: {request.request_status}</Typography>
                        <CustomButton1>Accept Request</CustomButton1>
                        <CustomButton1 onClick={() => navigate(`/requests/${request._id}`)}>View Detail</CustomButton1>
                    </Box>
                ))}
                {error && (
                    <Typography variant="h5" component="p" marginBottom="20px" color="red">{error}</Typography>
                )}
            </Box>
        </Container>
    );
};

export default CustomerRequestList;
