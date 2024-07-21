import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, Button, TextField, Typography, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { format, parseISO } from 'date-fns';

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

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

const convertToInputDateFormat = (dateStr) => {
    const date = new Date(dateStr);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const ProductionForm = ({ initialValues, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const formik = useFormik({
        initialValues: {
            production_start_date: initialValues.production_start_date ? convertToInputDateFormat(new Date(initialValues.production_start_date).toLocaleDateString()) : '',
            production_end_date: initialValues.production_end_date ? convertToInputDateFormat(new Date(initialValues.production_end_date).toLocaleDateString()) : '',
            request_status: initialValues.request_status || ''
        },
        validationSchema: Yup.object({
            production_start_date: Yup.date().min(today, 'Start date cannot be in the past').required('Required.'),
            production_end_date: Yup.date().required('Required.'),
            request_status: Yup.string()
                .required('Required'),
        }),
        onSubmit: async (values) => {
            setOpen(false);
            setLoading(true);
            const formattedValues = {
                ...values,
            };
            
            await onSubmit(formattedValues);
            setLoading(false);
        },
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <Typography align='center' variant='h4' gutterBottom>Production Form</Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
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

                <CustomTextField
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

                <CustomTextField
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
                    <CustomMenuItem value="production">Production</CustomMenuItem>
                    <CustomMenuItem value="payment">Payment</CustomMenuItem>
                    <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                </CustomTextField>

                <CustomButton1 variant="contained" onClick={handleClickOpen} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                </CustomButton1>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to submit this form?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <CustomButton1 onClick={handleClose} color="primary">
                        Cancel
                    </CustomButton1>
                    <CustomButton1 onClick={formik.handleSubmit} color="primary" autoFocus>
                        Confirm
                    </CustomButton1>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductionForm;
