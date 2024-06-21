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


export default function DesignStaffDashboard() {
    const [requests, setRequests] = useState([]);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests');
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

    const handleJewelryDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsJewelryDetailDialogOpen(true);
    };  

    const handleCloseAllDialogs = () => {
        setIsJewelryDetailDialogOpen(false);
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
                            <TableCell align='center'>Jewelry</TableCell>
                            <TableCell align='center'>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request, index) => (
                            request.request_status === 'accepted' && (
                                <TableRow key={index}>
                                    <TableCell>{request._id}</TableCell>
                                    <TableCell>{request.user_id ? request.user_id.email : 'User not found'}</TableCell>
                                    <TableCell>{request.request_description}</TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</TableCell>
                                    <TableCell>
                                        <CustomButton1 color="primary" onClick={() => handleJewelryDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </TableCell>
                                    <TableCell>
                                        <CustomButton1 onClick={() => handleAcceptRequest(request._id)}>Accept Request</CustomButton1>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <Dialog open={isJewelryDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle>Jewelry Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.jewelry_id && (
                        <>
                            <Typography marginBottom={'10px'}>Name: {selectedRequest.jewelry_id.name}</Typography>
                            <Typography marginBottom={'10px'}>Price: {selectedRequest.jewelry_id.price} VND</Typography>
                            {selectedRequest.jewelry_id.gemstone_id && (
                                <>
                                    <Typography marginBottom={'10px'}>Gemstone: {selectedRequest.jewelry_id.gemstone_id.name}</Typography>
                                    <Typography marginBottom={'10px'}>Gemstone Carat: {selectedRequest.jewelry_id.gemstone_id.carat}</Typography>
                                    <Typography marginBottom={'10px'}>Gemstone Shape: {selectedRequest.jewelry_id.gemstone_id.cut}</Typography>
                                    <Typography marginBottom={'10px'}>Gemstone Color: {selectedRequest.jewelry_id.gemstone_id.color}</Typography>
                                    <Typography marginBottom={'10px'}>Gemstone Clarity: {selectedRequest.jewelry_id.gemstone_id.clarity}</Typography>
                                </>
                            )}
                            <Typography marginBottom={'10px'}>Gemstone Weight: {selectedRequest.jewelry_id.gemstone_weight} kg</Typography>
                            {selectedRequest.jewelry_id.material_id && (
                                <>
                                    <Typography marginBottom={'10px'}>Materials: {selectedRequest.jewelry_id.material_id.name}</Typography>
                                    <Typography marginBottom={'10px'}>Material Carat: {selectedRequest.jewelry_id.material_id.carat}</Typography>
                                </>
                            )}
                            <Typography marginBottom={'10px'}>Material Weight: {selectedRequest.jewelry_id.material_weight} kg</Typography>
                            <Typography marginBottom={'10px'}>Category: {selectedRequest.jewelry_id.category}</Typography>
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
                    <Button onClick={handleCloseAllDialogs} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>

    )
}
