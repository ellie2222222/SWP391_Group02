import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72', // Thay đổi màu chữ khi hover
        backgroundColor: 'transparent',
    },
});

export default function QuoteForm(initialValues,onSubmit) {
    const formik = useFormik({
        initialValues: {
            ...initialValues.initialValues,
        },
        onSubmit: async (values) => {


            return initialValues.onSubmit(values);
          },
        validationSchema: Yup.object({
            quote_content: Yup.string().required('Quote Content is required'),
            quote_amount: Yup.number().typeError("Must be a number"),
            request_status: Yup.string().required("Required."),
        }),
    })
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
                <CustomButton1 type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </CustomButton1>
            </Box>
        </Container>
    )
}
