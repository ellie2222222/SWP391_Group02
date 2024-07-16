import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Grid, Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import DesignForm from './DesignForm';
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

export default function DesignStaffDashboard() {
    const [requests, setRequests] = useState([]);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [isUpdateDesignDialogOpen, setIsUpdateDesignDialogOpen] = useState(false);
    const [isRequestDetailDialogOpen, setIsRequestDetailDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests');
            setRequests(response.data.requests);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };

    const handleUpdateDesign = async (initialValues, values) => {
        try {
            await axiosInstance.patch(`/jewelries/${initialValues.jewelry_id._id}`, values);

            await axiosInstance.patch(`/requests/${initialValues._id}`, {
                request_status: values.request_status,
            });

            setIsUpdateDesignDialogOpen(false);
            toast.success('Design update successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            }); 
            fetchRequests();
        } catch (error) {
            console.error('Error while updating design', error);
            toast.error('Design update fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleJewelryDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsJewelryDetailDialogOpen(true);
    };

    const handleRequestDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsRequestDetailDialogOpen(true);
    };

    const handleUpdateDesignOpen = (request) => {
        setSelectedRequest(request);
        setIsUpdateDesignDialogOpen(true);
    };

    const handleJewelryDialogsClose = () => {
        setIsJewelryDetailDialogOpen(false);
    };

    const handleRequestDetailDialogsClose = () => {
        setIsRequestDetailDialogOpen(false);
    };

    const handleUpdateDesignDialogsClose = () => {
        setIsUpdateDesignDialogOpen(false);
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
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Jewelry</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request) => (
                            request.request_status === 'design' && (
                                <TableRow key={request._id}>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>{request._id}</CustomTableCell>
                                    <CustomTableCell>{request.user_id ? request.user_id.email : 'User not found'}</CustomTableCell>
                                    <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 color="primary" onClick={() => handleRequestDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 color="primary" onClick={() => handleJewelryDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 onClick={() => handleUpdateDesignOpen(request)}>Update Design</CustomButton1>
                                    </CustomTableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
            <Dialog open={isJewelryDetailDialogOpen} onClose={handleJewelryDialogsClose}>
                <DialogTitle sx={{ fontSize: '2rem', textAlign: 'center' }}>Jewelry Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.jewelry_id && (
                        <>
                            <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Name: {selectedRequest.jewelry_id.name}</Typography>
                            <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Price: {selectedRequest.jewelry_id.price} VND</Typography>
                            {selectedRequest.jewelry_id.gemstone_id && (
                                <>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone: {selectedRequest.jewelry_id.gemstone_id.name}</Typography>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone Carat: {selectedRequest.jewelry_id.gemstone_id.carat}</Typography>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone Shape: {selectedRequest.jewelry_id.gemstone_id.cut}</Typography>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone Color: {selectedRequest.jewelry_id.gemstone_id.color}</Typography>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone Clarity: {selectedRequest.jewelry_id.gemstone_id.clarity}</Typography>
                                </>
                            )}
                            <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Gemstone Weight: {selectedRequest.jewelry_id.gemstone_weight} kg</Typography>
                            {selectedRequest.jewelry_id.material_id && (
                                <>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Materials: {selectedRequest.jewelry_id.material_id.name}</Typography>
                                    <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Material Carat: {selectedRequest.jewelry_id.material_id.carat}</Typography>
                                </>
                            )}
                            <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Material Weight: {selectedRequest.jewelry_id.material_weight} kg</Typography>
                            <Typography sx={{ fontSize: '1.3rem' }} mb={1}>Category: {selectedRequest.jewelry_id.category}</Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {selectedRequest.jewelry_id.images.map((image, index) => (
                                    <Grid item xs={4} sm={4} md={4} key={index}>
                                        <CardMedia
                                            key={index}
                                            component="img"
                                            alt="Jewelry"
                                            image={image}
                                            sx={{ margin: '5px' }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleJewelryDialogsClose} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isRequestDetailDialogOpen} onClose={handleRequestDetailDialogsClose}>
                <DialogTitle sx={{ fontSize: '2rem', textAlign: 'center' }}>Request Detail</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: '1.3rem' }}>Description: {selectedRequest.request_description}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRequestDetailDialogsClose} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isUpdateDesignDialogOpen} onClose={handleUpdateDesignDialogsClose}>
                <DialogContent>
                    <DesignForm
                        initialValues={selectedRequest}
                        onSubmit={handleUpdateDesign}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleUpdateDesignDialogsClose} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
}
