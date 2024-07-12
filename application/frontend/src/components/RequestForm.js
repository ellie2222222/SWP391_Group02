import React from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, styled } from '@mui/material';
import * as Yup from 'yup';

const convertToInputDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

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
})

const RequestForm = ({ initialValues, onSubmit, role }) => {
    const filterBlankValues = (values) => {
        const filteredValues = {};
        Object.keys(values).forEach((key) => {
            if (values[key] !== '' && values[key] !== null && values[key] !== undefined) {
                filteredValues[key] = values[key];
            }
        });
        return filteredValues;
    };

    const filteredInitialValues = filterBlankValues({
        ...initialValues,
        user_id: initialValues.user_id ? initialValues.user_id._id : '',
        production_start_date: initialValues.production_start_date ? convertToInputDateFormat(new Date(initialValues.production_start_date).toLocaleDateString()) : '',
        production_end_date: initialValues.production_end_date ? convertToInputDateFormat(new Date(initialValues.production_end_date).toLocaleDateString()) : ''
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
            design_status: Yup.string(),
            production_start_date: Yup.date(),
            production_end_date: Yup.date(),
            production_cost: Yup.number().typeError("Must be a number").positive("Must be greater than 0"),
            production_status: Yup.string(),
        }),
        onSubmit: async (values) => {
            await onSubmit(values);
        }
    });

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align='center'>
                Edit Request
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
                    name="user_id"
                    label="User ID"
                    variant="outlined"
                    value={formik.values.user_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.user_id && Boolean(formik.errors.user_id)}
                    helperText={formik.touched.user_id && formik.errors.user_id}
                    InputProps={{ readOnly: role !== 'manager' }}
                />
                <CustomTextField
                    name="request_description"
                    label="Request Description"
                    variant="outlined"
                    value={formik.values.request_description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.request_description && Boolean(formik.errors.request_description)}
                    helperText={formik.touched.request_description && formik.errors.request_description}
                    InputProps={{ readOnly: role !== 'manager' }}
                />
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="request-status-label">Request Status</InputLabel>
                    <Select
                        labelId="request-status-label"
                        name="request_status"
                        value={formik.values.request_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Request Status"
                        error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                        readOnly={role !== 'manager'}
                    >
                        <CustomMenuItem value="pending">Pending</CustomMenuItem>
                        <CustomMenuItem value="accepted">Accepted</CustomMenuItem>
                        <CustomMenuItem value="completed">Completed</CustomMenuItem>
                        <CustomMenuItem value="design">Design</CustomMenuItem>
                        <CustomMenuItem value="quote">Quote</CustomMenuItem>
                        <CustomMenuItem value="production">Production</CustomMenuItem>
                        <CustomMenuItem value="payment">Payment</CustomMenuItem>
                        <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                    </Select>
                    {formik.touched.request_status && formik.errors.request_status && (
                        <Typography variant="caption" color="red">{formik.errors.request_status}</Typography>
                    )}
                </CustomFormControl>
                <CustomTextField
                    name="quote_amount"
                    label="Quote Amount"
                    type="number"
                    variant="outlined"
                    value={formik.values.quote_amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_amount && Boolean(formik.errors.quote_amount)}
                    helperText={formik.touched.quote_amount && formik.errors.quote_amount}
                    InputProps={{ readOnly: role !== 'manager' && role !== 'sale_staff' }}
                />
                <CustomTextField
                    name="quote_content"
                    label="Quote Content"
                    variant="outlined"
                    value={formik.values.quote_content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.quote_content && Boolean(formik.errors.quote_content)}
                    helperText={formik.touched.quote_content && formik.errors.quote_content}
                    InputProps={{ readOnly: role !== 'manager' && role !== 'sale_staff' }}
                />
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="quote-status-label">Quote Status</InputLabel>
                    <Select
                        labelId="quote-status-label"
                        name="quote_status"
                        value={formik.values.quote_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Quote Status"
                        error={formik.touched.quote_status && Boolean(formik.errors.quote_status)}
                        readOnly={role !== 'manager'}
                    >
                        <CustomMenuItem value="pending">Pending</CustomMenuItem>
                        <CustomMenuItem value="approved">Approved</CustomMenuItem>
                        <CustomMenuItem value="rejected">Rejected</CustomMenuItem>
                    </Select>
                    {formik.touched.quote_status && formik.errors.quote_status && (
                        <Typography variant="caption" color="red">{formik.errors.quote_status}</Typography>
                    )}
                </CustomFormControl>
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="design-status-label">Design Status</InputLabel>
                    <Select
                        labelId="design-status-label"
                        name="design_status"
                        value={formik.values.design_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Design Status"
                        error={formik.touched.design_status && Boolean(formik.errors.design_status)}
                        readOnly={role !== 'manager' && role !== 'design_staff' }
                    >
                        <CustomMenuItem value="ongoing">Ongoing</CustomMenuItem>
                        <CustomMenuItem value="completed">Completed</CustomMenuItem>
                    </Select>
                    {formik.touched.quote_status && formik.errors.quote_status && (
                        <Typography variant="caption" color="red">{formik.errors.quote_status}</Typography>
                    )}
                </CustomFormControl>
                <CustomTextField
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
                    InputProps={{ readOnly: role !== 'manager' && role !== 'production_staff' }}
                />
                <CustomTextField
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
                    InputProps={{ readOnly: role !== 'manager' && role !== 'production_staff' }}
                />
                <CustomTextField
                    name="production_cost"
                    label="Production Cost"
                    type="number"
                    variant="outlined"
                    value={formik.values.production_cost}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.production_cost && Boolean(formik.errors.production_cost)}
                    helperText={formik.touched.production_cost && formik.errors.production_cost}
                    InputProps={{ readOnly: role !== 'manager' && role !== 'production_staff' }}
                />
                <CustomFormControl variant="outlined" fullWidth>
                    <InputLabel id="production-status-label">Production Status</InputLabel>
                    <Select
                        labelId="production-status-label"
                        name="production_status"
                        value={formik.values.production_status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Production Status"
                        error={formik.touched.production_status && Boolean(formik.errors.production_status)}
                        readOnly={ role !== 'manager' && role !== 'production_staff' }
                    >
                        <CustomMenuItem value="ongoing">Ongoing</CustomMenuItem>
                        <CustomMenuItem value="completed">Completed</CustomMenuItem>
                    </Select>
                    {formik.touched.production_status && formik.errors.production_status && (
                        <Typography variant="caption" color="red">{formik.errors.production_status}</Typography>
                    )}
                </CustomFormControl>
                <CustomButton1 type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit
                </CustomButton1>
            </Box>
        </Container>
    );
};

export default RequestForm;
