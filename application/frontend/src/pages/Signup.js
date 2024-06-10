import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import useAuth from '../hooks/useAuthContext';

const Signup = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        address: ''
    });
    const [error, setError] = useState('');
    const { signup } = useAuth();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(userData);
            alert('Signup successful! Please log in.');
        } catch (err) {
            setError('Signup failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Sign Up
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    name="username"
                    fullWidth
                    margin="normal"
                    value={userData.username}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={userData.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={userData.password}
                    onChange={handleChange}
                />
                <TextField
                    label="Phone Number"
                    name="phone_number"
                    fullWidth
                    margin="normal"
                    value={userData.phone_number}
                    onChange={handleChange}
                />
                <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    margin="normal"
                    value={userData.address}
                    onChange={handleChange}
                />
                <Button variant="contained" color="primary" type="submit">
                    Sign Up
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </form>
        </Container>
    );
};

export default Signup;
