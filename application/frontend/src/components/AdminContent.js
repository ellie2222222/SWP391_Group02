import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel, Pagination, Stack } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import JewelryForm from './JewelryForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

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


const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',  // Adjust the font size as needed
});

const AdminContent = () => {
    const [jewelries, setJewelries] = useState([]);
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [onSale, setOnSale] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [available, setAvailable] = useState("")
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchJewelries = async () => {
        try {
            const response = await axiosInstance.get('/jewelries', {
                params: {
                    ...Object.fromEntries(searchParams),
                },
            });
            setJewelries(response.data.jewelries);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("There was an error fetching the jewelries!", error);
        }
    };

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
        setAvailable(searchParams.get('available') || "");
        setType(searchParams.get('type') || "");
        setPage(parseInt(searchParams.get('page') || '1', 10));
    }, [searchParams]);

    // Handle search click event
    const handleSearchClick = () => {
        updateQueryParams('search', search, true);
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

    // Fetch jewelries on initial load and whenever searchParams change
    useEffect(() => {
        fetchJewelries();
    }, [searchParams, page]);

    // Update component state with query params on mount
    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setPage(parseInt(searchParams.get('page') || '1', 10));
    }, [searchParams]);

    const handleAddClick = () => {
        setSelectedJewelry(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (jewelry) => {
        setSelectedJewelry(jewelry);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/jewelries/${id}`);
            fetchJewelries();
            toast.success('Jewelry item deleted successfully');
        } catch (error) {
            console.error('Error deleting jewelry:', error);
            toast.error('Failed to delete jewelry item');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedJewelry) {
                await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values);
                toast.success('Jewelry item updated successfully');
            } else {
                await axiosInstance.post('/jewelries', values);
                toast.success('Jewelry item added successfully');
            }
            fetchJewelries();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the jewelry!", error);
            toast.error(error.response?.data?.error || error.message);
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <Box display="flex" marginBottom="20px" flexDirection="column">
                    <Box display="flex" marginBottom="20px">
                        <CustomTextField
                            size="normal"
                            label="Search..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <StyledIconButton color="inherit" onClick={handleSearchClick}>
                                            <Search fontSize="large" />
                                        </StyledIconButton>
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
                            <InputLabel>Type</InputLabel>
                            <Select
                                value={type}
                                onChange={(event) => handleFilterChange('type', event.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="Sample">Sample</MenuItem>
                                <MenuItem value="Custom">Custom</MenuItem>
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
                        <CustomFormControl style={{ marginLeft: 20 }}>
                            <InputLabel>Available</InputLabel>
                            <Select
                                value={available}
                                onChange={(event) => handleFilterChange('available', event.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </Select>
                        </CustomFormControl>
                    </Box>
                </Box>
                <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={handleAddClick}>
                    Add Jewelry
                </CustomButton1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell>Name</CustomTableCell>
                                <CustomTableCell>Category</CustomTableCell>
                                <CustomTableCell>On Sale</CustomTableCell>
                                <CustomTableCell>Available</CustomTableCell>
                                <CustomTableCell>Type</CustomTableCell>
                                <CustomTableCell>Price</CustomTableCell>
                                <CustomTableCell align='center'>Images</CustomTableCell>
                                <CustomTableCell align='center'>Actions</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jewelries.map((jewelry) => (
                                <TableRow key={jewelry._id}>
                                    <CustomTableCell>{jewelry.name}</CustomTableCell>
                                    <CustomTableCell>{jewelry.category}</CustomTableCell>
                                    <CustomTableCell>{jewelry.on_sale === true ? 'Yes' : 'No'}</CustomTableCell>
                                    <CustomTableCell>{jewelry.available === true ? 'Yes' : 'No'}</CustomTableCell>
                                    <CustomTableCell>{jewelry.type}</CustomTableCell>
                                    <CustomTableCell>{jewelry.price}</CustomTableCell>
                                    <TableCell>
                                        {jewelry.images[0] && (
                                            <CardMedia
                                                component="img"
                                                alt="Jewelry"
                                                image={jewelry.images[0]}
                                                sx={{ width: '100%', maxHeight: '400px', margin: '0px' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <StyledIconButton onClick={() => handleEditClick(jewelry)}>
                                            <Edit />
                                        </StyledIconButton>
                                        <StyledIconButton onClick={() => handleDeleteClick(jewelry._id)}>
                                            <Delete />
                                        </StyledIconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Pagination */}
                <Box display="flex" justifyContent="center" marginTop="20px">
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Box>

                {/* Dialog for Add/Edit Jewelry */}
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>{selectedJewelry ? 'Edit Jewelry' : 'Add Jewelry'}</DialogTitle>
                    <DialogContent>
                        <JewelryForm initialValues={selectedJewelry || { name: '', description: '', price: 0, gemstone_id: '', gemstone_weight: 0, material_id: '', material_weight: 0, category: '', type: '', on_sale: false, sale_percentage: 0, images: [], available: false }} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <ToastContainer />
        </Box>
    );
};

export default AdminContent;


