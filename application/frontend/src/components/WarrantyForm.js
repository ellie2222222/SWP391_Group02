import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuthContext';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  border: '1px solid #000',
  color: '#000',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72', // Change text color on hover
    border: '1px solid #b48c72',
    backgroundColor: 'transparent',
  },
});

const WarrantyForm = () => {
  const [userId, setUserId] = useState('');
  const [jewelryId, setJewelryId] = useState('');
  const [warrantyContent, setWarrantyContent] = useState('');
  const [warrantyStartDate, setWarrantyStartDate] = useState('');
  const [warrantyEndDate, setWarrantyEndDate] = useState('');
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userId || !jewelryId) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/warranties', 
        { 
          user_id: userId, 
          jewelry_id: jewelryId, 
          warranty_content: warrantyContent, 
          warranty_start_date: warrantyStartDate, 
          warranty_end_date: warrantyEndDate 
        },
        {
          headers: {
            "Authorization": `Bearer ${user.token}`
          }
        }
      );// Adjust URL if needed
      setWarranty(response.data.warranty);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Transaction
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="User ID"
            margin="normal"
            variant="outlined"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            fullWidth
            label="Jewelry ID"
            margin="normal"
            variant="outlined"
            value={jewelryId}
            onChange={(e) => setJewelryId(e.target.value)}
          />
           <TextField
            fullWidth
            label="Warranty Content"
            margin="normal"
            variant="outlined"
            value={warrantyContent}
            onChange={(e) => setWarrantyContent(e.target.value)}
          />
           <TextField
            fullWidth
            label="Warranty Start Date"
            margin="normal"
            variant="outlined"
            value={warrantyStartDate}
            onChange={(e) => setWarrantyStartDate(e.target.value)}
          />
           <TextField
            fullWidth
            label="Warranty End Date"
            margin="normal"
            variant="outlined"
            value={warrantyEndDate}
            onChange={(e) => setWarrantyEndDate(e.target.value)}
          />
          <CustomButton1 type="submit">
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </CustomButton1>
        </form>
        {warranty && (
          <Box mt={4}>
            <Typography variant="h6" component="p" gutterBottom>
              Warranty Information
            </Typography>
            <Typography component="p">Warranty Content: {warranty.warranty_content}</Typography>
            <Typography component="p">Start Date: {new Date(warranty.warranty_start_date).toLocaleDateString()}</Typography>
            <Typography component="p">End Date: {new Date(warranty.warranty_end_date).toLocaleDateString()}</Typography>
            
          </Box>
        )}
        {error && (
          <Typography variant="body1" color="error" mt={2}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default WarrantyForm;