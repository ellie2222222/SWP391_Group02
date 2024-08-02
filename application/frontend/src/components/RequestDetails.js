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
        color: '#b48c72', // Thay đổi màu chữ khi hover
        backgroundColor: 'transparent',
    },
});

const RequestDetails = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth()
    const [request, setRequest] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { id } = useParams()

    useEffect(() => {
        let fetchApi = '';
        switch (user.role) {
            case 'user':
                fetchApi = `user-requests/${id}`
                break
            default:
                fetchApi = `staff-requests/${id}`
                break
        }

        const fetchRequest = async () => {
            try {
                const response = await axiosInstance.get(`/requests/${fetchApi}`);
                setRequest(response.data)
                setError('')
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error)
            }
        };

        fetchRequest()
    }, [id]);

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
                <Typography variant="h2" component="p" marginBottom='20px' textAlign='center'>Request</Typography>
                <Box marginBottom='20px'>
                    <Typography variant="h5" component="p" marginBottom='20px'>Request ID: {request._id}</Typography>
                    <Typography variant="h5" component="p" marginBottom='20px'>User ID: {request.user_id}</Typography>
                    <Typography variant="h5" component="p" marginBottom='20px'>Description {request.request_description}</Typography>
                    <Typography variant="h5" component="p">Status: {request.request_status}</Typography>
                </Box>
                <Typography variant="h5" component="p" marginBottom='20px'>{error}</Typography>
            </Box>
        </Container>
    );
};

export default RequestDetails;
