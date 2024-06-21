import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';

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
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests/staff-requests');
            setRequests(response.data);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };
    const handleAcceptRequest = async (requestId) => {
        try {
            await axiosInstance.post(`/works-on`, { request_id: requestId })

            await axiosInstance.patch(`/requests/${requestId}`, { request_status: 'accepted' })

            setError('');
            fetchRequests();
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
        }
    }
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
                            <TableCell>Jewelry_ID</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request, index) => (
                            request.request_status === 'pending' && (
                                <TableRow key={index}>
                                    <TableCell>{request._id}</TableCell>
                                    <TableCell>{request.user_id ? request.user_id.email : 'User not found'}</TableCell>
                                    <TableCell>{request.request_description}</TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>
                                        <CustomButton1 onClick={() => handleAcceptRequest(request._id)}>Accept Request</CustomButton1>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Container>

    )
}
