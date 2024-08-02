//home page collection
import React, { useEffect, useState } from 'react';
import {
    Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button,
    TextField, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, Pagination, Stack,
    styled
  } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import JewelryDetails from '../components/JewelryDetails'; // Component to display each product
import { useNavigate } from 'react-router-dom';




const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    border: '1px solid #000',
    color: '#000',
    width: '100%',
    fontSize: '1.3rem',
    marginTop: '20px',
    '&:hover': {
      color: '#b48c72',
      border: '1px solid #b48c72',
      backgroundColor: 'transparent',
    },
  });


const Collections = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/jewelries?limit=9999');
        const allProducts = response.data.jewelries;
    
        // Classify products by season based on specific criteria
        const seasonalProducts = {
          Spring: allProducts.filter((product) =>
            product.name.toLowerCase().includes('spring')
          ),
          Summer: allProducts.filter((product) =>
            product.name.toLowerCase().includes('summer')
          ),
          Autumn: allProducts.filter((product) =>
            product.name.toLowerCase().includes('autumn')
          ),
          Winter: allProducts.filter((product) =>
            product.name.toLowerCase().includes('winter')
          ),
        };

       
        setProducts(seasonalProducts);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Collections
      </Typography>
      <Box>
        {Object.keys(products).map((season) => (
          <Box key={season} marginBottom={5}>
            <Typography variant="h3" component="h2" gutterBottom>
              {season}
            </Typography>
            <Grid container spacing={3}>
              {products[season].map((product, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.images[0] || 'placeholder.jpg'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div" mb={2}>
                      {product.name}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" mb={2}>
                      {product._id}
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                      {product.price.toLocaleString()}₫
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <CustomButton1 onClick={() => navigate(`/products/${product._id}`)}>
                      Details
                    </CustomButton1>
                  </CardContent>
                </Card>
              </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Collections;
