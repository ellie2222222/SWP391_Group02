import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
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
    const navigate = useNavigate();  
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(userData);
            alert('Signup successful! Please log in.');
            setError(''); // Xóa lỗi nếu đăng ký thành công
            navigate('/login'); // Điều hướng về trang đăng nhập
        } catch (error) {
            setError(error.message || 'Signup failed'); // Cập nhật lỗi từ server
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
                {error && <Typography color="error" style={{ marginTop: '16px' }}>{error}</Typography>}
            </form>
        </Container>
    );
};

export default Signup;
