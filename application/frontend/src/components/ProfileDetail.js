import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import ResetPassForm from '../components/ResetPassForm';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginTop: '20px',
    '&:hover': {
        color: '#b48c72',
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
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/${id}`);
                setProfile(response.data);
                setError('');
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(error.response?.data?.error || error.message);
            }
        };

        fetchUserProfile();
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
                <Typography variant="h5" component="p" marginBottom='20px'>Username: {profile ? profile.user.username : 'N/A'}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Email: {profile ? profile.user.email : 'N/A'}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Phone number: {profile ? profile.user.phone_number : 'N/A'}</Typography>
                <Typography variant="h5" component="p" marginBottom='20px'>Address: {profile ? profile.user.address : 'N/A'}</Typography>
            </Box>
            <ResetPassForm />
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
