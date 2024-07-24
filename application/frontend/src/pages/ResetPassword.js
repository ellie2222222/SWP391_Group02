import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate for programmatic navigation
import { TextField, Button, Container, Typography, Paper, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

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
  fontSize: '1.3rem',
});

const CustomTextField = styled(TextField)({
  width: '100%',
  variant: "outlined",
  padding: "0",
  "& .MuiOutlinedInput-root": {
      fontSize: '1.3rem',
      "&:hover fieldset": {
          borderColor: "#b48c72",
      },
      "&.Mui-focused fieldset": {
          borderColor: "#b48c72",
      },
  },
  "& .MuiInputLabel-root": {
      fontSize: '1.3rem',
      "&.Mui-focused": {
          color: "#b48c72",
      },
  },
});

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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
      const response = await axiosInstance.post(`/user/reset/${id}/${token}`, { password });
      setMessage(response.data.message);
      setSuccessDialogOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data || error.message || 'An error occurred.');
    }
  };

  return (
    <CustomContainer>
      {(!successDialogOpen) && (
        <FormContainer elevation={3}>
          <Typography variant="h2" align="center">
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <CustomTextField
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
            <CustomTextField
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
              <Typography color="textSecondary" align="center" mt={1} variant='h5'>
                {message}
              </Typography>
            )}
          </form>
        </FormContainer>
      )}
      <Dialog open={successDialogOpen} onClose={() => navigate('/login')}>
        <Box textAlign='center'>
          <CheckCircleOutlineIcon sx={{ fontSize: '8em', color: '#63f558' }}/>
        </Box>
        <DialogTitle align='center' variant='h2'>Success</DialogTitle>
        <DialogContent>
          <Typography variant="h6" align="center">
            Your password has been successfully updated.
          </Typography>
        </DialogContent>
      </Dialog>
    </CustomContainer>
  );
};

export default ResetPassword;
