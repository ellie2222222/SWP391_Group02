import React, { useState, useEffect } from 'react';
import { Box, IconButton, InputAdornment, Pagination, Stack, TextField, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Grid, Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ProductionForm from './ProductionForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';
import { Search } from '@mui/icons-material';

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

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
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
});

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

export default function ProductionStaffDashboard() {
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [requests, setRequests] = useState([]);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [isProductionDialogOpen, setIsProductionDialogOpen] = useState(false);
    const [isRequestDetailDialogOpen, setIsRequestDetailDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests', {
                params: {
                    ...Object.fromEntries(searchParams),
                },
            });
            setTotalPages(response.data.totalPages);
            setTotal(response.data.total)
            setRequests(response.data.requests);
        } catch (error) {
            toast.error('There was an error fetching the requests!', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        }
    };

    const handleProductionRequest = async (values) => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            handleCloseAllDialogs();
            toast.success('Production update successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            fetchRequests();
        } catch (error) {
            toast.error('Production update fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        }
    };

    const handleJewelryDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsJewelryDetailDialogOpen(true);
    };

    const handleRequestDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsRequestDetailDialogOpen(true);
    };

    const handleProductionOpen = (request) => {
        setSelectedRequest(request);
        setIsProductionDialogOpen(true);
    };

    const handleCloseAllDialogs = () => {
        setIsJewelryDetailDialogOpen(false);
        setIsRequestDetailDialogOpen(false);
        setIsProductionDialogOpen(false);
    };

    const handleCloseProduction = () => {
        setIsProductionDialogOpen(false);
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

    const handleSearchClick = () => {
        updateQueryParams('search', search, true);
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
        setSearch(searchParams.get('search') || '');
        fetchRequests();
    }, [searchParams]);

    useEffect(() => {
        fetchRequests();
    }, [searchParams, page]);

    const getTimestamp = (request) => {
        const status = request.status_history.find(history => history.status === 'production');
        return status ? new Date(status.timestamp).toLocaleDateString() : 'N/A';
    };

    return (
        <Container>
            <Box mb={2}>
                <CustomTextField
                    label="Search by request ID or email"
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
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request ID</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Sender</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request Status</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Status Update Date</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Description</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Jewelry</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request, index) => (
                            request.request_status === 'production' && (
                                <TableRow key={index}>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>{request._id}</CustomTableCell>
                                    <CustomTableCell>{request.user_id ? request.user_id.email : 'User not found'}</CustomTableCell>
                                    <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                    <CustomTableCell>
                                        {getTimestamp(request)}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 onClick={() => handleRequestDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 color="primary" onClick={() => handleJewelryDetailOpen(request)}>
                                            Jewelry Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 onClick={() => handleProductionOpen(request)}>Update Production</CustomButton1>
                                    </CustomTableCell>
                                </TableRow>
                            )
                        ))}
                        {requests.length === 0 && (
                            <TableRow>
                                <TableCell align='center' colSpan={9}>
                                    <Typography variant="h6">No requests found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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

            {/* Jewelry Detail Dialog */}
            <Dialog open={isJewelryDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle sx={{ fontSize: '2rem' }} align='center'>Jewelry Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.jewelry_id && (
                        <>
                            <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Name: {selectedRequest.jewelry_id.name}</Typography>
                            <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Price: {selectedRequest.jewelry_id.price} VND</Typography>
                            {selectedRequest.jewelry_id.gemstone_id && (
                                <>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone: {selectedRequest.jewelry_id.gemstone_id.name}</Typography>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone Carat: {selectedRequest.jewelry_id.gemstone_id.carat}</Typography>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone Shape: {selectedRequest.jewelry_id.gemstone_id.cut}</Typography>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone Color: {selectedRequest.jewelry_id.gemstone_id.color}</Typography>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone Clarity: {selectedRequest.jewelry_id.gemstone_id.clarity}</Typography>
                                </>
                            )}
                            <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Gemstone Weight: {selectedRequest.jewelry_id.gemstone_weight} kg</Typography>
                            {selectedRequest.jewelry_id.material_id && (
                                <>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Materials: {selectedRequest.jewelry_id.material_id.name}</Typography>
                                    <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Material Carat: {selectedRequest.jewelry_id.material_id.carat}</Typography>
                                </>
                            )}
                            <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Material Weight: {selectedRequest.jewelry_id.material_weight} kg</Typography>
                            <Typography mb={1} sx={{ fontSize: '1.3rem' }}>Category: {selectedRequest.jewelry_id.category}</Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {selectedRequest.jewelry_id.images.map((image, index) => (
                                    <Grid item xs={4} sm={4} md={4} key={index}>
                                        <CardMedia
                                            component="img"
                                            alt="Jewelry"
                                            image={image}
                                            sx={{ margin: '5px' }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Request Detail Dialog */}
            <Dialog open={isRequestDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle sx={{ fontSize: '2rem' }} align='center'>Request Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Typography sx={{ fontSize: '1.3rem'}}>Description: {selectedRequest.request_description}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Production Dialog */}
            <Dialog open={isProductionDialogOpen} onClose={handleCloseProduction}>
                <DialogContent>
                    <ProductionForm initialValues={selectedRequest} onSubmit={handleProductionRequest} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseProduction} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
