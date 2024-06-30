import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Container, Box, Typography, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';
import PhoneIcon from '@mui/icons-material/Phone';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomButton = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72',
    backgroundColor: 'transparent',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  textAlign: 'center',
  fontWeight: 'bold',
});

const StyledDialogContentText = styled(DialogContentText)({
  color: '#000',
  fontSize: '1.2rem', // Increased font size
  textAlign: 'center',
});

const LargeTypography = styled(Typography)({
  fontSize: '1.2rem', // Increased font size
});

const CenteredBox = styled(Box)({
  maxWidth: '300px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

const JewelryDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
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

    fetchJewelry();
  }, [id]);

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post('/requests/order-requests', { jewelry_id: id });
      setError('');
      setOpen(false); // Close the dialog
      toast.success('Order created successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error while creating order information!', error);
      setError(error.response ? error.response.data.error : error.message);
      toast.error('Failed to create order. Please try again later.', { autoClose: 3000 });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <CenteredBox>
        <Typography variant="h5" gutterBottom>Product not found</Typography>
        <CustomButton component={RouterLink} to="/products">
          Go back to product list
        </CustomButton>
      </CenteredBox>
    );
  }

  return (
    <Container>
      <Link component={RouterLink} to="/products" underline="none" sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <KeyboardBackspaceIcon sx={{ mr: 1, color: 'text.primary' }} />
        <LargeTypography variant="body1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Back to product list
        </LargeTypography>
      </Link>
      <Box display="flex" flexDirection="row" padding="40px 0" gap='1em'>
        <Box flex={1}>
          <img src='https://www.tierra.vn/files/halo-A7tL5Eltco.webp' alt={product.name} style={{ width: '100%', height: '100%' }} />
        </Box>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Box>
            <Typography variant="h2" component="h1" gutterBottom>{product.name}</Typography>
            <LargeTypography variant="body1" gutterBottom>Product ID: <strong>{product._id}</strong></LargeTypography>
            {product.on_sale ? (
              <>
                <Typography variant="h4" sx={{ color: 'red', fontWeight: '300', display: 'inline-block', mr: 1 }}>
                  {(product.price - (product.price * (product.sale_percentage / 100))).toLocaleString()}₫
                </Typography>
                <Typography variant="h5" sx={{ textDecoration: 'line-through', fontWeight: '300', display: 'inline-block' }}>
                  {product.price.toLocaleString()}₫
                </Typography>
              </>
            ) : (
              <Typography variant="h4" component='p' sx={{ color: 'red', fontWeight: '300' }}>
                {product.price.toLocaleString()}₫
              </Typography>
            )}
          </Box>
          <Box display="flex" flexDirection="column" gap='1em'>
            <CustomButton variant="contained" onClick={handleClickOpen}>
              ORDER NOW
            </CustomButton>
            <LargeTypography variant="p" component='h6' align='center'>Need some help? <PhoneIcon />1900-xxxx</LargeTypography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h2" component="h1" gutterBottom align='center'>Product Information</Typography>
        <Box padding='20px 0' display="flex" flexDirection="column">
          <Typography variant="h4" gutterBottom>Description</Typography>
          <LargeTypography variant="body1">{product.description}</LargeTypography>
        </Box>
        <Box paddingBottom='40px' display="flex" flexDirection="column">
          <Typography variant="h4" gutterBottom>Information</Typography>
          {product.gemstone_id && (
            <Box>
              <LargeTypography variant="body1">Gemstone: {product.gemstone_id.name}</LargeTypography>
              <LargeTypography variant="body1">Gemstone Carat: {product.gemstone_id.carat}</LargeTypography>
              <LargeTypography variant="body1">Gemstone Shape: {product.gemstone_id.cut}</LargeTypography>
              <LargeTypography variant="body1">Gemstone Color: {product.gemstone_id.color}</LargeTypography>
              <LargeTypography variant="body1">Gemstone Clarity: {product.gemstone_id.clarity}</LargeTypography>
            </Box>
          )}
          <LargeTypography variant="body1">Gemstone Weight: {product.gemstone_weight} kg</LargeTypography>
          {product.material_id && (
            <Box>
              <LargeTypography variant="body1">Materials: {product.material_id.name}</LargeTypography>
              <LargeTypography variant="body1">Material Carat: {product.material_id.carat}</LargeTypography>
            </Box>
          )}
          <LargeTypography variant="body1">Material Weight: {product.material_weight} kg</LargeTypography>
          <LargeTypography variant="body1">Category: {product.category}</LargeTypography>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <StyledDialogTitle id="alert-dialog-title">Confirm Order</StyledDialogTitle>
        <DialogContent>
          <StyledDialogContentText id="alert-dialog-description">
            Are you sure you want to place this order?
          </StyledDialogContentText>
        </DialogContent>
        <DialogActions>
          <CustomButton onClick={handleClose}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleCreateOrder} autoFocus>
            Confirm
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JewelryDetails;
