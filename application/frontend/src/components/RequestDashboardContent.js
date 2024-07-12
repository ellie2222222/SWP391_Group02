import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, CircularProgress, MenuItem, Select, InputLabel, FormControl, Stack, Pagination } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import RequestForm from './RequestForm';
import useAuth from '../hooks/useAuthContext';
import SaleStaffDashboard from './SaleStaffDashboard';
import ProductionStaffDashboard from './ProductionStaffDashboard';
import DesignStaffDashboard from './DesignStaffDashboard';
import { toast, ToastContainer } from 'react-toastify';

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

const CustomFormControl = styled(FormControl)({
    minWidth: 130,
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
    fontSize: '1.3rem',
});

const LargeTypography = styled(Typography)({
    fontSize: '1.3rem',
});

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

const RequestDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [isQuoteDetailDialogOpen, setIsQuoteDetailDialogOpen] = useState(false);
    const [isDesignDetailDialogOpen, setIsDesignDetailDialogOpen] = useState(false);
    const [isProductionDetailDialogOpen, setIsProductionDetailDialogOpen] = useState(false);
    const [isDescriptionDetailDialogOpen, setIsDescriptionDetailDialogOpen] = useState(false); // State for description dialog
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const { user } = useAuth();

    const [filter, setFilter] = useState({
        request_status: '',
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/requests/', { params: { ...filter, page } });
            setRequests(response.data.requests);
            setTotalPages(response.data.totalPages);
            setTotal(response.data.total)
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (request) => {
        setSelectedRequest(request);
        setIsEditDialogOpen(true);
    };

    const handleJewelryDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsJewelryDetailDialogOpen(true);
    };

    const handleQuoteDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsQuoteDetailDialogOpen(true);
    };

    const handleDesignDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsDesignDetailDialogOpen(true);
    };

    const handleProductionDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsProductionDetailDialogOpen(true);
    };

    const handleDescriptionDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsDescriptionDetailDialogOpen(true); // Open description dialog
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            let response;
            if (selectedRequest) {
                response = await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            }
            fetchRequests();
            handleCloseAllDialogs();
            toast.success('Request saved successfully!');
        } catch (error) {
            console.error("There was an error saving the request!", error);
            toast.error(error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAllDialogs = () => {
        setIsEditDialogOpen(false);
        setIsJewelryDetailDialogOpen(false);
        setIsQuoteDetailDialogOpen(false);
        setIsDesignDetailDialogOpen(false);
        setIsProductionDetailDialogOpen(false);
        setIsDescriptionDetailDialogOpen(false); // Close description dialog
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        fetchRequests();
    }, [filter, page]);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {user.role === 'manager' && (
                        <Container>
                            <Box display="flex" mb={2}>
                                <CustomFormControl variant="outlined">
                                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Request Status</InputLabel>
                                    <Select
                                        sx={{ fontSize: "1.3rem" }}
                                        name="request_status"
                                        value={filter.request_status}
                                        onChange={handleFilterChange}
                                        label="Request Status"
                                    >
                                        <CustomMenuItem value="">All</CustomMenuItem>
                                        <CustomMenuItem value="pending">Pending</CustomMenuItem>
                                        <CustomMenuItem value="accepted">Accepted</CustomMenuItem>
                                        <CustomMenuItem value="quote">Quote</CustomMenuItem>
                                        <CustomMenuItem value="design">Design</CustomMenuItem>
                                        <CustomMenuItem value="production">Production</CustomMenuItem>
                                        <CustomMenuItem value="payment">Payment</CustomMenuItem>
                                        <CustomMenuItem value="warranty">Warranty</CustomMenuItem>
                                        <CustomMenuItem value="approved">Approved</CustomMenuItem>
                                        <CustomMenuItem value="rejected">Rejected</CustomMenuItem>
                                    </Select>
                                </CustomFormControl>
                            </Box>

                            <Box mb={2}>
                                <Typography variant='h5'>There are a total of {total} result(s)</Typography>
                            </Box>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <CustomTableCell sx={{ fontWeight: "bold" }}>Request ID</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }}>Sender</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }}>Request Status</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Description</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Jewelry</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Quote</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Design</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Production</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }}>Actions</CustomTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map((request, index) => (
                                            <TableRow key={index}>
                                                <CustomTableCell sx={{ fontWeight: "bold" }}>{request._id}</CustomTableCell>
                                                <CustomTableCell>{request.user_id ? request.user_id.email : 'N/A'}</CustomTableCell>
                                                <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                                <CustomTableCell>
                                                    <CustomButton1 color="primary" onClick={() => handleDescriptionDetailOpen(request)}>Detail</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell align="center">
                                                    <CustomButton1 color="primary" onClick={() => handleJewelryDetailOpen(request)}>Detail</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell align="center">
                                                    <CustomButton1 color="primary" onClick={() => handleQuoteDetailOpen(request)}>Detail</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell align="center">
                                                    <CustomButton1 color="primary" onClick={() => handleDesignDetailOpen(request)}>Detail</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell align="center">
                                                    <CustomButton1 color="primary" onClick={() => handleProductionDetailOpen(request)}>Detail</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell>
                                                    <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                                        <Edit sx={{ color: "#b48c72" }} fontSize='large' />
                                                    </IconButton>
                                                </CustomTableCell>
                                            </TableRow>
                                        ))}
                                        {requests.length === 0 && (
                                            <TableRow>
                                                <TableCell align='center' colSpan={9}>
                                                    <Typography variant="h6">No products found</Typography>
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
                        </Container>
                    )}
                    {user.role === 'sale_staff' && <SaleStaffDashboard />}
                    {user.role === 'design_staff' && <DesignStaffDashboard />}
                    {user.role === 'production_staff' && <ProductionStaffDashboard />}
                </>
            )}
            <Dialog open={isEditDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogContent>
                    <RequestForm initialValues={selectedRequest} role={user.role} onSubmit={handleSubmit} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72", fontSize: '1.3rem' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isJewelryDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' sx={{ fontSize: "1.5rem" }}>Jewelry Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.jewelry_id && (
                        <>
                            <LargeTypography marginBottom="10px">Name: {selectedRequest.jewelry_id.name}</LargeTypography>
                            <LargeTypography marginBottom="10px">Price: {selectedRequest.jewelry_id.price} VND</LargeTypography>
                            {selectedRequest.jewelry_id.gemstone_id && (
                                <>
                                    <LargeTypography marginBottom="10px">Gemstone: {selectedRequest.jewelry_id.gemstone_id.name}</LargeTypography>
                                    <LargeTypography marginBottom="10px">Gemstone Carat: {selectedRequest.jewelry_id.gemstone_id.carat}</LargeTypography>
                                    <LargeTypography marginBottom="10px">Gemstone Shape: {selectedRequest.jewelry_id.gemstone_id.cut}</LargeTypography>
                                    <LargeTypography marginBottom="10px">Gemstone Color: {selectedRequest.jewelry_id.gemstone_id.color}</LargeTypography>
                                    <LargeTypography marginBottom="10px">Gemstone Clarity: {selectedRequest.jewelry_id.gemstone_id.clarity}</LargeTypography>
                                </>
                            )}
                            <LargeTypography marginBottom="10px">Gemstone Weight: {selectedRequest.jewelry_id.gemstone_weight} kg</LargeTypography>
                            {selectedRequest.jewelry_id.material_id && (
                                <>
                                    <LargeTypography marginBottom="10px">Materials: {selectedRequest.jewelry_id.material_id.name}</LargeTypography>
                                    <LargeTypography marginBottom="10px">Material Carat: {selectedRequest.jewelry_id.material_id.carat}</LargeTypography>
                                </>
                            )}
                            <LargeTypography marginBottom="10px">Material Weight: {selectedRequest.jewelry_id.material_weight} kg</LargeTypography>
                            <LargeTypography marginBottom="10px">Category: {selectedRequest.jewelry_id.category}</LargeTypography>
                            {selectedRequest.jewelry_id.images.map((image, index) => (
                                <CardMedia
                                    key={index}
                                    component="img"
                                    alt="Jewelry"
                                    image={image}
                                    sx={{ width: '100%', margin: '0px' }}
                                />
                            ))}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isQuoteDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' sx={{ fontSize: "1.5rem" }}>Quote Detail</DialogTitle>
                <DialogContent>
                    <LargeTypography>Quote Amount: {(selectedRequest && selectedRequest.quote_amount) ? selectedRequest.quote_amount : 'N/A'}</LargeTypography>
                    <LargeTypography>Quote Content: {(selectedRequest && selectedRequest.quote_content) ? selectedRequest.quote_content : 'N/A'}</LargeTypography>
                    <LargeTypography>Quote Status: {(selectedRequest && selectedRequest.quote_status) ? selectedRequest.quote_status : 'N/A'}</LargeTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isDesignDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' sx={{ fontSize: "1.5rem" }}>Design Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.design_status === 'ongoing' && (
                        <CustomButton1 color="primary" onClick={() => { }}>
                            Add Design
                        </CustomButton1>
                    )}
                    <LargeTypography>Design Status: {(selectedRequest && selectedRequest.design_status) ? selectedRequest.design_status : 'N/A'}</LargeTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isProductionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' sx={{ fontSize: "1.5rem" }}>Production Detail</DialogTitle>
                <DialogContent>
                    <LargeTypography>Production Start Date: {(selectedRequest && selectedRequest.production_start_date) ? new Date(selectedRequest.production_start_date).toLocaleDateString() : 'N/A'}</LargeTypography>
                    <LargeTypography>Production End Date: {(selectedRequest && selectedRequest.production_end_date) ? new Date(selectedRequest.production_end_date).toLocaleDateString() : 'N/A'}</LargeTypography>
                    <LargeTypography>Production Cost: {(selectedRequest && selectedRequest.production_cost) ? selectedRequest.production_cost : 'N/A'}</LargeTypography>
                    <LargeTypography>Production Status: {(selectedRequest && selectedRequest.production_status) ? selectedRequest.production_status : 'N/A'}</LargeTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isDescriptionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' sx={{ fontSize: "1.5rem" }}>Description Detail</DialogTitle>
                <DialogContent>
                    <LargeTypography>{selectedRequest && selectedRequest.request_description}</LargeTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
};

export default RequestDashboardContent;
