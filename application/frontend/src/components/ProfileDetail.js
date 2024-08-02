import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled, Paper, List, ListItem, ListItemText, Divider, TextField } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';
import ResetPassForm from '../components/ResetPassForm';
import RequestList from '../components/RequestList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1.3rem',
    marginTop: '20px',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#b48c72',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#b48c72',
    },
    '& .MuiOutlinedInput-root': {
        fontSize: "1.3rem",
        '& fieldset': {
            borderColor: '#b48c72',
        },
        '&:hover fieldset': {
            borderColor: '#b48c72',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#b48c72',
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiFormHelperText-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
    "& .MuiTypography-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
});

const CustomListItemText = styled(ListItemText)({
    '& .MuiListItemText-primary': {
        fontSize: '1.5rem',
        fontWeight: '900',
    }
});

const ProfileDetail = () => {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [formValues, setFormValues] = useState({
        username: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [selectedItem, setSelectedItem] = useState('Information');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/users/${id}`);
                setProfile(response.data);
                setFormValues({
                    username: response.data.user.username || '',
                    email: response.data.user.email || '',
                    phone_number: response.data.user.phone_number || '',
                    address: response.data.user.address || '',
                });
                setLoading(false);
            } catch (error) {
                setLoading(false);
                toast.error('Failed to fetch profile details', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            }
        };

        fetchUserProfile();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleUpdate = () => {
        setIsUpdating(true);
        setTimeout(async () => {
            try {
                const response = await axiosInstance.patch(`/users/${id}`, formValues);
                setProfile(response.data);
                toast.success('Profile updated successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            } catch (error) {
                toast.error('Failed to update profile', {   
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            } finally {
                setIsUpdating(false);
            }
        }, 3000);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    const renderContent = () => {
        switch (selectedItem) {
            case 'Information':
                return (
                    <Box>
                        <Typography variant="h2" component="p" my={2} align='center'>Account Settings</Typography>
                        <CustomTextField
                            label="Username"
                            name="username"
                            value={formValues.username}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <CustomTextField
                            label="Email"
                            name="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <CustomTextField
                            label="Phone Number"
                            name="phone_number"
                            value={formValues.phone_number}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <CustomTextField
                            label="Address"
                            name="address"
                            value={formValues.address}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <CustomButton1 onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating ? <CircularProgress size={24} sx={{ color: 'white'}} /> : 'Update'}
                        </CustomButton1>
                    </Box>
                );
            case 'Password':
                return <ResetPassForm />;
            case 'My Requests':
                return <RequestList />;
            default:
                return null;
        }
    };

    return (
        <Box display="flex" justifyContent="center" minHeight="100vh" maxWidth="1500px" margin="auto" padding="50px" gap='2rem'>
            <Paper elevation={3} sx={{ width: 'fit-content', padding: 2, borderRadius: '10px', maxHeight: '800px' }}>
                <List>
                    {['Information', 'Password', 'My Requests'].map((text) => (
                        <>
                            <ListItem button key={text} onClick={() => setSelectedItem(text)}>
                                <CustomListItemText primary={text}/>
                            </ListItem>
                            <Divider />
                        </>
                    ))}
                </List>
            </Paper>
            <Container sx={{ flexGrow: 1, boxShadow: 3, borderRadius: '10px', maxHeight: '800px', overflow: 'auto' }}>
                {renderContent()}
            </Container>
            <ToastContainer />
        </Box>
    );
};

export default ProfileDetail;
