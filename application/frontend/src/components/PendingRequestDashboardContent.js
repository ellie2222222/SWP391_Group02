import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, CircularProgress, MenuItem, Select, InputLabel, FormControl, Stack, Pagination, InputAdornment, TextField } from '@mui/material';
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

const PendingRequestDashboardContent = () => {
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
    const [isDescriptionDetailDialogOpen, setIsDescriptionDetailDialogOpen] = useState(false); // State for description dialog
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
                    request_status: 'pending',
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
        setIsDescriptionDetailDialogOpen(true); // Open description dialog
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

    const getTimestamp = (request) => {
        const status = request.status_history.find(history => history.status === 'pending');
        return status ? new Date(status.timestamp).toLocaleDateString() : 'N/A';
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            ) : (
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
                                <CustomMenuItem value="pending">Pending</CustomMenuItem>
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
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Send Date</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Description</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }} align="center">Actions</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request, index) => (
                                    <TableRow key={index}>
                                        <CustomTableCell sx={{ fontWeight: "bold" }}>{request._id}</CustomTableCell>
                                        <CustomTableCell>{request.user_id ? request.user_id.email : 'N/A'}</CustomTableCell>
                                        <CustomTableCell style={{ textTransform: 'capitalize' }}>{capitalizeWords(request.request_status)}</CustomTableCell>
                                        <CustomTableCell>{getTimestamp(request)}</CustomTableCell>
                                        <CustomTableCell>
                                            <CustomButton1 color="primary" onClick={() => handleDescriptionDetailOpen(request)}>Details</CustomButton1>
                                        </CustomTableCell>
                                        <CustomTableCell align="center">
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
                            <DialogTitle align='center' variant='h2' fontWeight={300}>Staff Assignment</DialogTitle>
                            <DialogContent>
                                <StaffAssignmentForm selectedRequest={selectedRequest} fetchData={fetchRequests} handleCloseAllDialogs={handleCloseAllDialogs} finishAssignment={true}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseAllDialogs} sx={{ color: "#b48c72", fontSize: '1.3rem' }}>
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

            <Dialog open={isDescriptionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle align='center' variant='h4' fontWeight={300}>Description Details</DialogTitle>
                <DialogContent>
                    <LargeTypography>{selectedRequest && selectedRequest.request_description}</LargeTypography>
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

export default PendingRequestDashboardContent;
