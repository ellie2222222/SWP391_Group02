import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled, TextField } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axios from 'axios';

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
                const response = await axios.get('http://localhost:4000/api/requests', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                    }
                });
                setRequests(response.data);
                setError('');
            } catch (error) {
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error);
            } finally {
                setLoading(false);
            }
        };

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
            <Box padding="40px 0">
                <Typography variant="h2" component="p" marginBottom="20px" textAlign="center">Requests</Typography>
                {requests.map((request) => (
                    <Box key={request._id} marginBottom="20px">
                        <Typography variant="h5" component="p">{request._id}</Typography>
                        <Typography variant="h5" component="p">{request.request_status}</Typography>
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
