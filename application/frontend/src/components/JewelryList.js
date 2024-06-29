import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { TextFields } from '@mui/icons-material';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  border: '1px solid #000',
  color: '#000',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72',
    border: '1px solid #b48c72',
    backgroundColor: 'transparent',
  },
});

const CustomTextField = styled(TextField)({
  width: '100%',
  borderRadius: "30px", // Add border radius to round the corners
  variant: "outlined",
  padding: "0",
  "& fieldset": {
    borderRadius: "30px",
  },
});

const CustomIconButton = styled(IconButton)({
  color: "#000",
  fontSize: "2.6rem",

  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
  },
});

const JewelryList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJewelries = async () => {
    try {
      const response = await axiosInstance.get('/jewelries');
      setProducts(response.data);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJewelries();
  }, []);

  const handleSearchClick = async () => {
    
    const jewelry = await axiosInstance.get(`/jewelries?name=${search}`)

    setProducts(jewelry.data);
    try {

    } catch (error) {
      console.error(error)
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box padding='40px 0' minHeight="100vh">
        <Box display="flex" marginBottom="20px">
          <CustomTextField
            size="normal"
            label="Search..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CustomIconButton color="inherit" onClick={handleSearchClick}>
                    <SearchIcon fontSize="large" />
                  </CustomIconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="250"
                  image={product.images[0] || 'placeholder.jpg'} // Fallback to placeholder if no image
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
                  <CustomButton1 onClick={() => navigate(`/products/${product._id}`)}>
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
};

export default JewelryList;
