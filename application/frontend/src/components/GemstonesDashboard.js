import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, styled } from '@mui/material';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import GemstoneForm from './GemstoneForm';
import axiosInstance from '../utils/axiosInstance';
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
    const [searchParams, setSearchParams] = useSearchParams();

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
            const params = Object.fromEntries([...searchParams]);
            const response = await axiosInstance.get('/gemstones', { params });
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

    const handleFilterChange = (name, value) => {
        setSearchParams(prevParams => {
            const newParams = new URLSearchParams(prevParams);
            if (value) {
                newParams.set(name, value);
            } else {
                newParams.delete(name);
            }
            return newParams;
        });
    };

    useEffect(() => {
        fetchGemstones();
    }, [searchParams]);

    return (
        <Container>
            <DrawerHeader />
            <Box mb={2}>
                <CustomTextField
                    size="normal"
                    label="Search by name"
                    value={searchParams.get('search') || ''}
                    onChange={(event) => handleFilterChange('search', event.target.value)}
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
                        value={searchParams.get('cut') || ''}
                        onChange={(event) => handleFilterChange('cut', event.target.value)}
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
                        value={searchParams.get('clarity') || ''}
                        onChange={(event) => handleFilterChange('clarity', event.target.value)}
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
                        <CustomMenuItem value="Other">Other</CustomMenuItem>
                    </Select>
                </CustomFormControl>
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Color</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={searchParams.get('color') || ''}
                        onChange={(event) => handleFilterChange('color', event.target.value)}
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
                        value={searchParams.get('polish') || ''}
                        onChange={(event) => handleFilterChange('polish', event.target.value)}
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
                        value={searchParams.get('symmetry') || ''}
                        onChange={(event) => handleFilterChange('symmetry', event.target.value)}
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
                        value={searchParams.get('fluorescence') || ''}
                        onChange={(event) => handleFilterChange('fluorescence', event.target.value)}
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
                <CustomFormControl variant="outlined" sx={{ marginLeft: 2 }}>
                    <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Available</InputLabel>
                    <Select
                        sx={{ fontSize: "1.3rem" }}
                        value={searchParams.get('available') || ''}
                        onChange={(event) => handleFilterChange('available', event.target.value)}
                        label="Available"
                    >
                        <CustomMenuItem value=''>All</CustomMenuItem>
                        <CustomMenuItem value="true">Yes</CustomMenuItem>
                        <CustomMenuItem value="false">No</CustomMenuItem>
                    </Select>
                </CustomFormControl>
            </Box>
            <Box mb={2}>
                <CustomButton1 variant="outlined" startIcon={<Add />} onClick={handleAddClick}>
                    Add Gemstone
                </CustomButton1>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Name</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Cut</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Clarity</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Color</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Carat</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Polish</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Symmetry</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Fluorescence</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Price</CustomTableCell>
                            <CustomTableCell sx={{ fontWeight: 900 }}>Actions</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gemstones.map((gemstone) => (
                            <TableRow key={gemstone._id}>
                                <CustomTableCell>{gemstone.name}</CustomTableCell>
                                <CustomTableCell>{gemstone.cut}</CustomTableCell>
                                <CustomTableCell>{gemstone.clarity}</CustomTableCell>
                                <CustomTableCell>{gemstone.color}</CustomTableCell>
                                <CustomTableCell>{gemstone.carat}</CustomTableCell>
                                <CustomTableCell>{gemstone.polish}</CustomTableCell>
                                <CustomTableCell>{gemstone.symmetry}</CustomTableCell>
                                <CustomTableCell>{gemstone.fluorescence}</CustomTableCell>
                                <CustomTableCell>{gemstone.price}</CustomTableCell>
                                <CustomTableCell>
                                    <StyledIconButton onClick={() => handleEditClick(gemstone)}>
                                        <Edit />
                                    </StyledIconButton>
                                    <StyledIconButton onClick={() => handleDeleteClick(gemstone)}>
                                        <Delete />
                                    </StyledIconButton>
                                </CustomTableCell>
                            </TableRow>
                        ))}
                        {gemstones.length === 0 && (
                            <TableRow>
                                <TableCell align='center' colSpan={10}>
                                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>No gemstones found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedGemstone ? 'Edit Gemstone' : 'Add Gemstone'}</DialogTitle>
                <DialogContent>
                    <GemstoneForm onSubmit={handleSubmit} initialValues={selectedGemstone || {}} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isConfirmDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this gemstone?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
}
