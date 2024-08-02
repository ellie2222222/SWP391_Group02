import React, { useState, useEffect } from 'react';
import { Box, styled, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import UserForm from './UserForm';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const CustomButton = styled(Button)({
    backgroundColor: '#b48c72',
    fontSize: '1.3rem',
    '&:hover': {
      backgroundColor: '#a57d65',
    },
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

const CustomFormControl = styled(FormControl)({
    minWidth: 120,
    "& .MuiInputLabel-root": {
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiOutlinedInput-root": {
        fontSize: '1.3rem',
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
    },
});

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
});

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
});

const capitalizeWords = (str) => {
    const words = str.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return words.join(' ');
};

const UserDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/users', {
                params: {
                    ...Object.fromEntries(searchParams),
                    role: 'user',
                },
            });
    
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (error) {
        }
    };

    const updateQueryParams = (key, value, resetPage = false) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        if (resetPage) {
            newSearchParams.set('page', '1');
        }
        setSearchParams(newSearchParams);
    };

    useEffect(() => {
        setSearch(searchParams.get('search') || '');
        setRole(searchParams.get('role') || '');
        setPage(parseInt(searchParams.get('page') || '1', 10));
    }, [searchParams]);

    useEffect(() => {
        fetchUsers();
    }, [searchParams, page]);

    const handleSearchClick = () => {
        updateQueryParams('search', search, true);
    };

    const handleFilterChange = (key, value) => {
        updateQueryParams(key, value, true);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        updateQueryParams('page', newPage.toString());
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleSubmit = async (values) => {
        try {
            await axiosInstance.patch(`/users/${selectedUser._id}`, values);
            fetchUsers();
            setIsDialogOpen(false);
            toast.success('User updated successfully!');
        } catch (error) {
            toast.error('Failed to update user. Please try again.');
        }
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <ToastContainer />
            <Container>
                <Box display="flex" mb={2} flexDirection="column">
                    <Box mb={2}>
                        <CustomTextField
                            label="Search by username or email"
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
                    {/* <Box display="flex">
                        <CustomFormControl>
                            <InputLabel id="role-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Role</InputLabel>
                            <Select
                                labelId='role-label'
                                label='Role'
                                value={role}
                                onChange={(event) => handleFilterChange('role', event.target.value)}
                            >
                                <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                <CustomMenuItem value="user">User</CustomMenuItem>
                                <CustomMenuItem value="manager">Manager</CustomMenuItem>
                                <CustomMenuItem value="sale_staff">Sale Staff</CustomMenuItem>
                                <CustomMenuItem value="design_staff">Design Staff</CustomMenuItem>
                                <CustomMenuItem value="production_staff">Production Staff</CustomMenuItem>
                            </Select>
                        </CustomFormControl>
                    </Box> */}
                </Box>

                <Box mb={2}>
                    <Typography variant='h5'>Page {page}: {users.length} result(s)</Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>UID</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>Name</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>Email</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>Phone Number</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>Address</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }}>Role</CustomTableCell>
                                <CustomTableCell sx={{ fontWeight: 'bold' }} align='center'>Actions</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <CustomTableCell sx={{ fontWeight: 'bold' }}>{user._id}</CustomTableCell>
                                        <CustomTableCell>{user.username}</CustomTableCell>
                                        <CustomTableCell>{user.email}</CustomTableCell>
                                        <CustomTableCell>{user.phone_number}</CustomTableCell>
                                        <CustomTableCell>{user.address}</CustomTableCell>
                                        <CustomTableCell sx={{ textTransform: 'capitalize' }}>{user.role && capitalizeWords(user.role)}</CustomTableCell>
                                        <CustomTableCell align='center'>
                                            <StyledIconButton color="primary" onClick={() => handleEditClick(user)}>
                                                <Edit fontSize='large' />
                                            </StyledIconButton>
                                        </CustomTableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <CustomTableCell align='center' colSpan={7}>
                                        <Typography variant="h6">No users found</Typography>
                                    </CustomTableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="center" marginTop="20px">
                    <Stack spacing={2}>
                        <Pagination
                            size='large'
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Box>

                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogContent>
                        <UserForm initialValues={selectedUser} onSubmit={handleSubmit} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsDialogOpen(false)} sx={{ color: "#b48c72", fontSize: '1.3rem' }}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default UserDashboardContent;
