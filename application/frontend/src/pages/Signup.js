import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';
import { styled } from '@mui/system';

const CustomContainer = styled(Grid)({
  minHeight: '100vh',
  backgroundColor: '#f3f0e4', // beige background color
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const FormContainer = styled(Grid)({
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  maxWidth: '400px',
  width: '100%',
});

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
      setError('');
      navigate('/');
    } catch (error) {
      if (error.response === undefined) setError(error.message);
      else setError(error.response.data.error);
    }
  };

  return (
    <CustomContainer container>
      <FormContainer item>
        <Typography variant="h4" align="center" gutterBottom>
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
          <Button variant="contained" color="primary" type="submit" fullWidth style={{ marginTop: '1rem' }}>
            Sign Up
          </Button>
          {error && <Typography color="error" style={{ marginTop: '16px' }}>{error}</Typography>}
        </form>
      </FormContainer>
    </CustomContainer>
  );
};

export default Signup;
