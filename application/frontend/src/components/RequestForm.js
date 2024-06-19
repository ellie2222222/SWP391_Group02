import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import * as Yup from 'yup';

const RequestForm = ({ initialValues, onSubmit }) => {
    const filterBlankValues = (values) => {
        const filteredValues = {};

        Object.keys(values).forEach((key) => {
            if (values[key] !== '' && values[key] !== null && values[key] !== undefined) {
                filteredValues[key] = values[key];
            }
        });

        return filteredValues;
    };

    // Filter initial values to remove blank/null/undefined values
    const filteredInitialValues = filterBlankValues({
        ...initialValues,
        user_id: initialValues.user_id ? initialValues.user_id._id : '', // Extract _id from user_id object
    });

    const formik = useFormik({
        initialValues: filteredInitialValues,
        validationSchema: Yup.object({
            user_id: Yup.string().required("Required."),
            request_description: Yup.string().required("Required."),
            request_status: Yup.string().required("Required."),
            quote_amount: Yup.number().typeError("Must be a number").positive("Must be greater than 0"),
            quote_content: Yup.string(),
            quote_status: Yup.string(),
            production_start_date: Yup.date(),
            production_end_date: Yup.date(),
            production_status: Yup.string(),
            total_amount: Yup.number().typeError("Must be a number").positive("Must be greater than 0"),
        }),
        onSubmit: async (values) => {
            await onSubmit(values);
        }
    });

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Edit Request
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <TextField
                    name="user_id"
                    label="User ID"
                    variant="outlined"
                    value={formik.values.user_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                    helperText={formik.touched.user_id && formik.errors.user_id}
                />
                <TextField
                    name="request_description"
                    label="Request Description"
                    variant="outlined"
                    value={formik.values.request_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.request_description && Boolean(formik.errors.request_description)}
                    helperText={formik.touched.request_description && formik.errors.request_description}
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="request-status-label">Request Status</InputLabel>
                    <Select
                        labelId="request-status-label"
                        name="request_status"
                        value={formik.values.request_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Request Status"
                        error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="design">Design</MenuItem>
                        <MenuItem value="quote">Quote</MenuItem>
                        <MenuItem value="production">Production</MenuItem>
                        <MenuItem value="payment">Payment</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                    {formik.touched.request_status && formik.errors.request_status && (
                        <Typography variant="caption" color="red">{formik.errors.request_status}</Typography>
                    )}
                </FormControl>
                <TextField
                    name="quote_amount"
                    label="Quote Amount"
                    type="number"
                    variant="outlined"
                    value={formik.values.quote_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_amount && Boolean(formik.errors.quote_amount)}
                    helperText={formik.touched.quote_amount && formik.errors.quote_amount}
                />
                <TextField
                    name="quote_content"
                    label="Quote Content"
                    variant="outlined"
                    value={formik.values.quote_content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_content && Boolean(formik.errors.quote_content)}
                    helperText={formik.touched.quote_content && formik.errors.quote_content}
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="quote-status-label">Quote Status</InputLabel>
                    <Select
                        labelId="quote-status-label"
                        name="quote_status"
                        value={formik.values.quote_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Quote Status"
                        error={formik.touched.quote_status && Boolean(formik.errors.quote_status)}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                    {formik.touched.quote_status && formik.errors.quote_status && (
                        <Typography variant="caption" color="red">{formik.errors.quote_status}</Typography>
                    )}
                </FormControl>
                <TextField
                    name="production_start_date"
                    label="Production Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={formik.values.production_start_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.production_start_date && Boolean(formik.errors.production_start_date)}
                    helperText={formik.touched.production_start_date && formik.errors.production_start_date}
                />
                <TextField
                    name="production_end_date"
                    label="Production End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    variant="outlined"
                    value={formik.values.production_end_date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.production_end_date && Boolean(formik.errors.production_end_date)}
                    helperText={formik.touched.production_end_date && formik.errors.production_end_date}
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="production-status-label">Production Status</InputLabel>
                    <Select
                        labelId="production-status-label"
                        name="production_status"
                        value={formik.values.production_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Production Status"
                        error={formik.touched.production_status && Boolean(formik.errors.production_status)}
                    >
                        <MenuItem value="ongoing">Ongoing</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                    {formik.touched.production_status && formik.errors.production_status && (
                        <Typography variant="caption" color="red">{formik.errors.production_status}</Typography>
                    )}
                </FormControl>
                <TextField
                    name="total_amount"
                    label="Total Amount"
                    type="number"
                    variant="outlined"
                    value={formik.values.total_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.total_amount && Boolean(formik.errors.total_amount)}
                    helperText={formik.touched.total_amount && formik.errors.total_amount}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default RequestForm;
