import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import JewelryForm from './JewelryForm';
import UserForm from './UserForm';

const UserDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const CustomEditIcon = styled(Edit)({
        color: '#b48c72',
        '&:hover': {
            color: '#a57d65',
        },
    });

    const CustomDeleteIcon = styled(Delete)({
        color: '#b48c72',
        '&:hover': {
            color: '#a57d65',
        },
    });

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users');
            setUsers(response.data.users);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
        }
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            fetchUsers();
        } catch (error) {
            console.error("There was an error deleting the user!", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            await axiosInstance.patch(`/users/role-assignment/${selectedUser._id}`, values);
            fetchUsers();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the user!", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.phone_number}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.address}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell align='center'>
                                        <IconButton color="primary" onClick={() => handleEditClick(user)}>
                                            <CustomEditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDeleteClick(user._id)}>
                                            <CustomDeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogContent>
                        <UserForm initialValues={selectedUser} onSubmit={handleSubmit} />
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

export default UserDashboardContent;
