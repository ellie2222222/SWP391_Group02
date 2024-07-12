import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import * as Yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';

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

const CustomButton = styled(Button)({
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

const CustomFormControl = styled(FormControl)({
    "& .MuiInputLabel-root": {
        fontSize: "1.3rem",
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
    "& .MuiOutlinedInput-root": {
        fontSize: "1.3rem",
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#b48c72",
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

const CustomFormControlLabel = styled(FormControlLabel)({
    "& .MuiFormControlLabel-label": {
        fontSize: "1.3rem",
    }
})

const CustomMenuItem = styled(MenuItem)({
    fontSize: '1.3rem',
})

const JewelryForm = ({ initialValues, onSubmit }) => {
    const { user } = useAuth();
    const [selectedImages, setSelectedImages] = useState(initialValues.images || []);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [gemstones, setGemstones] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [gemstonePrice, setGemstonePrice] = useState(0);
    const [materialPrice, setMaterialPrice] = useState(0);
    const [subGemstonePrice, setSubGemstonePrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [gemstonesRes, materialsRes] = await Promise.all([
                    axiosInstance.get('/gemstones'),
                    axiosInstance.get('/materials')
                ]);

                setGemstones(gemstonesRes.data);
                setMaterials(materialsRes.data);
            } catch (error) {
                console.error('Failed to fetch options', error);
            }
        };

        fetchOptions();
    }, []);

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            images: initialValues.images || [],
            available: initialValues.available ?? false,
            gemstone_id: initialValues.gemstone_id ?? '',
            subgemstone_id: initialValues.subgemstone_id ?? '',
            subgemstone_quantity: initialValues.subgemstone_quantity ?? 0,
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Required."),
            description: Yup.string().required("Required."),
            price: Yup.number().required("Required.").typeError("Must be a number"),
            gemstone_id: Yup.string().nullable(),
            subgemstone_id: Yup.string().nullable(),
            subgemstone_quantity: Yup.number().typeError("Must be a number").nullable(),
            material_id: Yup.string().required("Required."),
            material_weight: Yup.number().required("Required.").typeError("Must be a number"),
            category: Yup.string().required("Required."),
            type: Yup.string().required("Required."),
            on_sale: Yup.boolean(),
            sale_percentage: Yup.number().typeError("Must be a number"),
            available: Yup.boolean(),
        }),
        onSubmit: async (values) => {
            setOpen(false);
            setLoading(true);
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

            removedImages.forEach((image) => {
                formData.append('removedImages', image);
            });

            try {
                await onSubmit(formData);
                toast.success(`${initialValues._id ? 'Updated' : 'Added'} successfully!`);
                setLoading(false);
            } catch (error) {
                toast.error('Error submitting form');
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        const gemstone = gemstones.find(g => g._id === formik.values.gemstone_id);
        if (gemstone) {
            setGemstonePrice(gemstone?.price);
        } else {
            setGemstonePrice(0);
        }

        const subGemstone = gemstones.find(g => g._id === formik.values.subgemstone_id);
        if (subGemstone) {
            setSubGemstonePrice(subGemstone?.price * formik.values.subgemstone_quantity);
        } else {
            setSubGemstonePrice(0);
        }

        const material = materials.find(m => m._id === formik.values.material_id);
        if (material) {
            setMaterialPrice(material?.sell_price * formik.values.material_weight);
        } else {
            setMaterialPrice(0);
        }

        formik.setFieldValue('price', gemstonePrice + subGemstonePrice + materialPrice);
    }, [formik.values.gemstone_id, formik.values.subgemstone_id, formik.values.subgemstone_quantity, formik.values.material_id, formik.values.material_weight, gemstones, materials, gemstonePrice, subGemstonePrice, materialPrice]);

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
            setSelectedFiles([...selectedFiles, ...results.map(result => result.file)]);
        });
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = selectedImages[index];
        const newSelectedImages = selectedImages.filter((_, i) => i !== index);
        const newFiles = selectedFiles.filter((_, i) => i !== index);

        setSelectedImages(newSelectedImages);
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
    const handleDeleteOpen = (index) => {
        setDeleteIndex(index);
        setOpenDeleteDialog(true);
    };
    
    const handleDeleteClose = () => {
        setOpenDeleteDialog(false);
        setDeleteIndex(null);
    };
    
    const handleConfirmDelete = () => {
        const imageToRemove = selectedImages[deleteIndex];
        const newSelectedImages = selectedImages.filter((_, i) => i !== deleteIndex);
        const newFiles = selectedFiles.filter((_, i) => i !== deleteIndex);
    
        setSelectedImages(newSelectedImages);
        setSelectedFiles(newFiles);
    
        if (typeof imageToRemove === 'string') {
            setRemovedImages([...removedImages, imageToRemove]);
        }
        toast.success('Image removed successfully!');
        handleDeleteClose();
    };


    return (
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom align="center">
          {initialValues._id ? "Edit Jewelry" : "Add Jewelry"}
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
        >
          <React.Fragment>
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
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              multiline
              rows={4}
            />
            <CustomFormControl fullWidth>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
              >
                <CustomMenuItem value="Ring">Ring</CustomMenuItem>
                <CustomMenuItem value="Necklace">Necklace</CustomMenuItem>
                <CustomMenuItem value="Bracelet">Bracelet</CustomMenuItem>
                <CustomMenuItem value="Earring">Earring</CustomMenuItem>
                <CustomMenuItem value="Other">Other</CustomMenuItem>
              </Select>
              {formik.touched.category && formik.errors.category && (
                <Typography variant="caption" color="red">
                  {formik.errors.category}
                </Typography>
              )}
            </CustomFormControl>
            <CustomFormControl fullWidth>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                label="Type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <CustomMenuItem value="Custom">Custom</CustomMenuItem>
                <CustomMenuItem value="Sample">Sample</CustomMenuItem>
              </Select>
              {formik.touched.type && formik.errors.type && (
                <Typography variant="caption" color="red">
                  {formik.errors.type}
                </Typography>
              )}
            </CustomFormControl>
            <CustomTextField
              name="material_weight"
              label="Material Weight"
              variant="outlined"
              value={formik.values.material_weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.material_weight &&
                Boolean(formik.errors.material_weight)
              }
              helperText={
                formik.touched.material_weight && formik.errors.material_weight
              }
            />
            <CustomFormControl fullWidth>
              <InputLabel id="material-label">Material</InputLabel>
              <Select
                labelId="material-label"
                label="Material"
                name="material_id"
                value={formik.values.material_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.material_id &&
                  Boolean(formik.errors.material_id)
                }
              >
                {materials.map((material) => (
                  <CustomMenuItem key={material._id} value={material._id}>
                    {material.name}
                  </CustomMenuItem>
                ))}
              </Select>
              {formik.touched.material_id && formik.errors.material_id && (
                <Typography variant="caption" color="red">
                  {formik.errors.material_id}
                </Typography>
              )}
            </CustomFormControl>
            <CustomFormControl fullWidth>
              <InputLabel id="gemstone-label">Gemstone</InputLabel>
              <Select
                labelId="gemstone-label"
                label="Gemstone"
                name="gemstone_id"
                value={formik.values.gemstone_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.gemstone_id &&
                  Boolean(formik.errors.gemstone_id)
                }
              >
                {gemstones.map((gemstone) => (
                  <CustomMenuItem key={gemstone._id} value={gemstone._id}>
                    {gemstone.name} - Carat: {gemstone.carat} - Cut:{" "}
                    {gemstone.cut} - Clarity: {gemstone.clarity} - Color:{" "}
                    {gemstone.color}
                  </CustomMenuItem>
                ))}
              </Select>
              {formik.touched.gemstone_id && formik.errors.gemstone_id && (
                <Typography variant="caption" color="red">
                  {formik.errors.gemstone_id}
                </Typography>
              )}
            </CustomFormControl>
            <CustomFormControl fullWidth>
              <InputLabel id="subgemstone-label">Subgemstone</InputLabel>
              <Select
                labelId="subgemstone-label"
                label="Subgemstone"
                name="subgemstone_id"
                value={formik.values.subgemstone_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.subgemstone_id &&
                  Boolean(formik.errors.subgemstone_id)
                }
              >
                {gemstones.map((subgemstone) => (
                  <CustomMenuItem key={subgemstone._id} value={subgemstone._id}>
                    {subgemstone.name} - Carat: {subgemstone.carat} - Cut:{" "}
                    {subgemstone.cut} - Clarity: {subgemstone.clarity} - Color:{" "}
                    {subgemstone.color}
                  </CustomMenuItem>
                ))}
              </Select>
              {formik.touched.subgemstone_id &&
                formik.errors.subgemstone_id && (
                  <Typography variant="caption" color="red">
                    {formik.errors.subgemstone_id}
                  </Typography>
                )}
            </CustomFormControl>
            <CustomTextField
              name="subgemstone_quantity"
              label="Subgemstone Quantity"
              variant="outlined"
              value={formik.values.subgemstone_quantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.subgemstone_quantity &&
                Boolean(formik.errors.subgemstone_quantity)
              }
              helperText={
                formik.touched.subgemstone_quantity &&
                formik.errors.subgemstone_quantity
              }
            />
            <CustomTextField
              name="price"
              label="Price"
              variant="outlined"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{
                readOnly: true,
              }}
            />
            <CustomFormControlLabel
              control={
                <CustomSwitch
                  name="available"
                  checked={formik.values.available}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
              label="Available"
            />
            <CustomFormControlLabel
              control={
                <CustomSwitch
                  name="on_sale"
                  checked={formik.values.on_sale}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }
              label="On Sale"
            />
            {formik.values.on_sale && (
              <CustomTextField
                name="sale_percentage"
                label="Sale Percentage"
                variant="outlined"
                value={formik.values.sale_percentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.sale_percentage &&
                  Boolean(formik.errors.sale_percentage)
                }
                helperText={
                  formik.touched.sale_percentage &&
                  formik.errors.sale_percentage
                }
              />
            )}
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Images
              </Typography>
              <Grid container spacing={2} mb={2}>
                {selectedImages.map((image, index) => (
                  <Grid
                    item
                    key={index}
                    xs={4}
                    md={3}
                    sx={{ position: "relative" }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia
                        component="img"
                        src={
                          typeof image === "string"
                            ? image
                            : URL.createObjectURL(image)
                        }
                        alt={`Selected image ${index + 1}`}
                        height="auto"
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                      <CustomIconButton
                        onClick={() => handleDeleteOpen(index)}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <DeleteIcon />
                      </CustomIconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <CustomButton
                  variant="contained"
                  component="span"
                  startIcon={<AddPhotoAlternateIcon />}
                  fullWidth
                >
                  Upload Images
                </CustomButton>
              </label>
            </Box>
            <CustomButton
              variant="contained"
              onClick={handleClickOpen}
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : initialValues._id ? (
                "Update Jewelry"
              ) : (
                "Add Jewelry"
              )}
            </CustomButton>
          </React.Fragment>
        </Box>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">
            {"Confirm Submission"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              Are you sure you want to submit this form?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleClose} color="primary">
              Cancel
            </CustomButton>
            <CustomButton
              onClick={formik.handleSubmit}
              color="primary"
              autoFocus
            >
              Confirm
            </CustomButton>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteClose}
          aria-labelledby="confirm-delete-dialog-title"
          aria-describedby="confirm-delete-dialog-description"
        >
          <DialogTitle id="confirm-delete-dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-delete-dialog-description">
              Are you sure you want to delete this image?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <CustomButton onClick={handleDeleteClose} color="primary">
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handleConfirmDelete}
              color="primary"
              autoFocus
            >
              Confirm
            </CustomButton>
          </DialogActions>
        </Dialog>

        <ToastContainer />
      </Container>
    );
};

export default JewelryForm;
