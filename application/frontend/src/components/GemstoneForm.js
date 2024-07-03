import React from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#b48c72', // focused label color
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#b48c72', // underline color after focus
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#b48c72', // outline color
    },
    '&:hover fieldset': {
      borderColor: '#b48c72', // outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b48c72', // outline color when focused
    },
  },
});

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72', // button background color
  '&:hover': {
    backgroundColor: '#a57d65', // button background color on hover
  },
});

const GemstoneForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values) => {
        onSubmit(values);
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Diamond Name is required'),
      price: Yup.number().positive('Price must be positive').required('Diamond Price is required'),
      carat: Yup.number().positive('Carat must be positive').required('Carat is required'),
      cut: Yup.string().oneOf(['Excellent', 'Very Good', 'Good', 'Fair', 'Poor'], 'Invalid Cut').required('Cut is required'),
      clarity: Yup.string().oneOf(['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'], 'Invalid Clarity').required('Clarity is required'),
      color: Yup.string().oneOf(['Colorless', 'Near Colorless', 'Faint Yellow', 'Very Light Yellow', 'Light Yellow'], 'Invalid Color').required('Color is required'),
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Diamond
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomTextField
          name="name"
          label="Diamond Name"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <CustomTextField
          name="price"
          label="Diamond Price"
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
        <FormControl variant="outlined" fullWidth>
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
            <MenuItem value="Excellent">Excellent</MenuItem>
            <MenuItem value="Very Good">Very Good</MenuItem>
            <MenuItem value="Good">Good</MenuItem>
            <MenuItem value="Fair">Fair</MenuItem>
            <MenuItem value="Poor">Poor</MenuItem>
          </Select>
          {formik.touched.cut && formik.errors.cut && (
            <Typography variant="caption" color="red">{formik.errors.cut}</Typography>
          )}
        </FormControl>
        <FormControl variant="outlined" fullWidth>
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
            <MenuItem value="FL">FL</MenuItem>
            <MenuItem value="IF">IF</MenuItem>
            <MenuItem value="VVS1">VVS1</MenuItem>
            <MenuItem value="VVS2">VVS2</MenuItem>
            <MenuItem value="VS1">VS1</MenuItem>
            <MenuItem value="VS2">VS2</MenuItem>
            <MenuItem value="SI1">SI1</MenuItem>
            <MenuItem value="SI2">SI2</MenuItem>
            <MenuItem value="I1">I1</MenuItem>
            <MenuItem value="I2">I2</MenuItem>
            <MenuItem value="I3">I3</MenuItem>
          </Select>
          {formik.touched.clarity && formik.errors.clarity && (
            <Typography variant="caption" color="red">{formik.errors.clarity}</Typography>
          )}
        </FormControl>
        <FormControl variant="outlined" fullWidth>
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
            <MenuItem value="Colorless">Colorless</MenuItem>
            <MenuItem value="Near Colorless">Near Colorless</MenuItem>
            <MenuItem value="Faint Yellow">Faint Yellow</MenuItem>
            <MenuItem value="Very Light Yellow">Very Light Yellow</MenuItem>
            <MenuItem value="Light Yellow">Light Yellow</MenuItem>
          </Select>
          {formik.touched.color && formik.errors.color && (
            <Typography variant="caption" color="red">{formik.errors.color}</Typography>
          )}
        </FormControl>
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default GemstoneForm;
