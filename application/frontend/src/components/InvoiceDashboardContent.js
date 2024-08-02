import React, { useState, useEffect } from 'react';
import { Box, styled, TextField, InputAdornment, IconButton, FormControl, InputLabel, Select, MenuItem, Pagination, Stack, Typography, CircularProgress } from '@mui/material';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Search } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
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
    minWidth: 150,
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

const InvoiceDashboardContent = () => {
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    const [invoices, setInvoices] = useState([]);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentGateway, setPaymentGateway] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(false);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/invoices', {
                params: {
                    ...Object.fromEntries(searchParams),
                },
            });

            setInvoices(response.data.invoices);
            setTotal(response.data.totalInvoices);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error("There was an error fetching invoices!", {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        } finally {
            setLoading(false);
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
        setPaymentGateway(searchParams.get('payment_gateway') || '');
        setPaymentMethod(searchParams.get('payment_method') || '');
        setSearch(searchParams.get('search') || '');
        setPage(parseInt(searchParams.get('page') || '1', 10));
    }, [searchParams]);

    useEffect(() => {
        fetchInvoices();
    }, [searchParams, page]);

    const handleFilterChange = (key, value) => {
        updateQueryParams(key, value, true);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        updateQueryParams('page', newPage.toString());
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleSearchClick = () => {
        updateQueryParams('search', search, true);
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <DrawerHeader />
            <ToastContainer />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                    <CircularProgress/>
                </Box>
            ) : (
                <Container>
                    <Box display="flex" mb={2} flexDirection="column">
                        <Box mb={2}>
                            <CustomTextField
                                label="Search by invoice ID"
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
                            <CustomFormControl>
                                <InputLabel id="payment-method-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Payment Method</InputLabel>
                                <Select
                                    labelId='payment-method-label'
                                    label='Payment Method'
                                    value={paymentMethod}
                                    onChange={(event) => {
                                        setPaymentMethod(event.target.value);
                                        handleFilterChange('payment_method', event.target.value);
                                    }}
                                >
                                    <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                    <CustomMenuItem value="credit_card">Credit Card</CustomMenuItem>
                                    <CustomMenuItem value="domestic_card">Domestic Card</CustomMenuItem>
                                    <CustomMenuItem value="cash">Cash</CustomMenuItem>
                                    <CustomMenuItem value="other">Other</CustomMenuItem>
                                </Select>
                            </CustomFormControl>
                            <CustomFormControl sx={{ ml: 2 }}>
                                <InputLabel id="payment-gateway-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Payment Gateway</InputLabel>
                                <Select
                                    labelId='payment-gateway-label'
                                    label='Payment Gateway'
                                    value={paymentGateway}
                                    onChange={(event) => {
                                        setPaymentGateway(event.target.value);
                                        handleFilterChange('payment_gateway', event.target.value);
                                    }}
                                >
                                    <CustomMenuItem value=""><em>None</em></CustomMenuItem>
                                    <CustomMenuItem value="zalopay">ZaloPay</CustomMenuItem>
                                    <CustomMenuItem value="other">Other</CustomMenuItem>
                                </Select>
                            </CustomFormControl>
                            <CustomFormControl sx={{ ml: 2 }}>
                                <InputLabel id="sort-by-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Sort By</InputLabel>
                                <Select
                                    labelId='sort-by-label'
                                    label='Sort By'
                                    value={sortBy}
                                    onChange={(event) => {
                                        setSortBy(event.target.value);
                                        handleFilterChange('sortBy', event.target.value);
                                    }}
                                >
                                    <CustomMenuItem value="createdAt">Date</CustomMenuItem>
                                    <CustomMenuItem value="total_amount">Amount</CustomMenuItem>
                                </Select>
                            </CustomFormControl>
                            <CustomFormControl sx={{ ml: 2 }}>
                                <InputLabel id="sort-order-label" sx={{ fontSize: '1.3rem', fontWeight: '900' }}>Sort Order</InputLabel>
                                <Select
                                    labelId='sort-order-label'
                                    label='Sort Order'
                                    value={sortOrder}
                                    onChange={(event) => {
                                        setSortOrder(event.target.value);
                                        handleFilterChange('sortOrder', event.target.value);
                                    }}
                                >
                                    <CustomMenuItem value="asc">Ascending</CustomMenuItem>
                                    <CustomMenuItem value="desc">Descending</CustomMenuItem>
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
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Invoice ID</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>User</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Payment Method</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Payment Gateway</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Date</CustomTableCell>
                                    <CustomTableCell sx={{ fontWeight: 'bold' }}>Amount</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoices.length > 0 ? (
                                    invoices.map((invoice, index) => (
                                        <TableRow key={index}>
                                            <CustomTableCell sx={{ fontWeight: 'bold' }}>{invoice._id}</CustomTableCell>
                                            <CustomTableCell>{invoice.transaction_id?.request_id?.user_id?.email || 'N/A'}</CustomTableCell>
                                            <CustomTableCell sx={{ textTransform: 'capitalize' }}>{invoice.payment_method && capitalizeWords(invoice.payment_method)}</CustomTableCell>
                                            <CustomTableCell>{invoice.payment_gateway}</CustomTableCell>
                                            <CustomTableCell>{invoice.createdAt && (new Date(invoice.createdAt)).toLocaleDateString()}</CustomTableCell>
                                            <CustomTableCell>{invoice.total_amount && invoice.total_amount.toLocaleString() + "₫"}</CustomTableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <CustomTableCell align='center' colSpan={6}>
                                            <Typography variant="h6">No invoices found</Typography>
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
                </Container>
            )}
        </Box>
    );
};

export default InvoiceDashboardContent;
