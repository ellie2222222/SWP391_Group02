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
    fontSize: "1.3rem",
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
  backgroundColor: '#b48c72', // button background color
  '&:hover': {
    backgroundColor: '#a57d65', // button background color on hover
  },
});

const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
})

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
      <Typography variant="h4" gutterBottom align='center'>
        {initialValues._id ? 'Edit Gemstone' : 'Add Gemstone'}
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
            <CustomMenuItem value="Excellent">Excellent</CustomMenuItem>
            <CustomMenuItem value="Very Good">Very Good</CustomMenuItem>
            <CustomMenuItem value="Good">Good</CustomMenuItem>
            <CustomMenuItem value="Fair">Fair</CustomMenuItem>
            <CustomMenuItem value="Poor">Poor</CustomMenuItem>
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
            <CustomMenuItem value="Colorless">Colorless</CustomMenuItem>
            <CustomMenuItem value="Near Colorless">Near Colorless</CustomMenuItem>
            <CustomMenuItem value="Faint Yellow">Faint Yellow</CustomMenuItem>
            <CustomMenuItem value="Very Light Yellow">Very Light Yellow</CustomMenuItem>
            <CustomMenuItem value="Light Yellow">Light Yellow</CustomMenuItem>
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
