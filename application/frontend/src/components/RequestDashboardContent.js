import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import RequestForm from './RequestForm';
import useAuth from '../hooks/useAuthContext'
import SaleStaffDashboard from './SaleStaffDashboard';
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

const RequestDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isJewelryDetailDialogOpen, setIsJewelryDetailDialogOpen] = useState(false);
    const [isQuoteDetailDialogOpen, setIsQuoteDetailDialogOpen] = useState(false);
    const [isDesignDetailDialogOpen, setIsDesignDetailDialogOpen] = useState(false);
    const [isProductionDetailDialogOpen, setIsProductionDetailDialogOpen] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { user } = useAuth()

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests/staff-requests'); 
            setError('')
            setRequests(response.data);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error)
        }
    };

    const handleEditClick = (request) => {
        setMessage('')
        setSelectedRequest(request);
        setIsEditDialogOpen(true);
    };

    const handleJewelryDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsJewelryDetailDialogOpen(true);
    };


    const handleQuoteDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsQuoteDetailDialogOpen(true);
    };

    const handleDesignDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsDesignDetailDialogOpen(true);
    };

    const handleProductionDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsProductionDetailDialogOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            let response
            if (selectedRequest) {
                response = await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            }
            setError('')
            setMessage(response.data.message)
            fetchRequests();
            // handleCloseAllDialogs();
        } catch (error) {
            console.error("There was an error saving the request!", error);
            setMessage('')
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error)
        }
    };

    const handleCloseAllDialogs = () => {
        setIsEditDialogOpen(false);
        setIsJewelryDetailDialogOpen(false);
        setIsQuoteDetailDialogOpen(false);
        setIsDesignDetailDialogOpen(false);
        setIsProductionDetailDialogOpen(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            {user.role === 'manager' &&(
                <Container>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Request ID</TableCell>
                                <TableCell>Sender</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Request Status</TableCell>
                                <TableCell align="center">Jewelry</TableCell>
                                <TableCell align="center">Quote</TableCell>
                                <TableCell align="center">Design</TableCell>
                                <TableCell align="center">Production</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request, index) => (
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
                                        <CustomButton1 color="primary" onClick={() => handleQuoteDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </TableCell>
                                    <TableCell>
                                        <CustomButton1 color="primary" onClick={() => handleDesignDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </TableCell>
                                    <TableCell>
                                        <CustomButton1 color="primary" onClick={() => handleProductionDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditClick(request)}>
                                            <Edit />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={isEditDialogOpen} onClose={handleCloseAllDialogs}>
                    <DialogContent>
                        <RequestForm initialValues={selectedRequest} role={user.role} error={error} message={message} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isJewelryDetailDialogOpen} onClose={handleCloseAllDialogs} fullWidth={'300px'}>
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
                <Dialog open={isQuoteDetailDialogOpen} onClose={handleCloseAllDialogs}>
                    <DialogTitle>Quote Detail</DialogTitle>
                    <DialogContent>
                        <Typography>Quote Amount: {(selectedRequest && selectedRequest.quote_amount) ? selectedRequest.quote_amount : 'N/A'}</Typography>
                        <Typography>Quote Content: {(selectedRequest && selectedRequest.quote_content) ? selectedRequest.quote_content : 'N/A'}</Typography>
                        <Typography>Quote Status: {(selectedRequest && selectedRequest.quote_status) ? selectedRequest.quote_status : 'N/A'}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isDesignDetailDialogOpen} onClose={handleCloseAllDialogs}>
                    <DialogTitle>Design Detail</DialogTitle>
                    <DialogContent>
                        {selectedRequest && selectedRequest.design_status === 'ongoing' && (
                            <CustomButton1 color="primary" onClick={() => {}}>
                                Add Design
                            </CustomButton1>
                        )}
                        <Typography>Design Status: {(selectedRequest && selectedRequest.design_status) ? selectedRequest.design_status : 'N/A'}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isProductionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                    <DialogTitle>Production Detail</DialogTitle>
                    <DialogContent>
                        <Typography>Production Start Date: {(selectedRequest && selectedRequest.production_start_date) ? new Date(selectedRequest.production_start_date).toLocaleDateString() : 'N/A'}</Typography>
                        <Typography>Production End Date: {(selectedRequest && selectedRequest.production_end_date) ? new Date(selectedRequest.production_end_date).toLocaleDateString() : 'N/A'}</Typography>
                        <Typography>Production Cost: {(selectedRequest && selectedRequest.production_cost) ? selectedRequest.production_cost : 'N/A'}</Typography>
                        <Typography>Production Status: {(selectedRequest && selectedRequest.production_status) ? selectedRequest.production_status : 'N/A'}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            )}
            {user.role == 'sale_staff' && (
                <SaleStaffDashboard></SaleStaffDashboard>
            )}
        </Box>
    );
};

export default RequestDashboardContent;

