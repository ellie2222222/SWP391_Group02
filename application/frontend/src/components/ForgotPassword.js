import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const CustomContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f0e4',
});

const FormContainer = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px',
  zIndex: 1,
});

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72',
  color: '#fff',
  marginTop: '1rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#8e735c',
  },
  fontSize: '1rem',
});

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/user/forgot-password', { email }); // Use absolute URL
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <CustomContainer>
      <FormContainer elevation={3}>
        <Typography variant="h6" align="center">
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <CustomButton variant="contained" type="submit">
            Submit
          </CustomButton>
          {message && (
            <Typography color="textSecondary" align="center" style={{ marginTop: '1rem' }}>
              {message}
            </Typography>
          )}
        </form>
      </FormContainer>
    </CustomContainer>
  );
};

export default ForgotPassword;
