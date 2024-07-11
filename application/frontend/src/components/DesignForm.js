import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, CardMedia, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import axiosInstance from '../utils/axiosInstance';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

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

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

const validationSchema = Yup.object({
    request_status: Yup.string().required('Status is required'),
});

export default function DesignForm({ initialValues, onSubmit }) {
    const [images, setImages] = useState(initialValues.jewelry_id.images || []);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
        },
        validationSchema,
        onSubmit: async (values) => {
            setOpen(false);
            setLoading(true);
            const formData = new FormData();

            // Append new image files
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            // Append existing image URLs
            images.forEach((image) => {
                if (typeof image === 'string') {
                    formData.append('images', image);
                }
            });

            // Append removed images
            removedImages.forEach((image) => {
                formData.append('removedImages', image);
            });

            formData.append('gemstone_id', initialValues.jewelry_id.gemstone_id._id);
            formData.append('material_id', initialValues.jewelry_id.material_id._id);
            Object.keys(initialValues.jewelry_id).forEach(key => {
                if (key !== 'images' && key !== 'gemstone_id' && key !== 'material_id') {
                    formData.append(key, initialValues.jewelry_id[key]);
                }
            });

            try {
                // Patch images and other jewelry data
                await axiosInstance.patch(`/jewelries/${initialValues.jewelry_id._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Patch status
                await axiosInstance.patch(`/requests/${initialValues._id}`, {
                    request_status: values.request_status,
                });

                toast.success('Form submitted successfully');
                setLoading(false);
                onSubmit();
            } catch (error) {
                toast.error('Error submitting form');
                setLoading(false);
            }
        },
    });

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = images[index];
        const newImages = images.filter((_, i) => i !== index);
        const newFiles = selectedFiles.filter((_, i) => i !== index);

        setImages(newImages);
        setSelectedFiles(newFiles);

        if (typeof imageToRemove === 'string') {
            setRemovedImages([...removedImages, imageToRemove]);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Container>
            <form onSubmit={formik.handleSubmit}>
                <CustomButton1 variant="contained" component="label" sx={{ mt: 2, display: 'flex', gap: '1em', alignItems: 'center' }}>
                    <AddPhotoAlternateIcon />
                    <Typography variant='body1'>Upload Images</Typography>
                    <input
                        type="file"
                        hidden
                        onChange={handleImageUpload}
                        multiple
                    />
                </CustomButton1>
                <Grid container spacing={2}>
                    {images.map((image, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <CardMedia
                                component="img"
                                alt="Jewelry"
                                image={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                sx={{ width: '100%', margin: '5px 0px' }}
                            />
                            <CustomButton1 variant="contained" color="secondary" onClick={() => handleRemoveImage(index)}>
                                Remove
                            </CustomButton1>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ marginTop: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Request Status</InputLabel>
                        <Select
                            labelId="status-label"
                            id="request_status"
                            name="request_status"
                            value={formik.values.request_status}
                            onChange={formik.handleChange}
                            error={formik.touched.request_status && Boolean(formik.errors.request_status)}
                        >
                            <CustomMenuItem value="design">Design</CustomMenuItem>
                            <CustomMenuItem value="production">Complete Design</CustomMenuItem>
                            <CustomMenuItem value="cancelled">Cancelled</CustomMenuItem>
                        </Select>
                        {formik.touched.request_status && formik.errors.request_status && (
                            <Typography color="error">{formik.errors.request_status}</Typography>
                        )}
                    </FormControl>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <CustomButton1 variant="contained" onClick={handleClickOpen} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </CustomButton1>
                </Box>
            </form>
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
}
