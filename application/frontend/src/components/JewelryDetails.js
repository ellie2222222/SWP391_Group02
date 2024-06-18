import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled } from '@mui/material';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72', // Thay đổi màu chữ khi hover
    backgroundColor: 'transparent',
  },
});

const JewelryDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await axiosInstance.get(`/jewelries/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the product!', error);
        setLoading(false);
      }
    };

    fetchJewelry()
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Product not found</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box display="flex" flexDirection="row" padding="40px 0">
        <Box flex={1} paddingRight="20px">
          <img src='https://www.tierra.vn/files/halo-A7tL5Eltco.webp' alt={product.name} style={{ width: '100%', height: '100%' }} />
        </Box>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Typography variant="h4" component="h1">{product.name}</Typography>
          <Typography variant="h5">{product.price} VND</Typography>
          <Typography variant="h6">Gemstone: {product.gemstone_id.name}</Typography>
          <Typography variant="h6">Gemstone Carat: {product.gemstone_id.carat}</Typography>
          <Typography variant="h6">Gemstone Shape: {product.gemstone_id.cut}</Typography>
          <Typography variant="h6">Gemstone Color: {product.gemstone_id.color}</Typography>
          <Typography variant="h6">Gemstone Clarity: {product.gemstone_id.clarity}</Typography>
          <Typography variant="h6">Gemstone Weight: {product.material_weight} kg</Typography>
          <Typography variant="h6">Materials: {product.material_id.name}</Typography>
          <Typography variant="h6">Material Carat: {product.material_id.carat}</Typography>
          <Typography variant="h6">Material Weight: {product.material_weight} kg</Typography>
          <Typography variant="h6">Category: {product.category}</Typography>
          <CustomButton1 variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={() => navigate('')}>
            ORDER NOW
          </CustomButton1>
        </Box>
      </Box>
    </Container>
  );
};

export default JewelryDetails;
