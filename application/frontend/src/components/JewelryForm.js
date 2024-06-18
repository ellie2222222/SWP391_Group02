import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia } from '@mui/material';
import * as Yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const JewelryForm = ({ initialValues, onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState(initialValues.images || '');

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
                if (key === 'image') {
                    if (values.image) {
                        formData.append('image', values.image);
                    }
                } else {
                    formData.append(key, values[key]);
                }
            });

            onSubmit(formData);
            console.log(values);
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
            sale_percentage: Yup.number().typeError("Must be a number")
        }),
    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue("image", file);
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                {selectedImage ? (
                    <Box sx={{ mt: 2 }}>
                        <CardMedia
                            component="img"
                            alt="Selected"
                            image={selectedImage}
                            sx={{ width: '100%', maxHeight: '300px' }}
                        />
                    </Box>
                ) : 
                <></>
                }
                {formik.errors.image && (
                    <Typography variant="caption" color="red">{formik.errors.image}</Typography>
                )}
                <Button variant="contained" component="label">
                    <AddPhotoAlternateIcon />
                    Upload Image
                    <input
                        type="file"
                        hidden
                        onChange={handleImageChange}
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
