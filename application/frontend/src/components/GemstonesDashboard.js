import React, { useState, useEffect } from 'react';
import { Box, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import GemstoneForm from './GemstoneForm';

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
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));
    const [gemstones, setGemstones] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedGemstone, setSelectedGemstone] = useState(null);
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
        }
    };
    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/gemstones/${id}`);
            fetchGemstones();
        } catch (error) {
            console.error('Error deleting jewelry:', error);
        }
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
        } catch (error) {
            console.error("There was an error saving the jewelry!", error);
        }
    }
    useEffect(() => {
        fetchGemstones();
    }, []);
    return (
        <Container >
            <DrawerHeader />
            <CustomButton1 startIcon={<Add fontSize='large'/>} variant="contained" color="primary" onClick={() => handleAddClick()}>
                <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>Add Gemstones</Typography>
            </CustomButton1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Name</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Price</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Carat</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Cut</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Clarity</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: "bold"}}>Color</CustomTableCell>
                            <CustomTableCell  sx={{ fontWeight: "bold"}} align='center'>Action</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gemstones.map(gemstone => (
                            <TableRow key={gemstone._id}>
                                <CustomTableCell sx={{ fontWeight: "bold"}}>{gemstone.name}</CustomTableCell>
                                <CustomTableCell>{gemstone.price && gemstone.price.toLocaleString() + '₫'}</CustomTableCell>
                                <CustomTableCell>{gemstone.carat}</CustomTableCell>
                                <CustomTableCell>{gemstone.cut}</CustomTableCell>
                                <CustomTableCell>{gemstone.clarity}</CustomTableCell>
                                <CustomTableCell>{gemstone.color}</CustomTableCell>
                                <CustomTableCell align='center'>
                                    <StyledIconButton onClick={() => handleEditClick(gemstone)}>
                                        <Edit fontSize='large'/>
                                    </StyledIconButton>
                                    <StyledIconButton onClick={() => handleDeleteClick(gemstone._id)}>
                                        <Delete fontSize='large'/>
                                    </StyledIconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogContent>
                    <GemstoneForm initialValues={selectedGemstone || {name:'', price: 0, carat: 0, cut:'', clarity:'', color:'' }} onSubmit={handleSubmit}/>
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
