import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, Dialog, DialogActions, DialogContent, CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import QuoteForm from './QuoteForm'; // Adjust the import path as needed
import ProductionForm from './ProductionForm'; // Adjust the import path as needed
import WarrantyForm from './WarrantyForm'; // Adjust the import path as needed
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';
import DesignForm from './DesignForm';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#b48c72',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#b48c72',
    },
    '& .MuiOutlinedInput-root': {
        fontSize: "1.3rem",
        '& fieldset': {
            borderColor: '#b48c72',
        },
        '&:hover fieldset': {
            borderColor: '#b48c72',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#b48c72',
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiFormHelperText-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
    "& .MuiTypography-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
});

const CustomFormControl = styled(FormControl)({
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiOutlinedInput-root": {
        fontSize: "1.3rem",
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
    },
    "& .MuiFormHelperText-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
    "& .MuiTypography-root": {
        fontSize: "1.2rem",
        marginLeft: 0,
    },
});

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1.3rem',
    '&:hover': {
        color: '#b48c72', // Change text color on hover
        backgroundColor: 'transparent',
    },
});

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
});

export default function RequestForm({ initialValues, onSubmit, fetchData, closeAllDialogs }) {
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const [isDesignFormOpen, setIsDesignFormOpen] = useState(false);
    const [isProductionFormOpen, setIsProductionFormOpen] = useState(false);
    const [isWarrantyFormOpen, setIsWarrantyFormOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
        },
        onSubmit: async (values) => {
            return onSubmit(values);
        },
        validationSchema: Yup.object({
            request_status: Yup.string().required('Required.'),
        }),
    });

    const handleJewelrySubmit = async (values) => {
        try {
            if (initialValues.jewelry_id) {
                await axiosInstance.patch(`/jewelries/${initialValues.jewelry_id._id}`, values);
                toast.success('Jewelry item updated successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            } else {
                await axiosInstance.post('/jewelries', values);
                toast.success('Jewelry item added successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || error.message, {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    const handleSubFormSubmission = async (values) => {
        try {
            const response = await axiosInstance.patch(`/requests/${initialValues._id}`, values);
            toast.success('Update successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            // fetchData();
            closeAllDialogs();
        } catch (error) {
            toast.error(error.response.data.error || 'Update fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        }
    }

    const handleUpdateJewelryDesign = async (values) => {
        try {
            await axiosInstance.patch(`/jewelries/${initialValues.jewelry_id._id}`, values);
        
            toast.success('Design update successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            // fetchData();
        } catch (error) {
            toast.error('Design update fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    }

    const handleQuoteFormSubmit = async (values) => {
        setIsQuoteFormOpen(false);
        formik.setFieldValue('quote', values);
        await handleSubFormSubmission(values);
        // await handleJewelrySubmit(values);
        fetchData();
    };
    
    const handleDesignFormSubmit = async (values, designData) => {
        setIsDesignFormOpen(false);
        formik.setFieldValue('quote', values);
        await handleUpdateJewelryDesign(designData);
        await handleSubFormSubmission(values);
        fetchData();
    };

    const handleProductionFormSubmit = async (values) => {
        setIsProductionFormOpen(false);
        formik.setFieldValue('production', values);
        await handleSubFormSubmission(values);
        fetchData();
    };

    const handleWarrantyFormSubmit = async (values) => {
        setIsWarrantyFormOpen(false);
        formik.setFieldValue('warranty', values);
        await handleSubFormSubmission(values);
        fetchData();
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align='center'>
                Edit Request
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { width: '100%' } }}>
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="request_status">Request Status</InputLabel>
                    <Select
                        name="request_status"
                        value={formik.values.request_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Request Status"
                        error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                    >
                        <CustomMenuItem value="assigned">Assigned</CustomMenuItem>
                        <CustomMenuItem value="quote">Quote</CustomMenuItem>
                        <CustomMenuItem value="accepted">Accepted</CustomMenuItem>
                        <CustomMenuItem value="deposit_design">Deposit Design</CustomMenuItem>
                        <CustomMenuItem value="design">Design</CustomMenuItem>
                        <CustomMenuItem value="design_completed">Design Completed</CustomMenuItem>
                        <CustomMenuItem value="deposit_production">Deposit Production</CustomMenuItem>
                        <CustomMenuItem value="production">Production</CustomMenuItem>
                        <CustomMenuItem value="payment">Payment</CustomMenuItem>
                        <CustomMenuItem value="warranty">Warranty</CustomMenuItem>
                        <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                        <CustomMenuItem value="completed">Completed</CustomMenuItem>
                    </Select>
                    {formik.touched.request_status && formik.errors.request_status && (
                        <Typography variant="caption" color="red">{formik.errors.request_status}</Typography>
                    )}
                </CustomFormControl>
                <Box display='flex' gap='1rem'>
                    <CustomButton1
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setIsQuoteFormOpen(true)}
                    >
                        Quote
                    </CustomButton1>
                    <CustomButton1
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setIsDesignFormOpen(true)}
                    >
                        Design
                    </CustomButton1>
                </Box>
                <Box display='flex' gap='1rem'>
                    <CustomButton1
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setIsProductionFormOpen(true)}
                    >
                        Production
                    </CustomButton1>
                    <CustomButton1
                        type="button"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => setIsWarrantyFormOpen(true)}
                    >
                        Warranty
                    </CustomButton1>
                </Box>
                <CustomButton1 type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </CustomButton1>
            </Box>
            <Dialog open={isQuoteFormOpen} onClose={() => setIsQuoteFormOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <QuoteForm
                        initialValues={initialValues}
                        onSubmit={handleQuoteFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsQuoteFormOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isDesignFormOpen} onClose={() => setIsDesignFormOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <DesignForm
                        initialValues={initialValues}
                        onSubmit={handleDesignFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDesignFormOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isProductionFormOpen} onClose={() => setIsProductionFormOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <ProductionForm
                        initialValues={initialValues}
                        onSubmit={handleProductionFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsProductionFormOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isWarrantyFormOpen} onClose={() => setIsWarrantyFormOpen(false)} fullWidth maxWidth="sm">
                <DialogContent>
                    <WarrantyForm
                        initialValues={initialValues}
                        onSubmit={handleWarrantyFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsWarrantyFormOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72' }}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
