import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia, Grid } from '@mui/material';
import * as Yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#b48c72',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#b48c72',
    },
    '& .MuiOutlinedInput-root': {
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
});

const CustomButton = styled(Button)({
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

const CustomSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#b48c72',
        '&:hover': {
            backgroundColor: 'rgba(180, 140, 114, 0.08)',
        },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#b48c72',
    },
});

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

    const handleRemoveImage = (index) => {
        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
        const newImages = formik.values.images.filter((_, i) => i !== index);
        setSelectedImages(newSelectedImages);
        formik.setFieldValue("images", newImages);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                {initialValues._id ? 'Edit Jewelry' : 'Add Jewelry'}
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
                <CustomTextField
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <CustomTextField
                    name="description"
                    label="Description"
                    variant="outlined"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <CustomTextField
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
                <CustomTextField
                    name="gemstone_id"
                    label="Gemstone ID"
                    variant="outlined"
                    value={formik.values.gemstone_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.gemstone_id && Boolean(formik.errors.gemstone_id)}
                    helperText={formik.touched.gemstone_id && formik.errors.gemstone_id}
                />
                <CustomTextField
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
                <CustomTextField
                    name="material_id"
                    label="Material ID"
                    variant="outlined"
                    value={formik.values.material_id}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.material_id && Boolean(formik.errors.material_id)}
                    helperText={formik.touched.material_id && formik.errors.material_id}
                />
                <CustomTextField
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
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: formik.touched.category && formik.errors.category ? 'red' : '#b48c72' } }}
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
                        sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: formik.touched.type && formik.errors.type ? 'red' : '#b48c72' } }}
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
                        <CustomSwitch
                            checked={formik.values.on_sale}
                            onChange={formik.handleChange}
                            name="on_sale"
                        />
                    }
                    label="On Sale"
                />
                <CustomTextField
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
                        <CustomSwitch
                            checked={formik.values.available}
                            onChange={formik.handleChange}
                            name="available"
                        />
                    }
                    label="Available"
                />
                {selectedImages.length > 0 && (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {selectedImages.map((image, index) => (
                            <Grid item xs={6} key={index}>
                                <Box position="relative">
                                    <CardMedia
                                        component="img"
                                        alt={`Selected ${index}`}
                                        image={image}
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
                {formik.errors.images && (
                    <Typography variant="caption" color="red">{formik.errors.images}</Typography>
                )}
                <CustomButton variant="contained" component="label" sx={{ mt: 2, display: 'flex', gap: '1em', alignItems: 'center' }}>
                    <AddPhotoAlternateIcon />
                    <Typography variant='body1'>Upload Images</Typography>
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

export default JewelryForm;
