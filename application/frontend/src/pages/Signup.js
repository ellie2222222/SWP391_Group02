import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
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

const CustomTextField = styled(TextField)({
  width: '100%',
  marginBottom: '1rem',
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#b48c72",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#b48c72",
    },
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
  fontSize: '1rem',
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
            type="password"
            fullWidth
            margin="normal"
            value={userData.password}
            onChange={handleChange}
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
          <CustomButton variant="contained" type="submit">
            Sign Up
          </CustomButton>
          {error && <Typography color="error" style={{ marginTop: '16px' }}>{error}</Typography>}
        </form>
        <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
          Already have an account? <CustomLink to="/login">Sign in</CustomLink>
        </Typography>
      </FormContainer>
    </CustomContainer>
  );
};

export default Signup;
