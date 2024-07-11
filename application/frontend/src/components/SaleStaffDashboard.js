import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import QuoteForm from './QuoteForm'

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72', // Thay đổi màu chữ khi hover
        backgroundColor: 'transparent',
    },
});


export default function SaleStaffDashboard() {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, values)
            setIsDialogOpen(false);
            fetchRequests();
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
        }
    }
    const handleEditClick = (request) => {
        setIsDialogOpen(true);
        setSelectedRequest(request)
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
                            <TableCell>Request ID</TableCell>
                            <TableCell>Sender</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Request Status</TableCell>
                            <TableCell>Create Quote</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request, index) => (
                            (request.request_status === 'pending' || request.request_status === 'rejected_quote') && (
                                <TableRow key={index}>
                                    <TableCell>{request._id}</TableCell>
                                    <TableCell>{request.user_id ? request.user_id.email : 'User not found'}</TableCell>
                                    <TableCell>{request.request_description}</TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                            <Add sx={{ color: '#b48c72' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Quote</DialogTitle>
                <DialogContent>
                    <QuoteForm
                        initialValues={{
                            ...selectedRequest,
                        }}
                        onSubmit={handleSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>

    )
}
