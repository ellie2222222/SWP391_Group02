import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import RequestForm from './RequestForm';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginTop: '20px',
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

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/requests/staff-requests');
            setRequests(response.data);
            console.log(response.data)
        } catch (error) {
            console.error("There was an error fetching the requests!", error);
        }
    };

    const handleEditClick = (jewelry) => {
        setSelectedRequest(jewelry);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedRequest) {
                await axiosInstance.patch(`/requests/${selectedRequest._id}`, values);
            }

            fetchRequests();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the request!", error);
        }
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
                                <TableCell>Sender</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Request Status</TableCell>
                                <TableCell>Quote</TableCell>
                                <TableCell>Design</TableCell>
                                <TableCell>Production</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.user_id}>
                                    <TableCell>{request.user_id ? request.user_id.email : 'User not found'}</TableCell>
                                    <TableCell>{request.request_description}</TableCell>
                                    <TableCell>{request.request_status}</TableCell>
                                    <TableCell>{request.quote_status ? request.quote_status : 'N/A'}</TableCell>
                                    <TableCell>{request.design_status ? request.design_status : 'N/A'}</TableCell>
                                    <TableCell>{request.production_status ? request.production_status : 'N/A'}</TableCell>
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
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>Edit Request</DialogTitle>
                    <DialogContent>
                        <RequestForm initialValues={selectedRequest} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default RequestDashboardContent;

