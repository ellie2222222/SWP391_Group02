import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, styled } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
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

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
});

const CustomFormControl = styled(FormControl)({
    minWidth: 130,
    "& .MuiInputLabel-root": {
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiOutlinedInput-root": {
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
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

const CustomTextField = styled(TextField)({
    width: '100%',
    variant: "outlined",
    padding: "0",
    "& .MuiOutlinedInput-root": {
        fontSize: '1.3rem',
        "&:hover fieldset": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#b48c72",
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
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
    const [search, setSearch] = useState('');
    const [cut, setCut] = useState('');
    const [clarity, setClarity] = useState('');
    const [color, setColor] = useState('');
    const [polish, setPolish] = useState('');
    const [symmetry, setSymmetry] = useState('');
    const [fluorescence, setFluorescence] = useState('');

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
            const response = await axiosInstance.get(`/gemstones?search=${search}&cut=${cut}&clarity=${clarity}&color=${color}&polish=${polish}&symmetry=${symmetry}&fluorescence=${fluorescence}`);
            setGemstones(response.data);
        } catch (error) {
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
            toast.error('Save gemstone fail', {
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleSearchClick = () => {
        fetchGemstones();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    useEffect(() => {
        fetchGemstones();
    }, [cut, clarity, color, polish, symmetry, fluorescence]);

    return (
        <Container>
            <DrawerHeader />
            <Box mb={2}>
                <CustomTextField
                    size="normal"
                    label="Search by name"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    onKeyDown={handleKeyDown}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <StyledIconButton color="inherit" onClick={handleSearchClick}>
                                    <Search fontSize="large" />
                                </StyledIconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box display="flex" mb={2}>
                <CustomFormControl variant="outlined">
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Cut</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={cut}
                        onChange={(event) => setCut(event.target.value)}
                        label="Cut"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="Princess">Princess</CustomMenuItem>
                        <CustomMenuItem value="Round">Round</CustomMenuItem>
                        <CustomMenuItem value="Emerald">Emerald</CustomMenuItem>
                        <CustomMenuItem value="Asscher">Asscher</CustomMenuItem>
                        <CustomMenuItem value="Marquise">Marquise</CustomMenuItem>
                        <CustomMenuItem value="Oval">Oval</CustomMenuItem>
                        <CustomMenuItem value="Radiant">Radiant</CustomMenuItem>
                        <CustomMenuItem value="Pear">Pear</CustomMenuItem>
                        <CustomMenuItem value="Heart">Heart</CustomMenuItem>
                        <CustomMenuItem value="Cushion">Cushion</CustomMenuItem>
                        <CustomMenuItem value="Other">Other</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Clarity</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={clarity}
                        onChange={(event) => setClarity(event.target.value)}
                        label="Clarity"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="FL">FL</CustomMenuItem>
                        <CustomMenuItem value="IF">IF</CustomMenuItem>
                        <CustomMenuItem value="VVS1">VVS1</CustomMenuItem>
                        <CustomMenuItem value="VVS2">VVS2</CustomMenuItem>
                        <CustomMenuItem value="VS1">VS1</CustomMenuItem>
                        <CustomMenuItem value="VS2">VS2</CustomMenuItem>
                        <CustomMenuItem value="SI1">SI1</CustomMenuItem>
                        <CustomMenuItem value="SI2">SI2</CustomMenuItem>
                        <CustomMenuItem value="I1">I1</CustomMenuItem>
                        <CustomMenuItem value="I2">I2</CustomMenuItem>
                        <CustomMenuItem value="I3">I3</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Color</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                        label="Color"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="Colorless">Colorless</CustomMenuItem>
                        <CustomMenuItem value="Near Colorless">Near Colorless</CustomMenuItem>
                        <CustomMenuItem value="Faint Yellow">Faint Yellow</CustomMenuItem>
                        <CustomMenuItem value="Very Light Yellow">Very Light Yellow</CustomMenuItem>
                        <CustomMenuItem value="Light Yellow">Light Yellow</CustomMenuItem>
                        <CustomMenuItem value="Red">Red</CustomMenuItem>
                        <CustomMenuItem value="Orange">Orange</CustomMenuItem>
                        <CustomMenuItem value="Green">Green</CustomMenuItem>
                        <CustomMenuItem value="Blue">Blue</CustomMenuItem>
                        <CustomMenuItem value="Yellow">Yellow</CustomMenuItem>
                        <CustomMenuItem value="Purple">Purple</CustomMenuItem>
                        <CustomMenuItem value="Pink">Pink</CustomMenuItem>
                        <CustomMenuItem value="Brown">Brown</CustomMenuItem>
                        <CustomMenuItem value="Black">Black</CustomMenuItem>
                        <CustomMenuItem value="White">White</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Polish</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={polish}
                        onChange={(event) => setPolish(event.target.value)}
                        label="Polish"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="Excellent">Excellent</CustomMenuItem>
                        <CustomMenuItem value="Very Good">Very Good</CustomMenuItem>
                        <CustomMenuItem value="Good">Good</CustomMenuItem>
                        <CustomMenuItem value="Fair">Fair</CustomMenuItem>
                        <CustomMenuItem value="Poor">Poor</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Symmetry</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={symmetry}
                        onChange={(event) => setSymmetry(event.target.value)}
                        label="Symmetry"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="Excellent">Excellent</CustomMenuItem>
                        <CustomMenuItem value="Very Good">Very Good</CustomMenuItem>
                        <CustomMenuItem value="Good">Good</CustomMenuItem>
                        <CustomMenuItem value="Fair">Fair</CustomMenuItem>
                        <CustomMenuItem value="Poor">Poor</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Fluorescence</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={fluorescence}
                        onChange={(event) => setFluorescence(event.target.value)}
                        label="Fluorescence"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="None">None</CustomMenuItem>
                        <CustomMenuItem value="Faint">Faint</CustomMenuItem>
                        <CustomMenuItem value="Medium">Medium</CustomMenuItem>
                        <CustomMenuItem value="Strong">Strong</CustomMenuItem>
                        <CustomMenuItem value="Very Strong">Very Strong</CustomMenuItem>
                    </Select>
                </CustomFormControl>
            </Box>
            <CustomButton1 startIcon={<Add fontSize='large' />} variant="contained" color="primary" onClick={handleAddClick}>
                <Typography sx={{ fontSize: "1.3rem", fontWeight: "bold" }}>Add Gemstone</Typography>
            </CustomButton1> 
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: "bold" }}>ID</CustomTableCell>
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
                                <CustomTableCell sx={{ fontWeight: "bold" }}>{gemstone._id}</CustomTableCell>
                                <CustomTableCell>{gemstone.name}</CustomTableCell>
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


