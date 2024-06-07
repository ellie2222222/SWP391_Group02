import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const JewelryDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/jewelry/getJewelry/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the product!', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return <Typography variant="h5">Product not found</Typography>;
  }

  return (
    <Container>
      <Box display="flex" flexDirection="row" padding="40px 0">
        <Box flex={1} paddingRight="20px">
          <img src='https://www.tierra.vn/files/halo-A7tL5Eltco.webp' alt={product.name} style={{ width: '100%' }} />
        </Box>
        <Box flex={1}>
          <Typography variant="h4" component="h1">{product.name}</Typography>
          <Typography variant="h5">{product.price} USD</Typography>
          <Typography variant="body1">SKU: {product.gemstone}</Typography>
          <Typography variant="body1">Type: {product.type}</Typography>
          <Typography variant="body1">Diamond Shape: {product.diamondShape}</Typography>
          <Typography variant="body1">Materials: {product.material}</Typography>
          <Typography variant="body1">Materials Colors: {product.materialColors}</Typography>
          <Typography variant="body1">Type of Stone: {product.typeOfStone}</Typography>
          <Typography variant="body1">Diamond Size: {product.diamondSize}</Typography>
          <Typography variant="body1">Ring Size: {product.ringSize}</Typography>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            ORDER NOW
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JewelryDetails;
