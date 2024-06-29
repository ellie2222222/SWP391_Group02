import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import JewelryForm from './JewelryForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    marginTop: '20px',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AdminContent = () => {
    const [jewelries, setJewelries] = useState([]);
    const [selectedJewelry, setSelectedJewelry] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchJewelries = async () => {
        try {
            const response = await axiosInstance.get('/jewelries');
            setJewelries(response.data);
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
            await axiosInstance.delete(`/jewelries/${id}`);
            fetchJewelries();
            toast.success('Jewelry item deleted successfully');
        } catch (error) {
            console.error("There was an error deleting the jewelry!", error);
            toast.error('Failed to delete jewelry item');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedJewelry) {
                await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values);
                toast.success('Jewelry item updated successfully');
            } else {
                await axiosInstance.post('/jewelries', values);
                toast.success('Jewelry item added successfully');
            }
            fetchJewelries();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the jewelry!", error);
            toast.error(error.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        fetchJewelries();
    }, []);

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={handleAddClick}>
                    Add Jewelry
                </CustomButton1>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Images</TableCell>
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {jewelries.map((jewelry) => (
                                <TableRow key={jewelry._id}>
                                    <TableCell>{jewelry.name}</TableCell>
                                    <TableCell>{jewelry.description}</TableCell>
                                    <TableCell>{jewelry.price}</TableCell>
                                    <TableCell>
                                        {jewelry.images[0] && (
                                            <CardMedia
                                                component="img"
                                                alt="Jewelry"
                                                image={jewelry.images[0]}
                                                sx={{ width: '50%', maxHeight: '200px', margin: '0px' }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <StyledIconButton onClick={() => handleEditClick(jewelry)}>
                                            <Edit />
                                        </StyledIconButton>
                                        <StyledIconButton onClick={() => handleDeleteClick(jewelry._id)}>
                                            <Delete />
                                        </StyledIconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogTitle>{selectedJewelry ? 'Edit Jewelry' : 'Add Jewelry'}</DialogTitle>
                    <DialogContent>
                        <JewelryForm initialValues={selectedJewelry || { name: '', description: '', price: 0, gemstone_id: '', gemstone_weight: 0, material_id: '', material_weight: 0, category: '', type: '', on_sale: false, sale_percentage: 0, images: [], available: false }} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <ToastContainer />
        </Box>
    );
};

export default AdminContent;
