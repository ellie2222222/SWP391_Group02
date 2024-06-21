import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        color: '#b48c75', // Thay đổi màu chữ khi hover
        backgroundColor: 'transparent',
    },
});

const RequestList = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()
    const [requests, setRequests] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
        let fetchApi = '';
        switch (user.role) {
            case 'user':
                fetchApi = 'user-requests'
                break
            default:
                fetchApi = 'staff-requests'
                break
        }

        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.get(`/requests/${fetchApi}`);
                setRequests(response.data)
                setError('')
                setLoading(false);
            } catch (error) {
                console.error('There was an error fetching requests!', error);
                setLoading(false);
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error)
            }
        };

        fetchRequests()
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
                <Typography variant="h2" component="p" marginBottom='20px' textAlign='center'>Requests</Typography>
                {requests.map((request, index) => (
                    <Box marginBottom='20px' key={index}>
                        <Typography variant="h5" component="p" marginBottom='20px'>Request #{index + 1}</Typography>
                        <Typography variant="h5" component="p">Request ID: {request._id}</Typography>
                        <Typography variant="h5"> Status: {request.request_status} </Typography>
                        <CustomButton1 onClick={() => navigate(`/requests/${request._id}`)}>View Detail</CustomButton1>
                        { request.request_status === 'completed' && (
                            <CustomButton1>Payment</CustomButton1>
                        )}
                    </Box>
                ))}
                {error && (
                    <Typography variant="h5" component="p" marginBottom="20px" color="red">{error}</Typography>
                )}
            </Box>
        </Container>
    );
};

export default RequestList;
