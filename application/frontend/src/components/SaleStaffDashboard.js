import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import QuoteForm from './QuoteForm';
import { toast, ToastContainer } from 'react-toastify';
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
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests');
            setRequests(response.data.requests);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
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
            console.error("There was an error saving the request!", error);
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
    
    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <Container>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request ID</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Sender</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request Status</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Description</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {requests.map((request, index) => (
                            (request.request_status === 'pending' || request.request_status === 'rejected_quote') && (
                                <TableRow key={index}>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>{request._id}</CustomTableCell>
                                    <CustomTableCell>{request.user_id ? request.user_id.email : 'User not found'}</CustomTableCell>
                                    <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                    <CustomTableCell onClick={() => handleDetailClick(request)}>
                                        <CustomButton1>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                            <Add fontSize="large" sx={{ color: '#b48c72' }} />
                                        </IconButton>
                                    </CustomTableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
            <ToastContainer />
        </Container>
    );
}
