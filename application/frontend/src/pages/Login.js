import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import useAuth from '../hooks/useAuthContext';
import { styled } from '@mui/system';

const CustomContainer = styled(Container)({
    background: '#f3f0e4', // beige background color
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  });
  
  const CustomButton = styled(Button)({
    backgroundColor: '#b48c72', // brown button background color
    color: '#fff',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: '#8e735c', // darker brown on hover
    },
  });
  
  const CustomTypography = styled(Typography)({
    color: '#6e552f', // dark brown text color
  });
  

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
      if (role === 'user') {
        navigate('/');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor= "00010" // light gray background for the entire page
    >
      <CustomContainer maxWidth="sm">
        <CustomTypography variant="h4" align="center" gutterBottom>
          Login
        </CustomTypography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            color="secondary"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            color="secondary"
          />
          <CustomButton variant="contained" type="submit">
            Login
          </CustomButton>
          {error && (
            <Typography color="error" align="center" style={{ marginTop: '1rem' }}>
              {error}
            </Typography>
          )}
        </form>
        <CustomTypography variant="body2" align="center" style={{ marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#b48c72' }}>Sign up</Link>
        </CustomTypography>
      </CustomContainer>
    </Box>
  );
};

export default Login;
