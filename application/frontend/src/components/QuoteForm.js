import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import JewelryForm from './JewelryForm'; // Adjust the import path as needed
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72', // Change text color on hover
        backgroundColor: 'transparent',
    },
});

export default function QuoteForm({ initialValues, onSubmit }) {
    const [isJewelryFormOpen, setIsJewelryFormOpen] = useState(false);
    const [jewelryId, setJewelryId] = useState(initialValues.jewelry_id ? initialValues.jewelry_id._id : '');
    const [selectedJewelry, setSelectedJewelry] = useState(initialValues.jewelry_id ? initialValues.jewelry_id : null);
    const formik = useFormik({
        initialValues: {
            ...initialValues,
            jewelry_id: jewelryId,
        },
        onSubmit: async (values) => {
            return onSubmit(values);
        },
        validationSchema: Yup.object({
            quote_content: Yup.string().required('Quote Content is required'),
            quote_amount: Yup.number().typeError('Must be a number').positive('Must be a positive number').required('Quote Amount is required'),
            request_status: Yup.string().required('Required.'),
            jewelry_id: Yup.string().required('Required.'),
            production_cost: Yup.number().typeError('Must be a number').positive('Must be a positive number').required('Production Cost is required'),
        }),
    });

    useEffect(() => {
        if (selectedJewelry || formik.values.production_cost) {
            const quoteContent = (
                `${selectedJewelry.gemstone_id.name} * ${selectedJewelry.gemstone_id.carat} carat + ` +
                `${selectedJewelry.material_id.name} * ${selectedJewelry.material_weight} + ` +
                `P Cost = ` +
                `${selectedJewelry.gemstone_id.price} * ${selectedJewelry.gemstone_id.carat} + ` +
                `${selectedJewelry.material_id.sell_price} * ${selectedJewelry.material_weight} + ` +
                `${formik.values.production_cost} = ` +
                `${selectedJewelry.gemstone_id.price * selectedJewelry.gemstone_id.carat + selectedJewelry.material_id.sell_price * selectedJewelry.material_weight + Number(formik.values.production_cost)}`
            ); 
            formik.setFieldValue('quote_content', quoteContent);
        }
        
    }, [selectedJewelry, formik.values.production_cost ]);

    useEffect(() => {
        if (selectedJewelry || formik.values.production_cost) {
            const quoteAmount = Number(formik.values.production_cost) + selectedJewelry.price;
            formik.setFieldValue('quote_amount', quoteAmount);
        }
    }, [selectedJewelry, formik.values.production_cost]);

    const handleJewelryFormSubmit = async (values) => {
        try {
            let response;
            if (selectedJewelry) {
                response = await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values); // Adjust the API endpoint as needed
            } else {
                response = await axiosInstance.post('/jewelries', values); // Adjust the API endpoint as needed
            }
            setJewelryId(response.data._id); // Set the Jewelry ID from the response
            formik.setFieldValue('jewelry_id', response.data._id); // Update the formik value
            setSelectedJewelry(response.data); // Update the selected jewelry state
            setIsJewelryFormOpen(false);
        } catch (error) {
            console.error('Failed to submit jewelry form', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Quote
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <TextField
                    name="quote_content"
                    label="Quote Content"
                    variant="outlined"
                    value={formik.values.quote_content || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_content && Boolean(formik.errors.quote_content)}
                    helperText={formik.touched.quote_content && formik.errors.quote_content}
                />
                <TextField
                    name="quote_amount"
                    label="Quote Amount"
                    variant="outlined"
                    value={formik.values.quote_amount || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_amount && Boolean(formik.errors.quote_amount)}
                    helperText={formik.touched.quote_amount && formik.errors.quote_amount}
                    readOnly
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="request_status">Status</InputLabel>
                    <Select
                        name="request_status"
                        value={formik.values.request_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="request_status"
                        error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="quote">Quote</MenuItem>
                    </Select>
                    {formik.touched.request_status && formik.errors.request_status && (
                        <Typography variant="caption" color="red">{formik.errors.request_status}</Typography>
                    )}
                </FormControl>
                <TextField
                    name="jewelry_id"
                    label="Jewelry ID"
                    variant="outlined"
                    value={formik.values.jewelry_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.jewelry_id && Boolean(formik.errors.jewelry_id)}
                    helperText={formik.touched.jewelry_id && formik.errors.jewelry_id}
                    InputProps={{
                        readOnly: true,
                    }}
                    sx={{ mt: 2 }}
                />
                <TextField
                    name="production_cost"
                    label="Production Cost"
                    variant="outlined"
                    value={formik.values.production_cost || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.production_cost && Boolean(formik.errors.production_cost)}
                    helperText={formik.touched.production_cost && formik.errors.production_cost}
                    sx={{ mt: 2 }}
                />
                <CustomButton1
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => setIsJewelryFormOpen(true)}
                >
                    {selectedJewelry ? 'Update Jewelry' : 'Add Jewelry'}
                </CustomButton1>
                <CustomButton1 type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </CustomButton1>
            </Box>
            <Dialog open={isJewelryFormOpen} onClose={() => setIsJewelryFormOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{selectedJewelry ? 'Update Jewelry' : 'Add Jewelry'}</DialogTitle>
                <DialogContent>
                    <JewelryForm
                        initialValues={selectedJewelry ? {
                            ...selectedJewelry,
                            gemstone_id: selectedJewelry.gemstone_id._id,
                            material_id: selectedJewelry.material_id._id
                        } : {
                            name: '',
                            description: '',
                            price: 0,
                            gemstone_id: '',
                            gemstone_weight: 0,
                            material_id: '',
                            material_weight: 0,
                            category: '',
                            type: '',
                            on_sale: false,
                            sale_percentage: 0,
                            images: [],
                            available: false,
                        }}
                        onSubmit={handleJewelryFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsJewelryFormOpen(false)} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
