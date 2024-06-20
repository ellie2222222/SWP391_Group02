import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import RequestForm from './RequestForm';
import useAuth from '../hooks/useAuthContext'

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
    const [isQuoteDetailDialogOpen, setIsQuoteDetailDialogOpen] = useState(false);
    const [isProductionDetailDialogOpen, setIsProductionDetailDialogOpen] = useState(false);
    const { user } = useAuth()

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests/staff-requests');
            setRequests(response.data);
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };

    const handleEditClick = (request) => {
        setSelectedRequest(request);
        setIsEditDialogOpen(true);
    };

    const handleQuoteDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsQuoteDetailDialogOpen(true);
    };

    const handleProductionDetailOpen = (request) => {
        setSelectedRequest(request);
        setIsProductionDetailDialogOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedRequest) {
                await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            }

            fetchRequests();
            handleCloseAllDialogs();
        } catch (error) {
            console.error("There was an error saving the request!", error);
        }
    };

    const handleCloseAllDialogs = () => {
        setIsEditDialogOpen(false);
        setIsQuoteDetailDialogOpen(false);
        setIsProductionDetailDialogOpen(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Request ID</TableCell>
                                <TableCell>Sender</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Request Status</TableCell>
                                <TableCell align="center">Quote</TableCell>
                                <TableCell>Design</TableCell>
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
                                        <CustomButton1 color="primary" onClick={() => handleQuoteDetailOpen(request)}>
                                            Detail
                                        </CustomButton1>
                                    </TableCell>
                                    <TableCell>{request.design_status ? request.design_status : 'N/A'}</TableCell>
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
                        <RequestForm initialValues={selectedRequest} role={user.role} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAllDialogs} color="primary">
                            Cancel
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
                <Dialog open={isProductionDetailDialogOpen} onClose={handleCloseAllDialogs}>
                    <DialogTitle>Production Detail</DialogTitle>
                    <DialogContent>
                        <Typography>Production Start Date: {(selectedRequest && selectedRequest.production_start_date) ? selectedRequest.production_start_date : 'N/A'}</Typography>
                        <Typography>Production End Date: {(selectedRequest && selectedRequest.production_end_date) ? selectedRequest.production_end_date : 'N/A'}</Typography>
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
        </Box>
    );
};

export default RequestDashboardContent;

