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
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  Paper,
  TableContainer,
  Icon,
  TextField,
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

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#EEEEEE',
  width: '100%',
  fontSize: '1.3rem',
  '&:hover': {
    color: '#b48c72',
    backgroundColor: 'transparent',
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  fontSize: '2rem',
  textAlign: 'center',
  fontWeight: 'bold',
});

const StyledDialogContentText = styled(DialogContentText)({
  color: '#000',
  fontSize: '1.5rem',
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

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#b48c72',
    color: '#b48c72',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#b48c72',
    borderBottomColor: '#b48c72',
  },
  '& .MuiOutlinedInput-root': {
    fontSize: "1.3rem",
    '& fieldset': {
      borderColor: '#b48c72',
    },
    '&:hover fieldset': {
      borderColor: '#b48c72',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b48c72',
    },
    fontSize: "1.3rem",
    '& fieldset': {
      borderColor: '#b48c72',
    },
    '&:hover fieldset': {
      borderColor: '#b48c72',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b48c72',
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "1.3rem",
    "&.Mui-focused": {
      color: "#b48c72",
    },
    fontSize: "1.3rem",
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  "& .MuiFormHelperText-root": {
    fontSize: "1.2rem",
    marginLeft: 0,
    fontSize: "1.2rem",
    marginLeft: 0,
  },
  "& .MuiTypography-root": {
    fontSize: "1.2rem",
    marginLeft: 0,
    fontSize: "1.2rem",
    marginLeft: 0,
  },
});

const JewelryDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ description: '' });
  const fetchJewelry = async () => {
    try {
      const response = await axiosInstance.get(`/jewelries/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJewelry();
  }, [id]);

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axiosInstance.post('/requests/order-requests', {
        jewelry_id: product._id,
        ...formData
      });

      await axiosInstance.patch(`/jewelries/${product._id}/availability`, { available: false });

      setOpen(false);
      toast.success('Request created successfully!', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
        });
    } catch (error) {
      toast.error('Failed to create request. Please try again later.', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
        });
    };
    fetchJewelry();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
            {product.available ? (
              <CustomButton variant="contained" onClick={handleClickOpen}>
              CREATE REQUEST NOW
            </CustomButton>
            ) : (
              <CustomButton1 disabled>
              SOLD OUT
            </CustomButton1>
            )}
            
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
                <TableCell colSpan={4}><Typography variant="h4" align='center'>Details</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              <TableRow>
                <TableCell>
                  <Typography variant="h6">Category</Typography>
                </TableCell>
                <TableCell colSpan={4}>
                  <LargeTypography variant="body1" align='center'>{product.category}</LargeTypography>
                </TableCell>
              </TableRow>

              {/* Material Section */}
              <TableRow>
                <TableCell rowSpan={2}>
                  <Typography variant="h6">Material</Typography>
                </TableCell>
                <TableCell colSpan={4}>
                  <LargeTypography variant="body1" align='center'>{product?.material_id?.name || '-'}</LargeTypography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Material Carat</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product?.material_id?.carat || '-'}</LargeTypography>
                </TableCell>
                <TableCell>
                  <Typography variant="h6">Material Weight</Typography>
                </TableCell>
                <TableCell>
                  <LargeTypography variant="body1">{product ? product?.material_weight + ' mace' : '-'}</LargeTypography>
                </TableCell>
              </TableRow>

              {/* Gemstone Section */}
              {product.gemstone_ids && product.gemstone_ids.length > 0 && (
                product.gemstone_ids.map((gemstone) => (
                  <>
                    <TableRow>
                      <TableCell rowSpan={5}>
                        <Typography variant="h6">Main Gemstone</Typography>
                      </TableCell>
                      <TableCell colSpan={4}>
                        <LargeTypography variant="body1" align='center'>{gemstone.name || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Carat</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.carat || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Shape</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.cut || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Color</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.color || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Clarity</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.clarity || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Measurements</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.measurements || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Polish</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.polish || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Symmetry</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.symmetry || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Fluorescence</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{gemstone.fluorescence || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                  </>
                ))
              )}

              {/* Subgemstone Section */}
              {product.subgemstone_ids && product.subgemstone_ids.length > 0 && (
                product.subgemstone_ids.map((subgemstone) => (
                  <>
                    <TableRow>
                      <TableCell rowSpan={5}>
                        <Typography variant="h6">Sub Gemstone</Typography>
                      </TableCell>
                      <TableCell colSpan={4}>
                        <LargeTypography variant="body1" align='center'>{subgemstone.name || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Carat</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.carat || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Shape</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.cut || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Color</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.color || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Clarity</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.clarity || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Measurements</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.measurements || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Polish</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.polish || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6">Gemstone Symmetry</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.symmetry || '-'}</LargeTypography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6">Gemstone Fluorescence</Typography>
                      </TableCell>
                      <TableCell>
                        <LargeTypography variant="body1">{subgemstone.fluorescence || '-'}</LargeTypography>
                      </TableCell>
                    </TableRow>
                  </>
                ))
              )}
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
          <DialogContentText id="alert-dialog-description" sx={{ fontSize: '1.3rem', fontWeight: '600' }} mt={2}>
            Additional custom idea you want to change for this sample (or leave blank)
          </DialogContentText>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <CustomTextField
              id="description"
              name="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={handleChange}
            />
          </Box>
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
