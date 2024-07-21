import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Typography, IconButton, InputAdornment, Box } from '@mui/material';
import { styled } from '@mui/system';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72',
  color: '#fff',
  marginTop: '1rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#8e735c',
  },
  fontSize: '1.3rem',
});

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#b48c72',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#b48c72',
  },
  '& .MuiOutlinedInput-root': {
    fontSize: '1.3rem',
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
  '& .MuiInputLabel-root': {
    fontSize: '1.3rem',
    '&.Mui-focused': {
      color: '#b48c72',
    },
  },
  '& .MuiFormHelperText-root': {
    fontSize: '1.2rem',
    marginLeft: 0,
  },
  '& .MuiTypography-root': {
    fontSize: '1.2rem',
    marginLeft: 0,
  },
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
  const { logout } = useAuth();
  const navigate = useNavigate();

  const togglePasswordVisibility = (setShowFunc, show) => () => {
    setShowFunc(!show);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === oldPassword) {
      setMessage('New password cannot be the same as the old password');
      toast.error('New password cannot be the same as the old password', {
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      toast.error('Passwords do not match', {
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    try {
      const response = await axiosInstance.post(`/user/reset-profile-password`, { id, oldPassword, password });
      setMessage(response.data.Status);

      logout();

      toast.success('Password reset successfully. Redirecting to login page in 3 seconds', {
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000); // Adjust the delay to 3 seconds
    } catch (error) {
      setMessage(error.response?.data?.Status || 'An error occurred.');
      toast.error(error.response?.data?.Status || 'Password reset failed', {
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h2" my={2} align="center">
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <CustomTextField
          label="Old Password"
          fullWidth
          margin="normal"
          type={showOldPassword ? 'text' : 'password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          variant="outlined"
          required
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
        <CustomTextField
          label="New Password"
          fullWidth
          margin="normal"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          required
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
        <CustomTextField
          label="Confirm Password"
          fullWidth
          margin="normal"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility(setShowConfirmPassword, showConfirmPassword)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={password !== confirmPassword && confirmPassword !== ''}
          helperText={password !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
        />
        <CustomButton variant="contained" type="submit">
          Update Password
        </CustomButton>
      </form>
    </Box>
  );
};

export default ResetPassForm;
