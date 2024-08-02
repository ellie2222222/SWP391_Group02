import React, { useState, useEffect } from 'react';
import { Typography, styled, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, InputAdornment, TextField, Stack, Pagination } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import QuoteForm from './QuoteForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';

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

const DetailDialog = ({ open, onClose, request }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle variant='h5'>Request Details</DialogTitle>
        <DialogContent>
            <Typography variant="p" sx={{ fontSize: '1.3rem' }}>{request?.request_description}</Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default function SaleStaffDashboard() {
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests', {
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
        }
    };

    const handleSubmit = async (values) => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            setIsDialogOpen(false);
            toast.success('Request update successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            fetchRequests();
        } catch (error) {
            toast.error('Request update fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleEditClick = (request) => {
        setIsDialogOpen(true);
        setSelectedRequest(request);
    };

    const handleDetailClick = (request) => {
        setIsDetailDialogOpen(true);
        setSelectedRequest(request);
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
        const status = request.status_history.find(history => history.status === 'pending');
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
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Manager Feedback</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>User Feedback</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request, index) => (
                            <TableRow key={index}>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>{request._id}</CustomTableCell>
                                <CustomTableCell>{request.user_id ? request.user_id.email : 'User not found'}</CustomTableCell>
                                <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                <CustomTableCell>
                                    {getTimestamp(request)}
                                </CustomTableCell>
                                <CustomTableCell onClick={() => handleDetailClick(request)}>
                                    <CustomButton1>
                                        Detail
                                    </CustomButton1>
                                </CustomTableCell>
                                <CustomTableCell style={{ textTransform: 'capitalize' }}>
                                    {request.manager_feedback_quote && request.manager_feedback_quote.length > 0
                                        ? request.manager_feedback_quote.map((feedback, index) => (
                                            <Typography variant='h6' key={index}>Feedback {index + 1}: {feedback}</Typography>
                                        ))
                                        : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell style={{ textTransform: 'capitalize' }}>
                                    {request.user_feedback_quote && request.user_feedback_quote.length > 0
                                        ? request.user_feedback_quote.map((feedback, index) => (
                                            <Typography variant='h6' key={index}>Feedback {index + 1}: {feedback}</Typography>
                                        ))
                                        : 'N/A'}
                                </CustomTableCell>
                                <CustomTableCell align="center">
                                    <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                        <Add fontSize="large" sx={{ color: '#b48c72' }} />
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

            {/* Detail Dialog */}
            <DetailDialog open={isDetailDialogOpen} onClose={() => setIsDetailDialogOpen(false)} request={selectedRequest} />

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <QuoteForm
                        initialValues={{ ...selectedRequest }}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
