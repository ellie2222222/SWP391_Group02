import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Button, TextField, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { format, parseISO, addYears } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';

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

const WarrantyForm = ({ initialValues, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [warrantyStartDate, setWarrantyStartDate] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get(`/invoices/requests/${initialValues._id}`);
                const invoice = response.data.invoice
                if (invoice) {
                    setWarrantyStartDate(format(parseISO(invoice.createdAt), 'yyyy-MM-dd'));
                }
            } catch (error) {
                toast.error('Error while fetching invoice', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                });
            }
        };

        fetchInvoices();
    }, [initialValues._id]);

    let validationSchema;
    if (user.role === 'manager') {
        validationSchema = Yup.object({
            warranty_start_date: Yup.date(),
            warranty_end_date: Yup.date(),
            warranty_content: Yup.string(),
            request_status: Yup.string(),
            warranty_duration: Yup.number().min(1).required('Required.'),
        })
    } else {
        validationSchema = Yup.object({
            warranty_start_date: Yup.date().required('Required.'),
            warranty_end_date: Yup.date().required('Required.'),
            warranty_content: Yup.string().required('Required.'),
            request_status: Yup.string().required('Required.'),
            warranty_duration: Yup.number() .integer('Must be an integer')
            .min(1, 'Must be at least 1')
            .max(3, 'Must be at most 3')
            .required('Required.'),
        })
    }

    const formik = useFormik({
        initialValues: {
            warranty_start_date: warrantyStartDate || '',
            warranty_end_date: initialValues.warranty_end_date ? convertToInputDateFormat(new Date(initialValues.warranty_end_date).toLocaleDateString()) : '',
            request_status: initialValues.request_status || '',
            warranty_content: initialValues.warranty_content || '',
            warranty_duration: initialValues.warranty_duration || 1,
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
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

    useEffect(() => {
        if (formik.values.warranty_start_date && formik.values.warranty_duration) {
            const endDate = addYears(new Date(formik.values.warranty_start_date), formik.values.warranty_duration);
            formik.setFieldValue('warranty_end_date', format(endDate, 'yyyy-MM-dd'));
        }
    }, [formik.values.warranty_start_date, formik.values.warranty_duration]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <Typography variant='h4' align='center' gutterBottom>Warranty Form</Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
                    fullWidth
                    id="warranty_start_date"
                    name="warranty_start_date"
                    label="Warranty Start Date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: true,
                    }}
                    value={formik.values.warranty_start_date}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_start_date && Boolean(formik.errors.warranty_start_date)}
                    helperText={formik.touched.warranty_start_date && formik.errors.warranty_start_date}
                />

                <CustomTextField
                    fullWidth
                    id="warranty_duration"
                    name="warranty_duration"
                    label="Warranty Duration (Years)"
                    type="number"
                    value={formik.values.warranty_duration}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_duration && Boolean(formik.errors.warranty_duration)}
                    helperText={formik.touched.warranty_duration && formik.errors.warranty_duration}
                />

                <CustomTextField
                    fullWidth
                    id="warranty_end_date"
                    name="warranty_end_date"
                    label="Warranty End Date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        inputProps: {
                            min: formik.values.warranty_start_date,
                        },
                        readOnly: true,
                    }}
                    value={formik.values.warranty_end_date}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_end_date && Boolean(formik.errors.warranty_end_date)}
                    helperText={formik.touched.warranty_end_date && formik.errors.warranty_end_date}
                />

                <CustomTextField
                    fullWidth
                    id="warranty_content"
                    name="warranty_content"
                    label="Warranty Content"
                    value={formik.values.warranty_content}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_content && Boolean(formik.errors.warranty_content)}
                    helperText={formik.touched.warranty_content && formik.errors.warranty_content}
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
                    <CustomMenuItem value="warranty">Warranty</CustomMenuItem>
                    <CustomMenuItem value="completed">Completed</CustomMenuItem>
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
                <DialogTitle id="confirm-dialog-title">{"Confirm Submission"}</DialogTitle>
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
            {/* <ToastContainer /> */}
        </Container>
    );
};

export default WarrantyForm;
