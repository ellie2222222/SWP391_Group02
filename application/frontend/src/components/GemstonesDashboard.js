import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import GemstoneForm from './GemstoneForm';
import { toast, ToastContainer } from 'react-toastify';

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

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
});

export default function GemstonesDashboard() {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const [gemstones, setGemstones] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selectedGemstone, setSelectedGemstone] = useState(null);
    const [gemstoneToDelete, setGemstoneToDelete] = useState(null);

    const handleEditClick = (gemstone) => {
        setSelectedGemstone(gemstone);
        setIsDialogOpen(true);
    };

    const handleAddClick = () => {
        setSelectedGemstone(null);
        setIsDialogOpen(true);
    };

    const fetchGemstones = async () => {
        try {
            const response = await axiosInstance.get('/gemstones');
            setGemstones(response.data);
        } catch (error) {
            console.error("There was an error fetching the gemstones!", error);
            toast.error('Fetch gemstone fail', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleDeleteClick = (gemstone) => {
        setGemstoneToDelete(gemstone);
        setIsConfirmDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await axiosInstance.delete(`/gemstones/${gemstoneToDelete._id}`);
            fetchGemstones();
            toast.success('Delete gemstone successfully', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error deleting gemstone:', error);
            toast.error('Delete gemstone fail', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        } finally {
            setIsConfirmDialogOpen(false);
            setGemstoneToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setIsConfirmDialogOpen(false);
        setGemstoneToDelete(null);
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedGemstone) {
                await axiosInstance.patch(`/gemstones/${selectedGemstone._id}`, values);
            } else {
                await axiosInstance.post('/gemstones', values);
            }
            fetchGemstones();
            setIsDialogOpen(false);
            toast.success('Save gemstone successfully', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        } catch (error) {
            console.error("There was an error saving the gemstone!", error);
            toast.error('Save gemstone fail', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    useEffect(() => {
        fetchGemstones();
    }, []);

    return (
        <Container>
            <DrawerHeader />
            <CustomButton1 startIcon={<Add fontSize='large' />} variant="contained" color="primary" onClick={handleAddClick}>
                <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>Add Gemstone</Typography>
            </CustomButton1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Name</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Price</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Carat</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Cut</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Clarity</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>Color</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Action</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gemstones.map(gemstone => (
                            <TableRow key={gemstone._id}>
                                <CustomTableCell sx={{ fontWeight: "bold" }}>{gemstone.name}</CustomTableCell>
                                <CustomTableCell>{gemstone.price && gemstone.price.toLocaleString() + '₫'}</CustomTableCell>
                                <CustomTableCell>{gemstone.carat}</CustomTableCell>
                                <CustomTableCell>{gemstone.cut}</CustomTableCell>
                                <CustomTableCell>{gemstone.clarity}</CustomTableCell>
                                <CustomTableCell>{gemstone.color}</CustomTableCell>
                                <CustomTableCell align='center'>
                                    <StyledIconButton onClick={() => handleEditClick(gemstone)}>
                                        <Edit fontSize='large' />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={() => handleDeleteClick(gemstone)}>
                                        <Delete fontSize='large' />
                                    </StyledIconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <GemstoneForm initialValues={selectedGemstone || { name: '', price: 0, carat: 0, cut: '', clarity: '', color: '' }} onSubmit={handleSubmit} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isConfirmDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle align='center' variant='h4'>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography sx={{ fontSize: '1.3rem' }}>Are you sure you want to delete this gemstone?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Container>
    );
}
