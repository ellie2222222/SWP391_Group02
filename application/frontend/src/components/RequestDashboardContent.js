import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, CircularProgress, MenuItem, Select, InputLabel, FormControl, Stack, Pagination, InputAdornment, TextField, Grid } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Edit, Search } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import RequestForm from './RequestForm';
import useAuth from '../hooks/useAuthContext';
import SaleStaffDashboard from './SaleStaffDashboard';
import ProductionStaffDashboard from './ProductionStaffDashboard';
import DesignStaffDashboard from './DesignStaffDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';
import StaffAssignmentForm from './StaffAssignmentForm';

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

const capitalizeWords = (str) => {
    const words = str.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return words.join(' ');
};

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
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDescriptionDetailDialogOpen, setIsDescriptionDetailDialogOpen] = useState(false);
    const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [requestStatus, setRequestStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/requests', {
                params: {
                    ...Object.fromEntries(searchParams),
                    request_status: { $ne: 'pending' },
                },
            });

            setRequests(response.data.requests);
            setTotalPages(response.data.totalPages);
            setTotal(response.data.total)
        } catch (error) {
            toast.error('There was an error fetching the requests!', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (request) => {
        setSelectedRequest(request);
        setIsEditDialogOpen(true);
    };

    const handleDescriptionDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsDescriptionDetailDialogOpen(true);
    };

    const handleAssignmentDialogOpen = (request) => {
        setSelectedRequest(request);
        setIsAssignmentDialogOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (selectedRequest) {
                await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            }
            toast.success('Request saved successfully!', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            handleCloseAllDialogs();
            fetchRequests();
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

    const handleCloseAllDialogs = () => {
        setIsEditDialogOpen(false);
        setIsDescriptionDetailDialogOpen(false);
        setIsAssignmentDialogOpen(false);
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

    const handleFilterChange = (key, value) => {
        updateQueryParams(key, value, true);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        updateQueryParams('page', newPage.toString());
    };

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setRequestStatus(searchParams.get('request_status') || '')
        fetchRequests();
    }, [searchParams]);

    useEffect(() => {
        fetchRequests();
    }, [searchParams, page]);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {user.role === 'manager' && (
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
                            <Box display="flex" mb={2}>
                                <CustomFormControl variant="outlined">
                                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Request Status</InputLabel>
                                    <Select
                                        sx={{ fontSize: "1.3rem" }}
                                        name="request_status"
                                        value={requestStatus}
                                        onChange={(event) => handleFilterChange('request_status', event.target.value)}
                                        label="Request Status"
                                    >
                                        <CustomMenuItem value="">All</CustomMenuItem>
                                        <CustomMenuItem value="assigned">Assigned</CustomMenuItem>
                                        <CustomMenuItem value="quote">Quote</CustomMenuItem>
                                        <CustomMenuItem value="accepted">Accepted</CustomMenuItem>
                                        <CustomMenuItem value="deposit">Deposit</CustomMenuItem>
                                        <CustomMenuItem value="design">Design</CustomMenuItem>
                                        <CustomMenuItem value="design_completed">Design Completed</CustomMenuItem>
                                        <CustomMenuItem value="production">Production</CustomMenuItem>
                                        <CustomMenuItem value="payment">Payment</CustomMenuItem>
                                        <CustomMenuItem value="warranty">Warranty</CustomMenuItem>
                                        <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                                        <CustomMenuItem value="completed">Completed</CustomMenuItem>
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
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Staffs</CustomTableCell>
                                            <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Actions</CustomTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {requests.map((request, index) => (
                                            <TableRow key={index}>
                                                <CustomTableCell sx={{ fontWeight: "bold" }}>{request._id}</CustomTableCell>
                                                <CustomTableCell>{request.user_id ? request.user_id.email : 'N/A'}</CustomTableCell>
                                                <CustomTableCell style={{ textTransform: 'capitalize' }}>{capitalizeWords(request.request_status)}</CustomTableCell>
                                                <CustomTableCell>
                                                    <CustomButton1 color="primary" onClick={() => handleDescriptionDetailOpen(request)}>Details</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell>
                                                    <CustomButton1 color="primary" onClick={() => handleAssignmentDialogOpen(request)}>Details</CustomButton1>
                                                </CustomTableCell>
                                                <CustomTableCell align='center'>
                                                    <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                                        <Edit sx={{ color: "#b48c72" }} fontSize='large' />
                                                    </IconButton>
                                                </CustomTableCell>
                                            </TableRow>
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
                                <Dialog open={isEditDialogOpen} onClose={handleCloseAllDialogs}>
                                    <DialogContent>
                                        <RequestForm initialValues={selectedRequest} onSubmit={handleSubmit} fetchData={fetchRequests} closeAllDialogs={handleCloseAllDialogs} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72", fontSize: '1.3rem' }}>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={isAssignmentDialogOpen} onClose={handleCloseAllDialogs}>
                                    <DialogTitle align='center' variant='h2' fontWeight={300}>Staffs Assignment</DialogTitle>
                                    <DialogContent>
                                        <StaffAssignmentForm selectedRequest={selectedRequest} fetchData={fetchRequests} handleCloseAllDialogs={handleCloseAllDialogs} finishAssignment={false} />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseAllDialogs} sx={{ fontSize: '1.3rem', color: "#b48c72" }}>
                                            Close
                                        </Button>
                                    </DialogActions>
                                </Dialog>
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
            <Dialog open={isDescriptionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' variant='h2'>Request Details</DialogTitle>
                <DialogContent>
                    <Typography variant='h3' fontWeight={300} my={2}>Description</Typography>
                    <LargeTypography>{selectedRequest && selectedRequest.request_description}</LargeTypography>
                    <Typography variant='h3' fontWeight={300} my={2}>Jewelry Information</Typography>
                    <Typography sx={{ fontSize: '1.3rem' }} mb={2}>Name: {selectedRequest?.jewelry_id?.name || 'N/A'}</Typography>
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
                                        <LargeTypography variant="body1" align='center'>{selectedRequest?.jewelry_id?.category || '-'}</LargeTypography>
                                    </TableCell>
                                </TableRow>

                                {/* Material Section */}
                                <TableRow>
                                    <TableCell rowSpan={2}>
                                        <Typography variant="h6">Material</Typography>
                                    </TableCell>
                                    <TableCell colSpan={4}>
                                        <LargeTypography variant="body1" align='center'>{selectedRequest?.jewelry_id?.material_id?.name || '-'}</LargeTypography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="h6">Material Carat</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <LargeTypography variant="body1">{selectedRequest?.jewelry_id?.material_id?.carat || '-'}</LargeTypography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="h6">Material Weight</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <LargeTypography variant="body1">{selectedRequest?.jewelry_id ? selectedRequest?.jewelry_id?.material_weight + ' mace' : '-'} </LargeTypography>
                                    </TableCell>
                                </TableRow>

                                {/* Gemstone Section */}
                                {selectedRequest?.jewelry_id?.gemstone_ids && selectedRequest?.jewelry_id?.gemstone_ids.length > 0 && (
                                    selectedRequest?.jewelry_id?.gemstone_ids.map((gemstone) => (
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
                                {selectedRequest?.jewelry_id?.subgemstone_ids && selectedRequest?.jewelry_id?.subgemstone_ids.length > 0 && (
                                    selectedRequest?.jewelry_id?.subgemstone_ids.map((subgemstone) => (
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
                    <Typography variant='h3' fontWeight={300} my={2}>Images</Typography>
                    <Grid container spacing={2}>
                        {selectedRequest?.jewelry_id?.images.map((image, index) => (
                            <Grid item xs={4}>
                                <CardMedia
                                    key={index}
                                    component="img"
                                    alt="Jewelry"
                                    image={image}
                                    sx={{ width: '100%', margin: '0px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Typography variant='h3' fontWeight={300} my={2}>Quote Information</Typography>
                    <LargeTypography>Quote Amount: {(selectedRequest && selectedRequest.quote_amount) ? selectedRequest.quote_amount : 'N/A'}</LargeTypography>
                    <LargeTypography>Quote Content: {(selectedRequest && selectedRequest.quote_content) ? selectedRequest.quote_content : 'N/A'}</LargeTypography>
                    <Typography variant='h3' fontWeight={300} my={2}>Production Information</Typography>
                    <LargeTypography>Production Start Date: {(selectedRequest && selectedRequest.production_start_date) ? new Date(selectedRequest.production_start_date).toLocaleDateString() : 'N/A'}</LargeTypography>
                    <LargeTypography>Production End Date: {(selectedRequest && selectedRequest.production_end_date) ? new Date(selectedRequest.production_end_date).toLocaleDateString() : 'N/A'}</LargeTypography>
                    <LargeTypography>Production Cost: {(selectedRequest && selectedRequest.production_cost) ? selectedRequest.production_cost : 'N/A'}</LargeTypography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{ fontSize: '1.3rem', color: "#b48c72" }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default RequestDashboardContent;
