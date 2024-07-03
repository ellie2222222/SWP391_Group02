import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import MateriaForm from './MateriaForm';
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
        <DrawerHeader/>
        <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={() => handleAddClick()}>
                Add Material
        </CustomButton1>
        <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Buy Price</TableCell>
                            <TableCell>Sell Price</TableCell>
                            <TableCell>Carat</TableCell>
                            <TableCell align='center'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map(material => (
                            <TableRow key={material._id}>
                                <TableCell>{material.name}</TableCell>
                                <TableCell>{material.buy_price}</TableCell>
                                <TableCell>{material.sell_price}</TableCell>
                                <TableCell>{material.carat}</TableCell>
                                <TableCell align='center'>
                                    <StyledIconButton onClick={() => handleEditClick(material)}>
                                        <Edit />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={() => handleDeleteClick(material._id)}>
                                        <Delete />
                                    </StyledIconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>{selectedMaterial ? 'Edit Material' : 'Add Material'}</DialogTitle>
                <DialogContent>
                    <MateriaForm initialValues={selectedMaterial || {name:'', buy_price: 0, sell_price: 0, carat: 0, cut:'', clarity:'', color:'' }} onSubmit={handleSubmit}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
    </Container>
   
  )
}
