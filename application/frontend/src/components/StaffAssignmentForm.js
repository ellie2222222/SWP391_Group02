import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, CircularProgress, MenuItem, Select, InputLabel, FormControl, Stack, Pagination, InputAdornment, TextField, Card, CardContent, CardActions, Divider } from '@mui/material';
import { Container, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import RequestForm from './RequestForm';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

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

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
});

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

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

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const capitalizeWords = (str) => {
    const words = str.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return words.join(' ');
};

const StaffAssignmentForm = ({ selectedRequest, fetchData, handleCloseAllDialogs, finishAssignment }) => {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [staffs, setStaffs] = useState([]);
    const [assignedStaffs, setAssignedStaffs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchStaffs = async () => {
        try {
            const response = await axiosInstance.get('/users/get-staffs', {
                params: {
                    search: search,
                    page: page,
                    role: role,
                },
            });

            let list = response.data.users.filter(staff => staff.role !== 'manager')

            setStaffs(list);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("Error retrieving list of staffs", {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const fetchRequestWorksOn = async () => {
        try {
            const response = await axiosInstance.get(`/works-on/request-works-on/${selectedRequest._id}`);

            setAssignedStaffs(response.data.worksOn.staff_ids);
        } catch (error) {

        }
    }

    const assignStaff = async (staff) => {
        try {
            const response = await axiosInstance.patch(`/works-on/assign-staff/${selectedRequest._id}`, {
                staff: staff,
            })

            toast.success('Staff assigned successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            fetchStaffs();
            fetchRequestWorksOn();
        } catch (error) {
            toast.error(error.response.data.error || error.message, {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const removeStaff = async (staff) => {
        try {
            const response = await axiosInstance.patch(`/works-on/remove-staff/${selectedRequest._id}`, {
                staff: staff,
            })

            toast.success('Staff removed successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            fetchStaffs();
            fetchRequestWorksOn();
        } catch (error) {
            toast.error(error.response.data.error || error.message, {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const handleFinishAssignment = async () => {
        try {
            const response = await axiosInstance.get(`/works-on/request-works-on/${selectedRequest._id}`);
            
            const staffIds = response.data.worksOn.staff_ids;
            const requiredRoles = ['sale_staff', 'design_staff', 'production_staff'];
            const rolesInStaffIds = staffIds.map(staff => staff.role);
            const hasAllRoles = requiredRoles.every(role => rolesInStaffIds.includes(role));
            if (hasAllRoles) {
                await axiosInstance.patch(`/requests/${selectedRequest._id}`, { 
                    request_status: 'assigned' 
                })

                toast.success('Assignment success', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
                fetchData();
                handleCloseAllDialogs();
            } else {
                toast.error('Insufficient staff for each role, try filling all roles before finishing', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error(error.response.data.error || error.message || 'Error finishing assignment', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const handleReassignStaff = async () => {
        try {
            await axiosInstance.patch(`/requests/${selectedRequest._id}`, { 
                request_status: 'pending' 
            })

            toast.success('Reassignment success. Redirect to pending request dashboard in 5 seconds.', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });

            setTimeout(() => {
                navigate('/management/pending-requests')
            }, 5000)
        } catch (error) {
            toast.error(error.response.data.error || error.message || 'Error reassigning', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const handleSearchClick = () => {
        fetchStaffs();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        fetchStaffs();
        fetchRequestWorksOn();
    }, [page, role]);

    return (
        <Box sx={{ width: '500px' }}>
            <Container sx={{ maxWidth: '100%'}}>
                <Box mb={2}>
                    <CustomTextField
                        label="Search by name or email"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <StyledIconButton color="inherit" onClick={fetchStaffs}>
                                        <Search fontSize="large" />
                                    </StyledIconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box display="flex" mb={2}>
                    <CustomFormControl variant="outlined">
                        <InputLabel sx={{ fontSize: "1.3rem", fontWeight: 900 }}>Role</InputLabel>
                        <Select
                            sx={{ fontSize: "1.3rem" }}
                            name="role"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                            label="Role"
                        >
                            <CustomMenuItem value="">All</CustomMenuItem>
                            <CustomMenuItem value="sale_staff">Sale Staff</CustomMenuItem>
                            <CustomMenuItem value="design_staff">Design Staff</CustomMenuItem>
                            <CustomMenuItem value="production_staff">Production Staff</CustomMenuItem>
                        </Select>
                    </CustomFormControl>
                </Box>

                <Box mb={2}>
                    <Typography variant='h5'>There are a total of {total} result(s)</Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant='h4' align='center'>Staff List</Typography>
                </Box>

                <Box sx={{ maxHeight: '400px', height: '400px', overflow: 'auto' }}>
                    {staffs.map((staff, index) => (
                        <Card key={index} sx={{ mt: index === 0 ? 0 : 2, display: 'flex', justifyContent: 'space-between', boxShadow: 4 }}>
                            <CardContent>
                                <Typography variant="h5">{staff.username}</Typography>
                                <Typography variant="h6">Email: {staff.email}</Typography>
                                <Typography variant="h6">Role: {staff.role && capitalizeWords(staff.role)}</Typography>
                            </CardContent>
                            {selectedRequest.request_status === 'pending' && (
                                <CardActions>
                                    <Button  onClick={() => assignStaff(staff)}>
                                        <IconButton sx={{ color: '#b48c72' }}>
                                            <Add fontSize='large'/>
                                        </IconButton>
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                    {staffs.length === 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h5">No staffs found</Typography>
                            </CardContent>
                        </Card>
                    )}
                </Box>

                <Box display="flex" justifyContent="center" my={2}>
                    <Stack spacing={2}>
                        <Pagination
                            size="large"
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                </Box>

                <Divider />

                <Box my={2}>
                    <Typography variant='h4' align='center'>Assigned Staff List</Typography>
                </Box>

                <Box>
                    {assignedStaffs.map((staff, index) => (
                        <Card key={index} sx={{ mt: index === 0 ? 0 : 2, display: 'flex', justifyContent: 'space-between', boxShadow: 4 }}>
                            <CardContent>
                                <Typography variant="h5">{staff.staff_id.username}</Typography>
                                <Typography variant="h6">Email: {staff.staff_id.email}</Typography>
                                <Typography variant="h6">Role: {staff.role && capitalizeWords(staff.role)}</Typography>
                            </CardContent>
                            {staff.role !== 'manager' && selectedRequest.request_status === 'pending' && (
                                <CardActions>
                                    <Button onClick={() => removeStaff(staff.staff_id)}>
                                        <IconButton sx={{ color: '#b48c72' }}>
                                            <Delete fontSize='large'/>
                                        </IconButton>
                                    </Button>
                                </CardActions>
                            )}
                        </Card>
                    ))}
                    {assignedStaffs.length === 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h5">No assigned staffs found</Typography>
                            </CardContent>
                        </Card>
                    )}
                    {selectedRequest.request_status === 'pending' && (
                        <CustomButton1 sx={{ mt: 2 }} onClick={handleFinishAssignment}>
                            Finish Assignment
                        </CustomButton1>
                    )}
                    {selectedRequest.request_status !== 'pending' && selectedRequest.request_status !== 'completed' && (
                        <CustomButton1 sx={{ mt: 2 }} onClick={handleReassignStaff}>
                            Reassign Staff
                        </CustomButton1>
                    )}
                </Box>
            </Container>
        </Box>
    );
};

export default StaffAssignmentForm;
