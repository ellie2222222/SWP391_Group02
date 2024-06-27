import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router
import { TextField, Button, Container, Typography, Paper, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

const ResetPassword = () => {
  const { id, token } = useParams(); // Assuming you're using React Router for dynamic params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/api/user/reset/${id}/${token}`, { password });
      setMessage(response.data.message);

      // Redirect to login page upon successful password reset
      if (response.status === 200) {
        window.location.href = '/login';
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <CustomContainer>
      <FormContainer elevation={3}>
        <Typography variant="h6" align="center">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            fullWidth
            margin="normal"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <CustomButton variant="contained" type="submit">
            Update Password
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

export default ResetPassword;
