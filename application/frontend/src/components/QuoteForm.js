import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import JewelryForm from './JewelryForm'; // Adjust the import path as needed
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

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
})

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
            const gemstoneNames = selectedJewelry?.gemstone_ids?.map(gem => gem.name).join(', ') || 'Gemstone';
            const subGemstoneNames = selectedJewelry?.subgemstone_ids?.map(gem => gem.name).join(', ') || 'Subgemstone';
            const gemstonePrices = selectedJewelry?.gemstone_ids?.reduce((total, gem) => total + gem.price, 0) || 0;
            const subGemstonePrices = selectedJewelry?.subgemstone_ids?.reduce((total, gem) => total + gem.price, 0) || 0;
            const materialName = selectedJewelry?.material_id?.name || 'Material';
            const materialWeight = selectedJewelry?.material_weight || 0;
            const materialSellPrice = selectedJewelry?.material_id?.sell_price || 0;
            const productionCost = Number(formik.values.production_cost) || 0;
            const totalCost = gemstonePrices + subGemstonePrices  + (materialSellPrice * materialWeight) + productionCost;
    
            const quoteContent = `
                Main Gemstones (${gemstoneNames}) + Sub Gemstones (${subGemstoneNames}) + ${materialName} * ${materialWeight} mace + Production Cost = ${gemstonePrices} + ${subGemstonePrices} + (${materialSellPrice} * ${materialWeight}) + ${productionCost} = ${totalCost}
            `.trim();
    
            formik.setFieldValue('quote_content', quoteContent);
        }
    }, [selectedJewelry, formik.values.production_cost]);
    useEffect(() => {
        if (selectedJewelry || formik.values.production_cost) {
            const quoteAmount = Number(formik.values.production_cost) + selectedJewelry?.price;
            formik.setFieldValue('quote_amount', quoteAmount);
        }
    }, [selectedJewelry, formik.values.production_cost]);

    const handleJewelryFormSubmit = async (values,gemstoneValues) => {
        try {
            let response;
            if (selectedJewelry) {
                response = await axiosInstance.patch(`/jewelries/${selectedJewelry._id}`, values);
            } else {
                response = await axiosInstance.post('/jewelries', values);
            }

            setJewelryId(response.data._id);
            const gemstoneIdsToUpdate = [...new Set([...gemstoneValues.gemstone_ids, ...gemstoneValues.subgemstone_ids])];
            const gemstoneIdsDefault = [
                ...new Set([
                    ...(selectedJewelry?.subgemstone_ids?.map(gem => gem._id) || []),
                    ...(selectedJewelry?.gemstone_ids?.map(gem => gem._id) || [])
                ])
            ];
            const gemstoneAvailableAgain = gemstoneIdsDefault.filter(id => !gemstoneIdsToUpdate.includes(id));

            console.log(gemstoneAvailableAgain)
            const updateGemstoneRequests = gemstoneIdsToUpdate.map(id =>
                axiosInstance.patch(`/gemstones/${id}`, { available: false })
            );
            const updateGemstoneAvailableAgain = gemstoneAvailableAgain.map(id =>
                axiosInstance.patch(`/gemstones/${id}`, { available: true })
            );
            await Promise.all([...updateGemstoneRequests, ...updateGemstoneAvailableAgain]);
            toast.success('Jewelry saved successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            formik.setFieldValue('jewelry_id', response.data._id);
            setSelectedJewelry(response.data);
            setIsJewelryFormOpen(false);
        } catch (error) {
            toast.error(error.response.data.error || 'Jewelry saved fail', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align='center'>
                Quote Form
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
                    name="quote_content"
                    label="Quote Content"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formik.values.quote_content || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_content && Boolean(formik.errors.quote_content)}
                    helperText={formik.touched.quote_content && formik.errors.quote_content}
                />
                <CustomTextField
                    name="quote_amount"
                    label="Quote Amount"
                    variant="outlined"
                    value={formik.values.quote_amount || ''}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_amount && Boolean(formik.errors.quote_amount)}
                    helperText={formik.touched.quote_amount && formik.errors.quote_amount}
                    inputProps={{readOnly: true}}
                />
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="request_status">Request Status</InputLabel>
                    <Select
                        name="request_status"
                        value={formik.values.request_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="request_status"
                        error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                    >
                        <CustomMenuItem value="assigned">Assigned</CustomMenuItem>
                        <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                        <CustomMenuItem value="quote">Quote</CustomMenuItem>
                    </Select>
                    {formik.touched.request_status && formik.errors.request_status && (
                        <Typography variant="caption" color="red">{formik.errors.request_status}</Typography>
                    )}
                </CustomFormControl>
                <CustomTextField
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
               <CustomTextField
                    name="production_cost"
                    label="Production Cost"
                    variant="outlined"
                    value={formik.values.production_cost || ''}
                    onChange={(e) => formik.setFieldValue('production_cost', Number(e.target.value))}
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
                <DialogContent>
                    <JewelryForm
                        initialValues={selectedJewelry ? {
                            ...selectedJewelry
                        } : {
                            name: '',
                            description: '',
                            price: 0,
                            gemstone_ids: [],
                            subgemstone_ids:[],
                            gemstone_weight: 0,
                            material_id: '',
                            material_weight: 0,
                            category: '',
                            type: '',
                            images: [],
                            available: false,
                        }}
                        onSubmit={handleJewelryFormSubmit}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsJewelryFormOpen(false)} sx={{fontSize: '1.3rem', color: '#b48c72'}}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
