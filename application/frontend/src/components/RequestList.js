import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
        color: '#b48c72', // Thay đổi màu chữ khi hover
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
        axios.get('http://localhost:4000/api/requests/user-requests',
            {
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                }
            }
        )
            .then(response => {
                setRequests(response.data)
                setError('')
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the products!', error);
                setLoading(false);
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error)
            });
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (requests.length <= 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h5">There was an error getting requests!</Typography>
            </Box>
        );
    }

    return (
        <Container>
            <Box padding="40px 0" minHeight="60vh">
                <Typography variant="h2" component="p" marginBottom='20px' textAlign='center'>Requests</Typography>
                {requests.map((request, index) => (
                    <Box>
                        <Typography variant="h5" component="p" marginBottom='20px'>{request._id}</Typography>
                        <Typography variant="h5" component="p" marginBottom='20px'>{request.request_description}</Typography>
                    </Box>  
                ))}
                <Typography variant="h5" component="p" marginBottom='20px'>{error}</Typography>
            </Box>
        </Container>
    );
};

export default RequestList;
