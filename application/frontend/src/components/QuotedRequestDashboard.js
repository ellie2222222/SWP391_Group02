import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Stack, Pagination, TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import UserFeedbackQuoteForm from './UserFeedbackQuoteForm';
const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1.3rem',
    margin:'10px 0',
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

export default function QuotedRequestDashBoard() {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const [requests, setRequests] = useState([]);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/requests?request_status=quote', {
                params: {
                    ...Object.fromEntries(searchParams),
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

    const handleAcceptRequest = async () => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequestId}`, { request_status: 'accepted' });
            setError('');
            fetchRequests();
            handleCloseDialog();
            toast.success('Quote approved successfully!', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
            toast.error('Failed to approve the quote.', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };
    const handleRejectRequest = async (values) => {
        try {
            await axiosInstance.patch(`/requests/manager-fb-quote/${selectedRequest._id}`, values);
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            setError('');
            fetchRequests();
            handleCloseFeedBackDialog();
            toast.success('Quote Reject successfully!', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
            toast.error('Failed to reject the quote.', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleOpenDialog = (requestId) => {
        setSelectedRequestId(requestId);
        setIsDialogOpen(true);
    };
    const handleOpenFeedbackDialog = (request) => {
        setSelectedRequest(request);
        setIsFeedbackDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRequestId(null);
    };
    const handleCloseFeedBackDialog = () => {
        setIsFeedbackDialogOpen(false);
        setSelectedRequest(null);
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
        const status = request.status_history.find(history => history.status === 'quote');
        return status ? new Date(status.timestamp).toLocaleDateString() : 'N/A';
    }

    return (
        <Container>
            <DrawerHeader />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress />
                </Box>
            ) : (
                <>
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
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Request ID</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Sender</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Quote Content</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Quote Amount</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }}>Request Status</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Status Update Date</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Actions</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.map((request) => (
                                    <TableRow key={request._id}>
                                        <CustomTableCell sx={{ fontWeight: "bold" }}>{request._id}</CustomTableCell>
                                        <CustomTableCell>{request.user_id ? request.user_id.email : 'N/A'}</CustomTableCell>
                                        <CustomTableCell>{request.quote_content}</CustomTableCell>
                                        <CustomTableCell>{request.quote_amount}</CustomTableCell>
                                        <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                        <CustomTableCell>
                                            {getTimestamp(request)}
                                        </CustomTableCell>
                                        <CustomTableCell>
                                            <CustomButton1 onClick={() => handleOpenDialog(request._id)}>Approve Quote</CustomButton1>
                                            <CustomButton1 onClick={() => handleOpenFeedbackDialog(request)}>Reject Quote</CustomButton1>
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
                </>
            )}

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle align='center'>Confirm Approval</DialogTitle>
                <DialogContent>
                    <Typography variant='p' sx={{ fontSize: "1.3rem" }}>Are you sure you want to approve this quote?</Typography>
                </DialogContent>
                <DialogActions>
                    <CustomButton1 onClick={handleCloseDialog} sx={{ color: "white" }}>
                        Cancel
                    </CustomButton1>
                    <CustomButton1 onClick={handleAcceptRequest} sx={{ color: "white" }}>
                        Confirm
                    </CustomButton1>
                </DialogActions>
            </Dialog>
            <Dialog open={isFeedbackDialogOpen} onClose={handleCloseFeedBackDialog}>
                <DialogContent>
                        <UserFeedbackQuoteForm initialValues={selectedRequest} onSubmit={handleRejectRequest}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseFeedBackDialog} sx={{ fontSize: "1.3rem", color: "#b48c72" }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
}
