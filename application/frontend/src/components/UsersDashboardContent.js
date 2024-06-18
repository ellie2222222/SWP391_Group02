import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import JewelryForm from './JewelryForm';

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

const UserDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const [users, setUsers] = useState([]);
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchJewelries = async () => {
        try {
            const response = await axiosInstance.get('/users');
            setUsers(response.data.users);

        } catch (error) {
            console.error("There was an error fetching the jewelries!", error);
        }
    };

    const handleAddClick = () => {
        setSelectedJewelry(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (jewelry) => {
        setSelectedJewelry(jewelry);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            fetchJewelries();
        } catch (error) {
            console.error("There was an error deleting the jewelry!", error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedJewelry) {
                await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values);
            } else {
                await axiosInstance.post('/jewelries', values);
            }
            fetchJewelries();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the jewelry!", error);
        }
    };

    useEffect(() => {
        fetchJewelries();
    }, []);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={handleAddClick} sx={{backgroundColor:'#b48c72'}}>
                    Add Jewelry
                </CustomButton1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Password</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                     <TableCell>
                                        {user._id}
                                    </TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.password}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                   
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditClick(user)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleDeleteClick(user._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>{selectedJewelry ? 'Edit Jewelry' : 'Add Jewelry'}</DialogTitle>
                    <DialogContent>
                        <JewelryForm initialValues={selectedJewelry || { name: '', description: '', price: 0, gemstone_id: '', gemstone_weight: 0, material_id: '', material_weight: 0, category: '', type: '', on_sale: false, sale_percentage: 0, images: [] }} onSubmit={handleSubmit} />
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
