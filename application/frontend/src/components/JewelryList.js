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
  fontSize: '1.3rem',
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
    fontSize: '1.3rem',
    "&:hover fieldset": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#b48c72",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: '1.3rem',
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  '& .MuiInputBase-input': {
    fontSize: '1.3rem',
  },
});

const CustomIconButton = styled(IconButton)({
  color: '#b48c72',
  '&:hover': {
      color: '#8e735c',
  },
});

const CustomFormControl = styled(FormControl)({
  minWidth: 120,
  "& .MuiInputLabel-root": {
    fontSize: '1.3rem',
    "&.Mui-focused": {
      color: "#b48c72",
    },
  },
  "& .MuiOutlinedInput-root": {
    fontSize: '1.3rem',
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b48c72",
    },
  },
});

const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
})

const JewelryList = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
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
          type: 'Sample',
        },
      });

      setProducts(response.data.jewelries);
      setTotal(response.data.total)
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('There was an error fetching products!', {
        autoClose: 5000, // Auto close after 5 seconds
        closeOnClick: true,
        draggable: true,
    });
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
            {/* Category Filter */}
            <CustomFormControl>
              <InputLabel id="category-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Category</InputLabel>
              <Select
                labelId='category-label'
                label='Category'
                value={category}
                onChange={(event) => handleFilterChange('category', event.target.value)}
              >
                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                <CustomMenuItem value="Ring">Ring</CustomMenuItem>
                <CustomMenuItem value="Necklace">Necklace</CustomMenuItem>
                <CustomMenuItem value="Bracelet">Bracelet</CustomMenuItem>
                <CustomMenuItem value="Earring">Earring</CustomMenuItem>
                <CustomMenuItem value="Other">Other</CustomMenuItem>
              </Select>
            </CustomFormControl>
            {/* Sort By Price Filter */}
            <CustomFormControl style={{ marginLeft: 20 }}>
              <InputLabel id="sort_by_price-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Sort By Price</InputLabel>
              <Select
                labelId='sort_by_price-label'
                label='Sort By Price'
                value={sortOrder}
                onChange={(event) => handleFilterChange('sortByPrice', event.target.value)}
              >
                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                <CustomMenuItem value="asc">Ascending</CustomMenuItem>
                <CustomMenuItem value="desc">Descending</CustomMenuItem>
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
        ))
        ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" width="100%">
          <Typography variant="h2">No products found</Typography>
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
