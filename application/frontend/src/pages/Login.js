import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography } from '@mui/material';
import useAuth from '../hooks/useAuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const role = await login(email, password);
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    if (user) {
        return <Navigate to="/" />;
        
    }
    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" type="submit">
                    Login
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </form>
            <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </Typography>
        </Container>
    );
};

export default Login;
