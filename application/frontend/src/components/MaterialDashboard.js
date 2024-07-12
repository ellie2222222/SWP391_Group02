import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import MaterialForm from './MaterialForm';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
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

export default function MaterialDashboard() {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));
    const [materials, setMaterials] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const handleEditClick = (material) => {
        setSelectedMaterial(material);
        setIsDialogOpen(true);
    };
    const handleAddClick = () => {
        setSelectedMaterial(null);
        setIsDialogOpen(true);
    };
    const fetchMaterials = async () => {
        try {
            const response = await axiosInstance.get('/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error("There was an error fetching the materials!", error);
        }
    };
    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/materials/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting jewelry:', error);
        }
    };
    const handleSubmit = async (values) => {
        try {
            if (selectedMaterial) {
                await axiosInstance.patch(`/materials/${selectedMaterial._id}`, values);
            } else {
                await axiosInstance.post('/materials', values);
            }
            fetchMaterials();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the jewelry!", error);
        }
    }
    useEffect(() => {
        fetchMaterials();
    }, []);

    return (
        <Container>
            <DrawerHeader />
            <CustomButton1 startIcon={<Add fontSize='large' />} variant="contained" color="primary" onClick={() => handleAddClick()}>
                <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>Add Material</Typography>
            </CustomButton1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Name</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Buy Price</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Sell Price</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold" }} align='center'>Action</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map(material => (
                            <TableRow key={material._id}>
                                <CustomTableCell align='center' sx={{ fontWeight: "bold" }}>{material.name}</CustomTableCell>
                                <CustomTableCell align='center'>{material.buy_price && material.buy_price.toLocaleString() + '₫'}</CustomTableCell>
                                <CustomTableCell align='center'>{material.sell_price && material.sell_price.toLocaleString() + '₫'}</CustomTableCell>
                                <CustomTableCell align='center'>
                                    <StyledIconButton onClick={() => handleEditClick(material)}>
                                        <Edit fontSize='large' />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={() => handleDeleteClick(material._id)}>
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
                    <MaterialForm initialValues={selectedMaterial || { name: '', buy_price: 0, sell_price: 0, carat: 0, cut: '', clarity: '', color: '' }} onSubmit={handleSubmit} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} sx={{ color: "#b48c72", fontSize: "1.3rem" }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>

    )
}