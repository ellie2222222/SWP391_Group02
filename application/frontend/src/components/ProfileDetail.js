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

const ProfileDetail = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchUserProFile = async () => {
            try {
                const response = await axiosInstance.get(`/users/${id}`);
                setProfile(response.data)
                setError('')
                setLoading(false);
            } catch (error) {
                setLoading(false);
                if (error.response === undefined) setError(error.message);
                else setError(error.response.data.error)
            }
        };

        fetchUserProFile();
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
            <Box padding="40px 0">
                <Typography variant="h5" component="p" marginBottom='20px'>Username: {profile.user.username}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Email: {profile.user.email}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Phone number: {profile.user.phone_number}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Address: {profile.user.address}</Typography>
            </Box>
            <Box padding="40px 0">
                <Typography variant="h5" component="p" marginBottom='20px'>View My Request</Typography>
                <CustomButton1 variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => navigate(`/requests`)}>
                    VIEW MY REQUESTS
                </CustomButton1>
            </Box>
        </Container>
    );
};

export default ProfileDetail;

