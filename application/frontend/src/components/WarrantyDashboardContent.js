import React, { useState, useEffect } from 'react';
import { Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import WarrantyForm from './WarrantyForm';
import { Grid, Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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

export default function WarrantyDashboardContent() {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const [requests, setRequests] = useState([]);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [isWarrantyDialogOpen, setIsWarrantyDialogOpen] = useState(false);
    const [isRequestDetailDialogOpen, setIsRequestDetailDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests');
            setRequests(response.data.requests);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };

    const handleWarrantyRequest = async (values) => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            setIsWarrantyDialogOpen(false);
            toast.success('Update warranty successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            fetchRequests();
        } catch (error) {
            console.error('Error while updating warranty' ,error)
            toast.success('Update warranty fail', {
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

    const handleWarrantyOpen = (request) => {
        setSelectedRequest(request);
        setIsWarrantyDialogOpen(true);
    };

    const handleRequestDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsRequestDetailDialogOpen(true);
    };

    const handleCloseAllDialogs = () => {
        setIsJewelryDetailDialogOpen(false);
        setIsRequestDetailDialogOpen(false);
    };

    const handleCloseWarranty = () => {
        setIsWarrantyDialogOpen(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const getTimestamp = (request) => {
        const status = request.status_history.find(history => history.status === 'warranty');
        return status ? new Date(status.timestamp).toLocaleDateString() : 'N/A';
    }

    return (
        <Container>
            <DrawerHeader/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request ID</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Sender</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Request Status</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }}>Status Update Date</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Description</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Jewelry</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {requests.map((request, index) => (
                            request.request_status === 'warranty' && (
                                <TableRow key={index}>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>{request._id}</CustomTableCell>
                                    <CustomTableCell>{request.user_id ? request.user_id.email : 'User not found'}</CustomTableCell>
                                    <CustomTableCell style={{ textTransform: 'capitalize' }}>{request.request_status}</CustomTableCell>
                                    <CustomTableCell>
                                        {getTimestamp(request)}
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 color="primary" onClick={() => handleJewelryDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 color="primary" onClick={() => handleRequestDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </CustomTableCell>
                                    <CustomTableCell>
                                        <CustomButton1 onClick={() => handleWarrantyOpen(request)}>Update Warranty</CustomButton1>
                                    </CustomTableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isJewelryDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle sx={{ fontSize: '2rem' }} align='center'>Jewelry Detail</DialogTitle>
                <DialogContent>
                    {selectedRequest && selectedRequest.jewelry_id && (
                        <>
                            <Typography mb={1} sx={{fontSize: '1.3rem'}}>Name: {selectedRequest.jewelry_id.name}</Typography>
                            <Typography mb={1} sx={{fontSize: '1.3rem'}}>Price: {selectedRequest.jewelry_id.price} VND</Typography>
                            {selectedRequest.jewelry_id.gemstone_id && (
                                <>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone: {selectedRequest.jewelry_id.gemstone_id.name}</Typography>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone Carat: {selectedRequest.jewelry_id.gemstone_id.carat}</Typography>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone Shape: {selectedRequest.jewelry_id.gemstone_id.cut}</Typography>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone Color: {selectedRequest.jewelry_id.gemstone_id.color}</Typography>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone Clarity: {selectedRequest.jewelry_id.gemstone_id.clarity}</Typography>
                                </>
                            )}
                            <Typography mb={1} sx={{fontSize: '1.3rem'}}>Gemstone Weight: {selectedRequest.jewelry_id.gemstone_weight} kg</Typography>
                            {selectedRequest.jewelry_id.material_id && (
                                <>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Materials: {selectedRequest.jewelry_id.material_id.name}</Typography>
                                    <Typography mb={1} sx={{fontSize: '1.3rem'}}>Material Carat: {selectedRequest.jewelry_id.material_id.carat}</Typography>
                                </>
                            )}
                            <Typography mb={1} sx={{fontSize: '1.3rem'}}>Material Weight: {selectedRequest.jewelry_id.material_weight} kg</Typography>
                            <Typography mb={1} sx={{fontSize: '1.3rem'}}>Category: {selectedRequest.jewelry_id.category}</Typography>
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
                    <Button onClick={handleCloseAllDialogs} sx={{fontSize: '1.3rem', color: '#b48c72'}}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isRequestDetailDialogOpen} onClose={handleCloseAllDialogs}>
                <DialogTitle sx={{ fontSize: '2rem' }} align='center'>Request Description</DialogTitle>
                <DialogContent>
                    {selectedRequest && (
                        <Typography sx={{ fontSize: '1.3rem' }}>{selectedRequest.request_description}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAllDialogs} sx={{fontSize: '1.3rem', color: '#b48c72'}}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isWarrantyDialogOpen} onClose={handleCloseWarranty}>
                <DialogContent>
                    <WarrantyForm initialValues={selectedRequest} onSubmit={handleWarrantyRequest}></WarrantyForm>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWarranty} sx={{fontSize: '1.3rem', color: '#b48c72'}}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Container>
    );
}
