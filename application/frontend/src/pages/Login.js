import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuthContext';

const CustomContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f0e4', // beige background color
  padding: 0,
  margin: 0,
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
  backgroundColor: '#b48c72', // brown button background color
  color: '#fff',
  marginTop: '1rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#8e735c', // darker brown on hover
  },
  fontSize: '1rem', // Increase button font size
});

const CustomTypography = styled(Typography)({
  color: '#6e552f', // dark brown text color
  marginBottom: '1rem',
  fontSize: '1.5rem', // Increase main title font size
});

const SubtitleTypography = styled(Typography)({
  color: '#6e552f', // dark brown text color
  marginBottom: '1rem',
  fontSize: '1rem', // Increase subtitle font size
});

const CustomLink = styled(Link)({
  color: '#b48c72',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'block',
  textAlign: 'center',
  marginTop: '1rem',
  fontSize: '1rem', // Increase link font size
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
    <CustomContainer maxWidth={false}>
      <Grid container style={{ height: '100vh', margin: 0, padding: 0 }}>
        <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
          <FormContainer elevation={3} style={{ height: '100%' }}>
            <CustomTypography variant="h6" align="center">
              WELCOME TO OUR JEWELRY SHOP
            </CustomTypography>
            <SubtitleTypography variant="subtitle1" align="center">
              Let's get started with our jewelry shop
            </SubtitleTypography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
              />
              <CustomButton variant="contained" type="submit">
                LOGIN
              </CustomButton>
              {error && (
                <Typography color="error" align="center" style={{ marginTop: '1rem', fontSize: '1rem' }}>
                  {error}
                </Typography>
              )}
            </form>
            <CustomTypography variant="body2" align="center" style={{ marginTop: '1rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#b48c72' }}>Sign up</Link>
        </CustomTypography>
          </FormContainer>
        </Grid>
        <Grid item xs={12} md={7} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, margin: 0 }}>
          <Box
            component="img"
            src="https://hips.hearstapps.com/hmg-prod/images/treasure-royalty-free-image-1689115852.jpg?crop=0.66667xw:1xh;center,top&resize=1200:*"
            alt="Side image"
            sx={{
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
            }}
          />
        </Grid>
      </Grid>
    </CustomContainer>
  );
};

export default Login;
