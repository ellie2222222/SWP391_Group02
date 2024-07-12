import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, Button, TextField, MenuItem, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { format, parseISO } from 'date-fns';
import axiosInstance from '../utils/axiosInstance';

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

const WarrantyForm = ({ initialValues, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [warrantyStartDate, setWarrantyStartDate] = useState('');
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axiosInstance.get('/invoices');
                const invoice = response.data.invoices.find(invoice => invoice.transaction_id.request_id._id === initialValues._id);
                if (invoice) {
                    setWarrantyStartDate(format(parseISO(invoice.createdAt), 'yyyy-MM-dd'));
                }
            } catch (error) {
                toast.error('Error fetching invoice');
            }
        };

        fetchInvoices();
    }, [initialValues._id]);

    const formik = useFormik({
        initialValues: {
            warranty_start_date: warrantyStartDate || '',
            warranty_end_date: initialValues.warranty_end_date ? format(parseISO(initialValues.warranty_end_date), 'yyyy-MM-dd') : '',
            request_status: initialValues.request_status || '',
            warranty_content: `${initialValues.jewelry_id._id} ${initialValues.jewelry_id.name}` || ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            warranty_start_date: Yup.date().required('Required'),
            warranty_end_date: Yup.date()
                .required('Required')
                .when('warranty_start_date', (warranty_start_date, schema) => {
                    return warranty_start_date ? schema.min(warranty_start_date, 'End date cannot be before start date') : schema;
                }),
            request_status: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            setOpen(false);
            setLoading(true);
            const formattedValues = {
                ...values,
                warranty_start_date: format(parseISO(values.warranty_start_date), 'yyyy-MM-dd'),
                warranty_end_date: format(parseISO(values.warranty_end_date), 'yyyy-MM-dd'),
            };
            try {
                await onSubmit(formattedValues);
                toast.success('Form submitted successfully');
            } catch (error) {
                toast.error('Error submitting form');
            } finally {
                setLoading(false);
            }
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
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <TextField
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

                <TextField
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
                    }}
                    value={formik.values.warranty_end_date}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_end_date && Boolean(formik.errors.warranty_end_date)}
                    helperText={formik.touched.warranty_end_date && formik.errors.warranty_end_date}
                />

                <TextField
                    fullWidth
                    variant="filled"
                    id="warranty_content"
                    name="warranty_content"
                    label="Warranty Content"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    InputProps={{
                        readOnly: true,
                    }}
                    value={formik.values.warranty_content}
                    onChange={formik.handleChange}
                    error={formik.touched.warranty_content && Boolean(formik.errors.warranty_content)}
                    helperText={formik.touched.warranty_content && formik.errors.warranty_content}
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
                    <MenuItem value="warranty">Warranty</MenuItem>
                    <MenuItem value="complete">Complete</MenuItem>
                </TextField>

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
            <ToastContainer />
        </Container>
    );
};

export default WarrantyForm;
