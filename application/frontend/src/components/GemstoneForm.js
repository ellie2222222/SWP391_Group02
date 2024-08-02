import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography, Switch, FormControlLabel, IconButton, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';

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
    fontSize: '1.3rem',
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

const CustomButton = styled(Button)({
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
const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
});
const CustomIconButton = styled(IconButton)({
  color: '#b48c72',
  '&:hover': {
    color: '#a57d65',
  },
});

const GemstoneForm = ({ initialValues, onSubmit }) => {
  const [certificateImage, setCertificateImage] = useState(initialValues.certificate_image || '');
  const [removedImages, setRemovedImages] = useState([]);
  console.log(removedImages)
  console.log(certificateImage)
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      available: initialValues.available || false,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if(key !== 'certificate_image'){
        formData.append(key, values[key])};
      });
      if (certificateImage) {
        formData.append('certificate_image', certificateImage);
      }
      if (removedImages.length > 0) {
        formData.append('removedImages', removedImages);
      }
      onSubmit(formData);
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Gemstone Name is required'),
      price: Yup.number().positive('Price must be positive').required('Diamond Price is required'),
      carat: Yup.number().positive('Carat must be positive').required('Carat is required'),
      cut: Yup.string().required('Cut is required'),
      clarity: Yup.string().required('Clarity is required'),
      color: Yup.string().required('Color is required'),
      fluorescence: Yup.string().required('Fluorescence is required'),
      measurements: Yup.string().required('Measurements are required'),
      polish: Yup.string().required('Polish is required'),
      symmetry: Yup.string().required('Symmetry is required'),
      comments: Yup.string().optional(),
    }),
  });
  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    setCertificateImage(file);
  };

  const handleRemoveImage = () => {
    setRemovedImages((prev) => [...prev, certificateImage]);
    setCertificateImage('');
  };
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align='center'>
        {initialValues._id ? 'Edit Gemstone' : 'Add Gemstone'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomTextField
          name="name"
          label="Gemstone Name"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <CustomTextField
          name="price"
          label="Gemstone Price"
          variant="outlined"
          type="number"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.price && Boolean(formik.errors.price)}
          helperText={formik.touched.price && formik.errors.price}
        />
        <CustomTextField
          name="carat"
          label="Carat"
          variant="outlined"
          type="number"
          value={formik.values.carat}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.carat && Boolean(formik.errors.carat)}
          helperText={formik.touched.carat && formik.errors.carat}
        />
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="cut-label">Cut</InputLabel>
          <Select
            labelId="cut-label"
            name="cut"
            value={formik.values.cut}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Cut"
            error={formik.touched.cut && Boolean(formik.errors.cut)}
          >
            <CustomMenuItem value="Round">Round</CustomMenuItem>
            <CustomMenuItem value="Princess">Princess</CustomMenuItem>
            <CustomMenuItem value="Emerald">Emerald</CustomMenuItem>
            <CustomMenuItem value="Asscher">Asscher</CustomMenuItem>
            <CustomMenuItem value="Marquise">Marquise</CustomMenuItem>
            <CustomMenuItem value="Oval">Oval</CustomMenuItem>
            <CustomMenuItem value="Radiant">Radiant</CustomMenuItem>
            <CustomMenuItem value="Pear">Pear</CustomMenuItem>
            <CustomMenuItem value="Heart">Heart</CustomMenuItem>
            <CustomMenuItem value="Cushion">Cushion</CustomMenuItem>
            <CustomMenuItem value="Other">Other</CustomMenuItem>
          </Select>
          {formik.touched.cut && formik.errors.cut && (
            <Typography variant="caption" color="red">{formik.errors.cut}</Typography>
          )}
        </CustomFormControl>
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="clarity-label">Clarity</InputLabel>
          <Select
            labelId="clarity-label"
            name="clarity"
            value={formik.values.clarity}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Clarity"
            error={formik.touched.clarity && Boolean(formik.errors.clarity)}
          >
            <CustomMenuItem value="FL">FL</CustomMenuItem>
            <CustomMenuItem value="IF">IF</CustomMenuItem>
            <CustomMenuItem value="VVS1">VVS1</CustomMenuItem>
            <CustomMenuItem value="VVS2">VVS2</CustomMenuItem>
            <CustomMenuItem value="VS1">VS1</CustomMenuItem>
            <CustomMenuItem value="VS2">VS2</CustomMenuItem>
            <CustomMenuItem value="SI1">SI1</CustomMenuItem>
            <CustomMenuItem value="SI2">SI2</CustomMenuItem>
            <CustomMenuItem value="I1">I1</CustomMenuItem>
            <CustomMenuItem value="I2">I2</CustomMenuItem>
            <CustomMenuItem value="I3">I3</CustomMenuItem>
            <CustomMenuItem value="Other">Other</CustomMenuItem>
          </Select>
          {formik.touched.clarity && formik.errors.clarity && (
            <Typography variant="caption" color="red">{formik.errors.clarity}</Typography>
          )}
        </CustomFormControl>
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="color-label">Color</InputLabel>
          <Select
            labelId="color-label"
            name="color"
            value={formik.values.color}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Color"
            error={formik.touched.color && Boolean(formik.errors.color)}
          >
            <CustomMenuItem value="Colorless">Colorless</CustomMenuItem>
            <CustomMenuItem value="Near Colorless">Near Colorless</CustomMenuItem>
            <CustomMenuItem value="Faint Yellow">Faint Yellow</CustomMenuItem>
            <CustomMenuItem value="Very Light Yellow">Very Light Yellow</CustomMenuItem>
            <CustomMenuItem value="Light Yellow">Light Yellow</CustomMenuItem>
            <CustomMenuItem value="Red">Red</CustomMenuItem>
            <CustomMenuItem value="Orange">Orange</CustomMenuItem>
            <CustomMenuItem value="Green">Green</CustomMenuItem>
            <CustomMenuItem value="Blue">Blue</CustomMenuItem>
            <CustomMenuItem value="Yellow">Yellow</CustomMenuItem>
            <CustomMenuItem value="Purple">Purple</CustomMenuItem>
            <CustomMenuItem value="Pink">Pink</CustomMenuItem>
            <CustomMenuItem value="Brown">Brown</CustomMenuItem>
            <CustomMenuItem value="Black">Black</CustomMenuItem>
            <CustomMenuItem value="White">White</CustomMenuItem>
          </Select>
          {formik.touched.color && formik.errors.color && (
            <Typography variant="caption" color="red">{formik.errors.color}</Typography>
          )}
        </CustomFormControl>
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="fluorescence-label">Fluorescence</InputLabel>
          <Select
            labelId="fluorescence-label"
            name="fluorescence"
            value={formik.values.fluorescence}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Fluorescence"
            error={formik.touched.fluorescence && Boolean(formik.errors.fluorescence)}
          >
            <CustomMenuItem value="None">None</CustomMenuItem>
            <CustomMenuItem value="Faint">Faint</CustomMenuItem>
            <CustomMenuItem value="Medium">Medium</CustomMenuItem>
            <CustomMenuItem value="Strong">Strong</CustomMenuItem>
            <CustomMenuItem value="Very Strong">Very Strong</CustomMenuItem>
          </Select>
          {formik.touched.fluorescence && formik.errors.fluorescence && (
            <Typography variant="caption" color="red">{formik.errors.fluorescence}</Typography>
          )}
        </CustomFormControl>
        <CustomTextField
          name="measurements"
          label="Measurements"
          variant="outlined"
          value={formik.values.measurements}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.measurements && Boolean(formik.errors.measurements)}
          helperText={formik.touched.measurements && formik.errors.measurements}
        />
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="polish-label">Polish</InputLabel>
          <Select
            labelId="polish-label"
            name="polish"
            value={formik.values.polish}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Polish"
            error={formik.touched.polish && Boolean(formik.errors.polish)}
          >
            <CustomMenuItem value="Excellent">Excellent</CustomMenuItem>
            <CustomMenuItem value="Very Good">Very Good</CustomMenuItem>
            <CustomMenuItem value="Good">Good</CustomMenuItem>
            <CustomMenuItem value="Fair">Fair</CustomMenuItem>
            <CustomMenuItem value="Poor">Poor</CustomMenuItem>
          </Select>
          {formik.touched.polish && formik.errors.polish && (
            <Typography variant="caption" color="red">{formik.errors.polish}</Typography>
          )}
        </CustomFormControl>
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="symmetry-label">Symmetry</InputLabel>
          <Select
            labelId="symmetry-label"
            name="symmetry"
            value={formik.values.symmetry}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Symmetry"
            error={formik.touched.symmetry && Boolean(formik.errors.symmetry)}
          >
            <CustomMenuItem value="Excellent">Excellent</CustomMenuItem>
            <CustomMenuItem value="Very Good">Very Good</CustomMenuItem>
            <CustomMenuItem value="Good">Good</CustomMenuItem>
            <CustomMenuItem value="Fair">Fair</CustomMenuItem>
            <CustomMenuItem value="Poor">Poor</CustomMenuItem>
          </Select>
          {formik.touched.symmetry && formik.errors.symmetry && (
            <Typography variant="caption" color="red">{formik.errors.symmetry}</Typography>
          )}
        </CustomFormControl>
        <CustomTextField
          name="comments"
          label="Comments"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.comments}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.comments && Boolean(formik.errors.comments)}
          helperText={formik.touched.comments && formik.errors.comments}
        />
        <FormControlLabel
          control={
            <CustomSwitch
              name="available"
              checked={formik.values.available}
              onChange={formik.handleChange}
              color="primary"
            />
          }
          label="Available"
          labelPlacement="end"
        />
        <FormControl fullWidth>

          {certificateImage && (
            <Box mt={2} position="relative" display="inline-block">
              <CardMedia
                component='img'
                src={typeof certificateImage === 'string' ? certificateImage : URL.createObjectURL(certificateImage)}
                alt="Certificate"
                sx={{ maxWidth: '100%', maxHeight: '400px' }}
              />
              <CustomIconButton
                size="small"
                color="secondary"
                onClick={handleRemoveImage}
                style={{ position: 'absolute', top: 0, right: 0 }}
              >
                <DeleteIcon />
              </CustomIconButton>

            </Box>
          )}
          <CustomButton
            component="label"
            sx={{ mt: 1 }}
          >
            Upload Certificate
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}

            />
          </CustomButton>
        </FormControl>
        <CustomButton type="submit" variant="contained" sx={{ mt: 1 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default GemstoneForm;
