//admin blog edit and add form
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, Typography, IconButton, CardMedia, Grid } from '@mui/material';
import * as Yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import axios from 'axios'; // Make sure to import axios

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#b48c72',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#b48c72',
    },
    '& .MuiOutlinedInput-root': {
        fontSize: '1.3rem',
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
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
});

const CustomButton = styled(Button)({
    fontSize: '1.3rem',
    backgroundColor: '#b48c72',
    '&:hover': {
        backgroundColor: '#a57d65',
    },
});

const CustomIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#a57d65',
    },
});

const BlogForm = ({ initialValues = { blog_title: '', blog_content: '', blog_images: [] }, onSubmit }) => {
    const [selectedImages, setSelectedImages] = useState(initialValues.blog_images || []);
    const [newImages, setNewImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);

    useEffect(() => {
        setSelectedImages(initialValues.blog_images || []);
    }, [initialValues.blog_images]);

    const formik = useFormik({
        initialValues: {
            blog_title: initialValues.blog_title || '',
            blog_content: initialValues.blog_content || '',
            blog_images: initialValues.blog_images || [],
        },
        validationSchema: Yup.object({
            blog_title: Yup.string().required("Title is required."),
            blog_content: Yup.string().required("Content is required."),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key === 'blog_images') {
                    newImages.forEach((image) => {
                        formData.append('blog_images', image);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            imagesToDelete.forEach((image) => {
                formData.append('imagesToDelete', image);
            });

            return onSubmit(formData);
        },
    });

    const handleImageChange = (event) => {
        const files = event.currentTarget.files;
        const fileArray = Array.from(files);

        const readers = fileArray.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, url: reader.result });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(results => {
            const newSelectedImages = [...selectedImages, ...results.map(result => result.url)];
            setSelectedImages(newSelectedImages);
            setNewImages([...newImages, ...results.map(result => result.file)]);
        });
    };

    const handleRemoveImage = (index) => {
        const newSelectedImages = [...selectedImages];
        const removedImage = newSelectedImages.splice(index, 1)[0];
        setSelectedImages(newSelectedImages);
        
        if (typeof removedImage === 'string') {
            setImagesToDelete([...imagesToDelete, removedImage]);
        } else {
            const newImageIndex = newImages.findIndex(image => image.url === removedImage.url);
            if (newImageIndex !== -1) {
                const newImagesCopy = [...newImages];
                newImagesCopy.splice(newImageIndex, 1);
                setNewImages(newImagesCopy);
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom align='center'>
                {initialValues._id ? 'Edit Blog' : 'Create Blog'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
                    name="blog_title"
                    label="Title"
                    variant="outlined"
                    value={formik.values.blog_title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.blog_title && Boolean(formik.errors.blog_title)}
                    helperText={formik.touched.blog_title && formik.errors.blog_title}
                />
                <CustomTextField
                    name="blog_content"
                    label="Content"
                    variant="outlined"
                    multiline
                    rows={6}
                    value={formik.values.blog_content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.blog_content && Boolean(formik.errors.blog_content)}
                    helperText={formik.touched.blog_content && formik.errors.blog_content}
                />
                {selectedImages.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {selectedImages.map((image, index) => (
                            <Grid item xs={6} key={index}>
                                <Box position="relative">
                                    <CardMedia
                                        component="img"
                                        alt={`Selected ${index}`}
                                        image={typeof image === 'string' ? image : image.url}
                                        sx={{ right: 4, left: 4, width: '100%', maxHeight: '150px' }}
                                    />
                                    <CustomIconButton
                                        aria-label="delete"
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        }}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </CustomIconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
                {formik.errors.blog_images && (
                    <Typography variant="caption" color="red">{formik.errors.blog_images}</Typography>
                )}
                <CustomButton variant="contained" component="label" sx={{ mt: 2, display: 'flex', gap: '1em', alignItems: 'center' }}>
                    <AddPhotoAlternateIcon fontSize='large' />Upload Images
                    <input
                        type="file"
                        hidden
                        onChange={handleImageChange}
                        multiple
                    />
                </CustomButton>

                <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit
                </CustomButton>
            </Box>
        </Container>
    );
};

export default BlogForm;
