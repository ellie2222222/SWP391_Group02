import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

const ResetPassForm = () => {
  const { id } = useParams();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (setShowFunc, show) => () => {
    setShowFunc(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:4000/api/user/reset-profile-password`, { id, oldPassword, password });
      setMessage(response.data.Status);

      if (response.status === 200) {
        window.location.href = '/login';
      }
    } catch (error) {
      setMessage(error.response?.data?.Status || 'An error occurred.');
    }
  };

  return (
    <FormContainer elevation={3}>
      <Typography variant="h6" align="center">
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Old Password"
          fullWidth
          margin="normal"
          type={showOldPassword ? 'text' : 'password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility(setShowOldPassword, showOldPassword)}>
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility(setShowPassword, showPassword)}>
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
                <IconButton onClick={togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}>
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
  );
};

export default ResetPassForm;
