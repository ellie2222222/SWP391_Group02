import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, CardMedia, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import axiosInstance from '../utils/axiosInstance';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const validationSchema = Yup.object({
    request_status: Yup.string().required('Status is required'),
});

export default function DesignForm({ initialValues, onSubmit }) {
    const [images, setImages] = useState(initialValues.jewelry_id.images || []);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [imageIndexToRemove, setImageIndexToRemove] = useState(null);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
        },
        validationSchema,
        onSubmit: async (values) => {
            const formData = new FormData();

            // Append new image files
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            // Append existing image URLs
            images.forEach((image, index) => {
                if (typeof image === 'string') {
                    formData.append('images', image);
                }
            });

            // Append removed images
            removedImages.forEach((image, index) => {
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

                toast.success('Form submitted successfully!');
                onSubmit();
            } catch (error) {
                toast.error(`Error submitting form: ${error.response?.data?.error || error.message}`);
                console.error('Error submitting form', error);
            }
        },
    });

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRemoveImage = (index) => {
        setImageIndexToRemove(index);
        setOpenConfirmDialog(true);
    };

    const confirmRemoveImage = () => {
        const imageToRemove = images[imageIndexToRemove];
        const newImages = images.filter((_, i) => i !== imageIndexToRemove);
        const newFiles = selectedFiles.filter((_, i) => i !== imageIndexToRemove);

        setImages(newImages);
        setSelectedFiles(newFiles);

        if (typeof imageToRemove === 'string') {
            setRemovedImages([...removedImages, imageToRemove]);
        }

        setOpenConfirmDialog(false);
        setImageIndexToRemove(null);
        toast.info('Image removed.');
    };

    const cancelRemoveImage = () => {
        setOpenConfirmDialog(false);
        setImageIndexToRemove(null);
    };

    return (
        <Container>
            <ToastContainer />
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
                            <MenuItem value="design">Design</MenuItem>
                            <MenuItem value="production">Complete Design</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </Select>
                        {formik.touched.request_status && formik.errors.request_status && (
                            <Typography color="error">{formik.errors.request_status}</Typography>
                        )}
                    </FormControl>
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <CustomButton1 type="submit">Submit</CustomButton1>
                </Box>
            </form>

            <Dialog
                open={openConfirmDialog}
                onClose={cancelRemoveImage}
            >
                <DialogTitle>Remove Image</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove this image?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelRemoveImage} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmRemoveImage} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
