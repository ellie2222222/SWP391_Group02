import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button,
  TextField, InputAdornment, IconButton, MenuItem, Select, FormControl, InputLabel, Pagination, Stack
} from '@mui/material';
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
  '& .MuiInputBase-input': {
    fontSize: '1.3rem',
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
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [onSale, setOnSale] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch products function
  const fetchJewelries = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/jewelries`, {
        params: {
          ...Object.fromEntries(searchParams),
          available: true,
        },
      });

      setProducts(response.data.jewelries);
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products on initial load and whenever searchParams change
  useEffect(() => {
    fetchJewelries();
  }, [searchParams, page]);

  // Update query params function
  const updateQueryParams = (key, value, resetPage = false) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    if (resetPage) {
      newSearchParams.set('page', '1');
    }
    setSearchParams(newSearchParams);
  };

  // Update state with query params on component mount
  useEffect(() => {
    setSearch(searchParams.get('name') || "");
    setOnSale(searchParams.get('on_sale') || "");
    setCategory(searchParams.get('category') || "");
    setSortOrder(searchParams.get('sortByPrice') || "");
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Handle search click event
  const handleSearchClick = () => {
    updateQueryParams('name', search, true);
  };

  // Handle filter change event
  const handleFilterChange = (key, value) => {
    updateQueryParams(key, value, true);
  };

  // Handle Enter key press in search input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    updateQueryParams('page', newPage.toString());
  };

  // Display loading spinner while fetching data
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
      <Box padding='40px 0'>
        {/* Search and Filter Controls */}
        <Box display="flex" mb={2} flexDirection="column">
          {/* Search Input */}
          <Box display="flex" mb={2}>
            <CustomTextField
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
          {/* Filters */}
          <Box display="flex">
            {/* On Sale Filter */}
            <CustomFormControl>
              <InputLabel sx={{ fontSize: '1.3rem', fontWeight: '900' }}>On Sale</InputLabel>
              <Select
                value={onSale}
                onChange={(event) => handleFilterChange('on_sale', event.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="false">Not On Sale</MenuItem>
                <MenuItem value="true">On Sale</MenuItem>
              </Select>
            </CustomFormControl>
            {/* Category Filter */}
            <CustomFormControl style={{ marginLeft: 20 }}>
              <InputLabel sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Category</InputLabel>
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
            {/* Sort By Price Filter */}
            <CustomFormControl style={{ marginLeft: 20 }}>
              <InputLabel sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Sort By Price</InputLabel>
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

        <Box mb={2}>
          <Typography variant='h5'>There are a total of {total} result(s)</Typography>
        </Box>

        {/* Jewelry Cards Grid */}
        <Grid container spacing={2}>
          {products.length > 0 ? (
            products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
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
                    {product.on_sale ? (
                      <>
                        <Typography variant="h4" sx={{ color: 'red', fontWeight: '300', mr: 1, display: 'inline-block' }}>
                          {(product.price - (product.price * (product.sale_percentage / 100))).toLocaleString()}₫
                        </Typography>
                        <Typography variant="h5" sx={{ textDecoration: 'line-through', fontWeight: '300', display: 'inline-block' }}>
                          {product.price.toLocaleString()}₫
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="h4" component="p" sx={{ color: 'red', fontWeight: '300' }}>
                        {product.price.toLocaleString()}₫
                      </Typography>
                    )}
                  <CustomButton1 onClick={() => navigate(`/products/${product._id}`)}>
                    Details
                  </CustomButton1>
                </CardContent>
              </Card>
              </Grid>
        ))
        ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" width="100%">
          <Typography variant="h6">No products found</Typography>
        </Box>
          )}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Stack spacing={2}>
          <Pagination
            size="large"
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
          />
        </Stack>
      </Box>
    </Box>
    </Container >
  );
};

export default JewelryList;
