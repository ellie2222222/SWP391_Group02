import React, { useState, useEffect } from 'react';
import { Box, styled, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import UserForm from './UserForm';
import { useSearchParams } from 'react-router-dom';

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

const CustomTextField = styled(TextField)({
    width: '100%',
    variant: "outlined",
    padding: "0",
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#b48c72",
        },
    },
    "& .MuiInputLabel-root": {
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
});

const CustomFormControl = styled(FormControl)({
    minWidth: 120,
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
                },
            });
            setUsers(response.data.users);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("There was an error fetching the users!", error);
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

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <Container>
                <Box display="flex" mb={2} flexDirection="column">
                    <Box mb={2}>
                        <CustomTextField
                            size="normal"
                            label="Search by username or email"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton color="inherit" onClick={handleSearchClick}>
                                            <Search fontSize="large" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box display="flex">
                        <CustomFormControl>
                            <InputLabel sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Role</InputLabel>
                            <Select
                                value={role}
                                onChange={(event) => handleFilterChange('role', event.target.value)}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="manager">Manager</MenuItem>
                                <MenuItem value="sale_staff">Sale Staff</MenuItem>
                                <MenuItem value="design_staff">Design Staff</MenuItem>
                                <MenuItem value="production_staff">Production Staff</MenuItem>
                            </Select>
                        </CustomFormControl>
                    </Box>
                </Box>

                <Box mb={2}>
                    <Typography variant='h5'>There are a total of {total} result(s)</Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell align='center'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user.phone_number}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
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
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell align='center' colSpan={6}>
                                        <Typography variant="h6">No users found</Typography>
                                    </TableCell>
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
