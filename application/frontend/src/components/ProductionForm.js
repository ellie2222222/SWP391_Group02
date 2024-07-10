import React from 'react';
import { useFormik } from 'formik';
import { Container, Button, TextField, Typography, Grid, MenuItem, Box } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { format, parseISO } from 'date-fns'; // Sử dụng date-fns để định dạng lại ngày tháng

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const ProductionForm = ({ initialValues, onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const formik = useFormik({
        initialValues: {
            production_start_date: initialValues.production_start_date ? format(parseISO(initialValues.production_start_date), 'yyyy-MM-dd') : '',
            production_end_date: initialValues.production_end_date ? format(parseISO(initialValues.production_end_date), 'yyyy-MM-dd') : '',
            request_status: initialValues.request_status || ''
        },
        validationSchema: Yup.object({
            production_start_date: Yup.date()
                .required('Required')
                .min(today, 'Start date cannot be in the past'),
            production_end_date: Yup.date()
                .required('Required')
                .when('production_start_date', (production_start_date, schema) => {
                    return production_start_date ? schema.min(production_start_date, 'End date cannot be before start date') : schema;
                }),
            request_status: Yup.string()
                .required('Required'),
        }),
        onSubmit: async (values) => {
            // Format dates before submitting
            const formattedValues = {
                ...values,
                production_start_date: format(parseISO(values.production_start_date), 'yyyy-MM-dd'), // Định dạng lại thành dd/MM/yy
                production_end_date: format(parseISO(values.production_end_date), 'yyyy-MM-dd'), // Định dạng lại thành dd/MM/yy
            };
            onSubmit(formattedValues);
        },
    });

    return (
        <Container>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <TextField
                    fullWidth
                    id="production_start_date"
                    name="production_start_date"
                    label="Production Start Date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: today,
                        },
                    }}
                    value={formik.values.production_start_date}
                    onChange={formik.handleChange}
                    error={formik.touched.production_start_date && Boolean(formik.errors.production_start_date)}
                    helperText={formik.touched.production_start_date && formik.errors.production_start_date}
                />

                <TextField
                    fullWidth
                    id="production_end_date"
                    name="production_end_date"
                    label="Production End Date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: formik.values.production_start_date ? formik.values.production_start_date : today,
                        },
                    }}
                    value={formik.values.production_end_date}
                    onChange={formik.handleChange}
                    error={formik.touched.production_end_date && Boolean(formik.errors.production_end_date)}
                    helperText={formik.touched.production_end_date && formik.errors.production_end_date}
                />

                <TextField
                    fullWidth
                    id="request_status"
                    name="request_status"
                    select
                    label="Request Status"
                    value={formik.values.request_status}
                    onChange={formik.handleChange}
                    error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                    helperText={formik.touched.request_status && formik.errors.request_status}
                >
                    <MenuItem value="production">Production</MenuItem>
                    <MenuItem value="Payment">Payment</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>

                <CustomButton1 type="submit">
                    Submit
                </CustomButton1>
            </Box>
        </Container>
    );
};

export default ProductionForm;
