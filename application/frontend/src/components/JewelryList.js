import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button, TextField, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';

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
  variant: "outlined",
  padding: "0",
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

const CustomIconButton = styled(IconButton)({
  color: "#000",
  fontSize: "2.6rem",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
  },
});

const CustomFormControl = styled(FormControl)({
  minWidth: 120,
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
  },
});

const JewelryList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [onSale, setOnSale] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchJewelries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/jewelries?${searchParams.toString()}`);
      setProducts(response.data.jewelries);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJewelries();
  }, [searchParams]);

  const updateQueryParams = (key, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    setSearch(searchParams.get('name') || "");
    setOnSale(searchParams.get('on_sale') || "");
    setCategory(searchParams.get('category') || "");
    setSortOrder(searchParams.get('sortByPrice') || "");
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  const handleSearchClick = () => {
    updateQueryParams('name', search);
  };

  const handleFilterChange = (key, value) => {
    updateQueryParams(key, value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  const handlePageChange = (newPage) => {
    updateQueryParams('page', newPage);
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
      <ToastContainer />
      <Box padding='40px 0' minHeight="100vh">
        <Box display="flex" marginBottom="20px" flexDirection="column">
          <Box display="flex" marginBottom="20px">
            <CustomTextField
              size="normal"
              label="Search..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
              onKeyDown={handleKeyDown}
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
          <Box display="flex" marginBottom="20px">
            <CustomFormControl>
              <InputLabel>On Sale</InputLabel>
              <Select
                value={onSale}
                onChange={(event) => handleFilterChange('on_sale', event.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="false">Not On Sale</MenuItem>
                <MenuItem value="true">On Sale</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl style={{ marginLeft: 20 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(event) => handleFilterChange('category', event.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="Ring">Ring</MenuItem>
                <MenuItem value="Necklace">Necklace</MenuItem>
                <MenuItem value="Bracelet">Bracelet</MenuItem>
                <MenuItem value="Earring">Earring</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </CustomFormControl>
            <CustomFormControl style={{ marginLeft: 20 }}>
              <InputLabel>Sort By Price</InputLabel>
              <Select
                value={sortOrder}
                onChange={(event) => handleFilterChange('sortByPrice', event.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </CustomFormControl>
          </Box>
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
        <Box display="flex" justifyContent="center" marginTop="20px">
          <Button 
            disabled={page <= 1} 
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </Button>
          <Typography variant="h6" margin="0 10px">
            {page} / {totalPages}
          </Typography>
          <Button 
            disabled={page >= totalPages} 
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default JewelryList;
