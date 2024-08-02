//admin jewelry management
import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel, Pagination, Stack } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
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
    fontSize: '1.3rem',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

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

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
});

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

const AdminContent = () => {
    const [jewelries, setJewelries] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [available, setAvailable] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [jewelryToDelete, setJewelryToDelete] = useState(null);


    const fetchJewelries = async () => {
        try {
            const response = await axiosInstance.get('/jewelries', {
                params: {
                    ...Object.fromEntries(searchParams),
                },
            });

            setJewelries(response.data.jewelries);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
        }
    };

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

    useEffect(() => {
        setSearch(searchParams.get('name') || '');
        setCategory(searchParams.get('category') || '');
        setSortOrder(searchParams.get('sortByPrice') || '');
        setAvailable(searchParams.get('available') || '');
        setType(searchParams.get('type') || '');
        setPage(parseInt(searchParams.get('page') || '1', 10));
    }, [searchParams]);

    const handleSearchClick = () => {
        updateQueryParams('name', search, true);
    };

    const handleFilterChange = (key, value) => {
        updateQueryParams(key, value, true);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        updateQueryParams('page', newPage.toString());
    };

    useEffect(() => {
        fetchJewelries();
    }, [searchParams, page]);

    const handleAddClick = () => {
        setSelectedJewelry(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (jewelry) => {
        setSelectedJewelry(jewelry);
        setIsDialogOpen(true);
    };

    const handleDetailsClick = (jewelry) => {
        setSelectedJewelry(jewelry);
        setIsDetailsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setIsDetailsDialogOpen(false);
        setSelectedJewelry(null);
    };

    const handleDeleteClick = (jewelry) => {
        setJewelryToDelete(jewelry);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteDialogOpen(false);
        try {
            await axiosInstance.delete(`/jewelries/${jewelryToDelete}`);
            fetchJewelries();
            toast.success('Jewelry item deleted successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            toast.error('Failed to delete jewelry item', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } finally {
            setJewelryToDelete(null);
        }
    };

    const handleSubmit = async (values, gemstoneValues) => {
        try {
            setLoading(true);
            const gemstoneIdsToUpdate = [...new Set([...gemstoneValues.gemstone_ids, ...gemstoneValues.subgemstone_ids])];
            const gemstoneIdsDefault = [
                ...new Set([
                    ...(selectedJewelry?.subgemstone_ids?.map(gem => gem._id) || []),
                    ...(selectedJewelry?.gemstone_ids?.map(gem => gem._id) || [])
                ])
            ];
            const gemstoneAvailableAgain = gemstoneIdsDefault.filter(id => !gemstoneIdsToUpdate.includes(id));

            console.log(gemstoneAvailableAgain)
            const updateGemstoneRequests = gemstoneIdsToUpdate.map(id =>
                axiosInstance.patch(`/gemstones/${id}`, { available: false })
            );
            const updateGemstoneAvailableAgain = gemstoneAvailableAgain.map(id =>
                axiosInstance.patch(`/gemstones/${id}`, { available: true })
            );
            await Promise.all([...updateGemstoneRequests, ...updateGemstoneAvailableAgain]);
            if (selectedJewelry) {
                await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values);
                toast.success('Jewelry item updated successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            } else {
                await axiosInstance.post('/jewelries', values);
                toast.success('Jewelry item added successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            }
            fetchJewelries();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.error || error.message, {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <Box display="flex" mb={2} flexDirection="column">
                    <Box mb={2}>
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
                    <Box display="flex">
                        <CustomFormControl>
                            <InputLabel id="category-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Category</InputLabel>
                            <Select
                                labelId='category-label'
                                label="Category"
                                value={category}
                                onChange={(event) => handleFilterChange('category', event.target.value)}
                            >
                                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                <CustomMenuItem value="Ring">Ring</CustomMenuItem>
                                <CustomMenuItem value="Necklace">Necklace</CustomMenuItem>
                                <CustomMenuItem value="Bracelet">Bracelet</CustomMenuItem>
                                <CustomMenuItem value="Earrings">Earrings</CustomMenuItem>
                                <CustomMenuItem value="Other">Other</CustomMenuItem>
                            </Select>
                        </CustomFormControl>
                        <CustomFormControl style={{ marginLeft: 20 }}>
                            <InputLabel id="type-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Type</InputLabel>
                            <Select
                                labelId='type-label'
                                label="Type"
                                value={type}
                                onChange={(event) => handleFilterChange('type', event.target.value)}
                            >
                                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                <CustomMenuItem value="Sample">Sample</CustomMenuItem>
                                <CustomMenuItem value="Custom">Custom</CustomMenuItem>
                            </Select>
                        </CustomFormControl>
                        <CustomFormControl style={{ marginLeft: 20 }}>
                            <InputLabel id="sort_by_price-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Sort By Price</InputLabel>
                            <Select
                                labelId='sort_by_price-label'
                                label="Sort By Price"
                                value={sortOrder}
                                onChange={(event) => handleFilterChange('sortByPrice', event.target.value)}
                            >
                                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                <CustomMenuItem value="asc">Ascending</CustomMenuItem>
                                <CustomMenuItem value="desc">Descending</CustomMenuItem>
                            </Select>
                        </CustomFormControl>
                        <CustomFormControl style={{ marginLeft: 20 }}>
                            <InputLabel id="available-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Available</InputLabel>
                            <Select
                                labelId='available-label'
                                label="Available"
                                value={available}
                                onChange={(event) => handleFilterChange('available', event.target.value)}
                            >
                                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                <CustomMenuItem value="true">Yes</CustomMenuItem>
                                <CustomMenuItem value="false">No</CustomMenuItem>
                            </Select>
                        </CustomFormControl>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Typography variant='h5'>There are a total of {total} result(s)</Typography>
                </Box>

                <CustomButton1
                    startIcon={loading ? <CircularProgress size={20} /> : <Add fontSize='large' />}
                    variant="contained"
                    color="primary"
                    onClick={handleAddClick}
                    disabled={loading}
                >
                    <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>{loading ? 'Loading...' : 'Add Jewelry'}</Typography>
                </CustomButton1>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell sx={{ fontWeight: "bold" }}>ID</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: "bold" }}>Name</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: "bold" }}>Price</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Details</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Images</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Actions</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jewelries.length > 0 ? (
                                jewelries.map((jewelry) => (
                                    <TableRow key={jewelry._id}>
                                        <CustomTableCell sx={{ fontWeight: "bold" }}>{jewelry._id}</CustomTableCell>
                                        <CustomTableCell>{jewelry.name}</CustomTableCell>
                                        <CustomTableCell>{jewelry.price && jewelry.price.toLocaleString() + "₫"}</CustomTableCell>
                                        <CustomTableCell>
                                            <CustomButton1 onClick={() => handleDetailsClick(jewelry)}>Details</CustomButton1>
                                        </CustomTableCell>
                                        <TableCell>
                                            {jewelry.images[0] && (
                                                <CardMedia
                                                    component="img"
                                                    alt="Jewelry"
                                                    image={jewelry.images[0]}
                                                    sx={{ width: '250px', maxHeight: '400px', margin: "auto", padding: 0 }}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell align='center'>
                                            <IconButton onClick={() => handleEditClick(jewelry)}>
                                                <Edit sx={{ color: "#b48c72" }} fontSize="large" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(jewelry._id)}>
                                                <Delete sx={{ color: "#b48c72" }} fontSize="large" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align='center' colSpan={9}>
                                        <Typography variant="h6">No products found</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="center" marginTop="20px">
                    <Stack spacing={2}>
                        <Pagination
                            size='large'
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Box>

                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogContent>
                        <JewelryForm initialValues={selectedJewelry || { name: '', description: '', price: 0, gemstone_ids: [], gemstone_weight: 0, material_id: '', material_weight: 0, category: '', type: '', images: [], available: false, subgemstone_ids: [], subgemstone_quantity: 0 }} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)} sx={{ fontSize: "1.3rem", color: "#b48c72" }} disabled={loading}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={isDetailsDialogOpen} onClose={handleCloseDetailsDialog} fullWidth>
                    <DialogTitle align='center' variant='h5'>Jewelry Details</DialogTitle>
                    <DialogContent>
                        {selectedJewelry && (
                            <Box>
                                <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>Description: {selectedJewelry.description}</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>Price: {selectedJewelry.price}</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>Category: {selectedJewelry.category}</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>Type: {selectedJewelry.type}</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.3rem' }}>Available: {selectedJewelry.available ? 'Yes' : 'No'}</Typography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDetailsDialog} sx={{ color: '#b48c72', fontSize: '1.3rem' }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" align='center' variant='h5'>{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <Typography sx={{ fontSize: '1.3rem' }}>
                            Are you sure you want to delete this jewelry item?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDeleteDialogOpen(false)} sx={{ color: '#b48c72', fontSize: '1.3rem' }}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} sx={{ color: '#b48c72', fontSize: '1.3rem' }} autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>

            <ToastContainer />
        </Box>
    );
};

export default AdminContent;
