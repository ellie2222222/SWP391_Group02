import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Stack, Pagination } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchRequests = async (page = 1) => {
        try {
            const response = await axiosInstance.get('/requests?request_status=quote', { params: { page } });
            
            setRequests(response.data.requests);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };

    const handleAcceptRequest = async () => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequestId}`, { request_status: 'accepted' });
            setError('');
            fetchRequests(page);
            handleCloseDialog();
            toast.success('Quote approved successfully!');
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
            toast.error('Failed to approve the quote.');
        }
    };

    const handleOpenDialog = (requestId) => {
        setSelectedRequestId(requestId);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedRequestId(null);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        fetchRequests(value);
    };

    useEffect(() => {
        fetchRequests(page);
    }, [page]);

    return (
        <Container>
            <DrawerHeader />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Request ID</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Quote Content</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Quote Amount</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Request Status</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request) => (
                            <TableRow key={request._id}>
                                <CustomTableCell sx={{ fontWeight: "bold"}}>{request._id}</CustomTableCell>
                                <CustomTableCell>{request.quote_content}</CustomTableCell>
                                <CustomTableCell>{request.quote_amount}</CustomTableCell>
                                <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                <CustomTableCell>
                                    <CustomButton1 onClick={() => handleOpenDialog(request._id)}>Approve Quote</CustomButton1>
                                </CustomTableCell>
                            </TableRow>
                        ))}
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
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle align='center'>Confirm Approval</DialogTitle>
                <DialogContent>
                    <Typography variant='p' sx={{fontSize: "1.3rem"}}>Are you sure you want to approve this quote?</Typography>
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
            <ToastContainer />
        </Container>
    );    
}
