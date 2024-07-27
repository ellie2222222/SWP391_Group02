import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, InputAdornment, IconButton } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';

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

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#b48c72', // focused label color
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#b48c72', // underline color after focus
  },
  '& .MuiOutlinedInput-root': {
    fontSize: "1.3rem",
    '& fieldset': {
      borderColor: '#b48c72', // outline color
    },
    '&:hover fieldset': {
      borderColor: '#b48c72', // outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b48c72', // outline color when focused
    },
  },
  "& .MuiInputLabel-root": {
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
  "& .MuiFormHelperText-root": {
    fontSize: "1.2rem",
    marginLeft: 0,
  },
  "& .MuiTypography-root": {
    fontSize: "1.2rem",
    marginLeft: 0,
  },
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

const CustomLink = styled(Link)({
  color: '#b48c72',
  textDecoration: 'none',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '1rem',
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
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="h4" sx={{ position: 'absolute', top: 10, left: 10 }}>
          Home
        </Typography>
      </Link>
      <FormContainer item>
        <Typography variant="h4" align="center" style={{ fontSize: '2.2rem', fontWeight: 'bold' }} gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <CustomTextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={userData.username}
            onChange={handleChange}
          />
          <CustomTextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={userData.email}
            onChange={handleChange}
          />
          <CustomTextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={userData.password}
            onChange={handleChange}
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
            label="Phone Number"
            name="phone_number"
            fullWidth
            margin="normal"
            value={userData.phone_number}
            onChange={handleChange}
          />
          <CustomTextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={userData.address}
            onChange={handleChange}
          />
          <CustomButton variant="contained" type="submit" >
            Sign Up
          </CustomButton>
          {error && <Typography color="error" mt={1} variant='h6'>{error}</Typography>}
        </form>
        <Typography variant="body2" align="center" style={{ marginTop: '1rem', fontSize: '1.3rem' }}>
          Already have an account? <CustomLink to="/login" style={{ color: '#b48c72', fontWeight: 'bold', fontSize: '1.3rem' }}>Sign in</CustomLink>
        </Typography>
      </FormContainer>
    </CustomContainer>
  );
};

export default Signup;
