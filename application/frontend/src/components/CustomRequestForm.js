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

const CustomRequestForm = () => {
    const [description, setDescription] = useState('')
    const { user } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const handleRequest = async () => {
        try {
            await axiosInstance.post(`/requests`, {request_description: description}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setError('');
            setMessage(['Request sent successfully'])
            setLoading(false);
        } catch (error) {
            setMessage('')
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
        }
    };

    return (
        <Container>
            <Box padding="40px 0" minHeight="60vh">
                <Typography variant="h2" component="h1" marginBottom='20px'>Custom Jewelry Request</Typography>
                <Typography variant="p" marginBottom='20px'>Please tell us about your design; describe any changes you'd like to make to an existing design on this website or a completely custom item idea.</Typography>
                <TextField
                    label="Describe your idea"
                    multiline
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                {message && (
                    <Typography variant="p" marginBottom='20px' color='red'>{message}</Typography>
                )}
                {error && (
                    <Typography variant="p" marginBottom='20px' color='red'>{error}</Typography>
                )}
                <CustomButton1 variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleRequest}>
                    SEND REQUEST
                </CustomButton1>
            </Box>
        </Container>
    );
};

export default CustomRequestForm;
