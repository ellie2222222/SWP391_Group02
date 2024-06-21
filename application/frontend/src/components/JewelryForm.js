import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia, Grid } from '@mui/material';
import * as Yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const JewelryForm = ({ initialValues, onSubmit }) => {
    const [selectedImages, setSelectedImages] = useState(initialValues.images || []);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            images: initialValues.images || [],
            available: initialValues.available ?? false,
        },
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key === 'images') {
                    values.images.forEach((image) => {
                        formData.append('images', image);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });
            console.log('Submitting:', formData);
            onSubmit(formData);
            return onSubmit(formData);
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required."),
            description: Yup.string().required("Required."),
            price: Yup.number().required("Required.").typeError("Must be a number"),
            gemstone_id: Yup.string(),
            gemstone_weight: Yup.number().typeError("Must be a number"),
            material_id: Yup.string().required("Required."),
            material_weight: Yup.number().required("Required.").typeError("Must be a number"),
            category: Yup.string().required("Required."),
            type: Yup.string().required("Required."),
            on_sale: Yup.boolean(),
            sale_percentage: Yup.number().typeError("Must be a number"),
            available: Yup.boolean(),
        }),
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
            const newSelectedImages = results.map(result => result.url);
            setSelectedImages([...selectedImages, ...newSelectedImages]);
            formik.setFieldValue("images", [...formik.values.images, ...results.map(result => result.file)]);
        });
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {initialValues._id ? 'Edit Jewelry' : 'Add Jewelry'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <TextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <TextField
                    name="price"
                    label="Price"
                    type="number"
                    variant="outlined"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.price && Boolean(formik.errors.price)}
                    helperText={formik.touched.price && formik.errors.price}
                />
                <TextField
                    name="gemstone_id"
                    label="Gemstone ID"
                    variant="outlined"
                    value={formik.values.gemstone_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gemstone_id && Boolean(formik.errors.gemstone_id)}
                    helperText={formik.touched.gemstone_id && formik.errors.gemstone_id}
                />
                <TextField
                    name="gemstone_weight"
                    label="Gemstone Weight"
                    type="number"
                    variant="outlined"
                    value={formik.values.gemstone_weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gemstone_weight && Boolean(formik.errors.gemstone_weight)}
                    helperText={formik.touched.gemstone_weight && formik.errors.gemstone_weight}
                />
                <TextField
                    name="material_id"
                    label="Material ID"
                    variant="outlined"
                    value={formik.values.material_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.material_id && Boolean(formik.errors.material_id)}
                    helperText={formik.touched.material_id && formik.errors.material_id}
                />
                <TextField
                    name="material_weight"
                    label="Material Weight"
                    type="number"
                    variant="outlined"
                    value={formik.values.material_weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.material_weight && Boolean(formik.errors.material_weight)}
                    helperText={formik.touched.material_weight && formik.errors.material_weight}
                />
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Category"
                        error={formik.touched.category && Boolean(formik.errors.category)}
                    >
                        <MenuItem value="Ring">Ring</MenuItem>
                        <MenuItem value="Necklace">Necklace</MenuItem>
                        <MenuItem value="Bracelet">Bracelet</MenuItem>
                        <MenuItem value="Earring">Earring</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                        <Typography variant="caption" color="red">{formik.errors.category}</Typography>
                    )}
                </FormControl>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="type-label">Type</InputLabel>
                    <Select
                        labelId="type-label"
                        name="type"
                        value={formik.values.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Type"
                        error={formik.touched.type && Boolean(formik.errors.type)}
                    >
                        <MenuItem value="Sample">Sample</MenuItem>
                        <MenuItem value="Custom">Custom</MenuItem>
                    </Select>
                    {formik.touched.type && formik.errors.type && (
                        <Typography variant="caption" color="red">{formik.errors.type}</Typography>
                    )}
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.on_sale}
                            onChange={formik.handleChange}
                            name="on_sale"
                            color="primary"
                        />
                    }
                    label="On Sale"
                />
                <TextField
                    name="sale_percentage"
                    label="Sale Percentage"
                    type="number"
                    variant="outlined"
                    value={formik.values.sale_percentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.sale_percentage && Boolean(formik.errors.sale_percentage)}
                    helperText={formik.touched.sale_percentage && formik.errors.sale_percentage}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formik.values.available}
                            onChange={formik.handleChange}
                            name="available"
                            color="primary"
                        />
                    }
                    label="Available"
                />
                {selectedImages.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {selectedImages.map((image, index) => (
                            <Grid item xs={6} key={index}>
                                <CardMedia
                                    component="img"
                                    alt={`Selected ${index}`}
                                    image={image}
                                    sx={{ width: '100%', maxHeight: '150px' }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
                {formik.errors.images && (
                    <Typography variant="caption" color="red">{formik.errors.images}</Typography>
                )}
                <Button variant="contained" component="label" sx={{ mt: 2 }}>
                    <AddPhotoAlternateIcon />
                    Upload Images
                    <input
                        type="file"
                        hidden
                        onChange={handleImageChange}
                        multiple
                    />
                </Button>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </Button>
            </Box>
        </Container>
    );
};

export default JewelryForm;
