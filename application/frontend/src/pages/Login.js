import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Grid, Paper, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const CustomContainer = styled(Container)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f3f0e4',
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
  backgroundColor: '#b48c72',
  color: '#fff',
  marginTop: '1rem',
  marginBottom: '1rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#8e735c',
  },
  fontSize: '1.3rem',
});

const CustomGuestButton = styled(Button)({
  backgroundColor: '#F9FAFB',
  color: '#b48c72',
  marginTop: '1rem',
  width: '100%',
  '&:hover': {
    backgroundColor: '#E0E0E0',
  },
  fontSize: '1.3rem',
});

const CustomTypography = styled(Typography)({
  color: '#6e552f',
  marginBottom: '1rem',
  fontSize: '1.5rem',
});

const SubtitleTypography = styled(Typography)({
  color: '#6e552f',
  marginBottom: '1rem',
  fontSize: '1rem',
});

const CustomLink = styled(Link)({
  color: '#b48c72',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'block',
  textAlign: 'center',
  marginTop: '1rem',
  fontSize: '1rem',
});

const CustomTextField = styled(TextField)({
  width: '100%',
  marginBottom: '1rem',
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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    <CustomContainer maxWidth={false} sx={{ position: 'relative' }}>
      <Grid container style={{ height: '100vh', margin: 0, padding: 0 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: { md: 10, xs: 2 }, margin: 0, height: '400px' }}>
          <FormContainer elevation={3} sx={{ height: '100%' }}>
            <CustomTypography variant="h6" align="center" sx={{ fontSize: '2.1rem' }}>
              WELCOME TO OUR JEWELRY SHOP
            </CustomTypography>
            <SubtitleTypography variant="subtitle1" align="center" sx={{ fontSize: '1.5rem' }}>
              Let's get started with our jewelry shop
            </SubtitleTypography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <CustomTextField
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <CustomTextField
                label="Password"
                fullWidth
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
              <CustomButton variant="contained" type="submit">
                LOGIN
              </CustomButton>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <CustomGuestButton variant="contained" type="submit">
                  Continue as Guest
                </CustomGuestButton>
              </Link>
              {error && (
                <Typography color="error" align="center" sx={{ marginTop: '1rem', fontSize: '1rem' }}>
                  {error}
                </Typography>
              )}
            </form>
            <CustomLink sx={{ fontSize: '1.5rem' }} to="/forgot-password">Forgot Password?</CustomLink>
            <Typography variant="body2" align="center" sx={{ marginTop: '1rem', fontSize: '1.3rem' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#b48c72', fontWeight: 'bold', fontSize: '1.3rem' }}>Sign up</Link>
            </Typography>
          </FormContainer>
        </Grid>
        <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center', paddingRight: { md: 10, xs: 0 }, margin: 0 }}>
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
