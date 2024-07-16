import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import {
  Link,
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Grid,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Paper,
  TableContainer,
  Icon,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';
import { toast, ToastContainer } from 'react-toastify';
import PhoneIcon from '@mui/icons-material/Phone';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import 'react-toastify/dist/ReactToastify.css';

const CustomButton = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1.3rem',
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
  fontSize: '1.3rem',
  textAlign: 'center',
});

const LargeTypography = styled(Typography)({
  fontSize: '1.3rem',
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
      setOpen(false);
      toast.success('Order created successfully!', { autoClose: 3000 });
    } catch (error) {
      console.error('Error while creating order information!', error);
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
        <Typography variant="h3" gutterBottom>Product not found</Typography>
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
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} margin='20px 0 50px 0' gap="1em" sx={{ height: { md: 500, xs: 'auto' } }}>
        <Box flex={1} sx={{ height: '100%' }}>
          <img src='https://www.tierra.vn/files/halo-A7tL5Eltco.webp' alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" gap='1em'>
          <Box>
            <Typography variant="h2" component="h1" gutterBottom>{product.name}</Typography>
            <LargeTypography variant="body1" gutterBottom sx={{ pb: 1, borderBottom: '1px solid #ccc' }}>Product ID: <strong>{product._id}</strong></LargeTypography>
            <LargeTypography variant="body1" sx={{ pb: 1, borderBottom: '1px solid #ccc' }}>{product.description}</LargeTypography>
          </Box>
          <Box>
            <Typography variant="h2" component="p" sx={{ color: 'red', fontWeight: '300' }}>
              {product.price.toLocaleString()}₫
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" gap="1em" sx={{ pt: 1, borderTop: '1px solid #ccc' }}>
            <Box display="flex" gap="1em">
              <Box display="flex" gap="0.5em" alignItems="center" flex={1}>
                <ChangeCircleIcon />
                <LargeTypography variant="body1">Product Exchange</LargeTypography>
              </Box>
              <Box display="flex" gap="0.5em" alignItems="center" flex={1}>
                <VerifiedIcon />
                <LargeTypography variant="body1">Lifetime Warranty</LargeTypography>
              </Box>
            </Box>
            <CustomButton variant="contained" onClick={handleClickOpen}>
              CREATE REQUEST NOW
            </CustomButton>
            <Box display="flex" alignItems="center" justifyContent="center" gap='0.5rem'>
              <LargeTypography>
                Need some help?
              </LargeTypography>
              <Icon>
                <PhoneIcon />
              </Icon>
              <LargeTypography>
                1900-xxxx
              </LargeTypography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box marginBottom='50px'>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Product Information
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h4">Items</Typography></TableCell>
                <TableCell colSpan={2}><Typography variant="h4" align='center'>Details</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Material Section */}
              <TableRow>
                <TableCell rowSpan={3}>
                  <Typography variant="h6">Material</Typography>
                </TableCell>
                <TableCell colSpan={2}>
                  <LargeTypography variant="body1" align='center'>{product.material_id ? product.material_id.name : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Material Carat</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.material_id ? product.material_id.carat : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Material Weight</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.material_weight} kg</LargeTypography>
                </TableCell>
              </TableRow>

              {/* Gemstone Section */}
              <TableRow>
                <TableCell rowSpan={6}>
                  <Typography variant="h6">Gemstone</Typography>
                </TableCell>
                <TableCell colSpan={2}>
                  <LargeTypography variant="body1" align='center'>{product.gemstone_id ? product.gemstone_id.name : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Gemstone Carat</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.gemstone_id ? product.gemstone_id.carat : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Gemstone Shape</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.gemstone_id ? product.gemstone_id.cut : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Gemstone Color</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.gemstone_id ? product.gemstone_id.color : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Gemstone Clarity</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.gemstone_id ? product.gemstone_id.clarity : '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Gemstone Weight</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.gemstone_weight} kg</LargeTypography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="h6">Category</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product.category}</LargeTypography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
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
            Are you sure you want to create a request using this sample?
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

      <ToastContainer />
    </Container>
  );
};

export default JewelryDetails;
