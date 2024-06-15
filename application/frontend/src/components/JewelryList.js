import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  border: '1px solid #000',
  color: '#000',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72', // Thay đổi màu chữ khi hover
    border: '1px solid #b48c72',
    backgroundColor: 'transparent',
  },
});

const JewelryList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/jewelries') // Thay đổi URL tới API của bạn
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (products.length <= 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">There was an error getting products!</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box padding='40px 0' minHeight="100vh">
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.images} // URL tới ảnh sản phẩm hoặc ảnh placeholder
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product._id}
                  </Typography>
                  <Typography variant="h6" color="text.primary">
                    {product.price} VND
                  </Typography>
                  <CustomButton1  onClick={() => navigate(`/product/${product._id}`)}>
                    Details
                  </CustomButton1>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default JewelryList;
