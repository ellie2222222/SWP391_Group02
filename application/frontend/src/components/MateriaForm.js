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

const MaterialForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
    validationSchema: Yup.object({
      name: Yup.string().oneOf(['Silver', 'Platinum','Gold 18K','Gold 14K','Gold 10K','Gold 24K'], 'Invalid Material').required('Material is required'),
      buy_price: Yup.number().positive('Buy price must be positive').required('Buy price is required'),
      sell_price: Yup.number().positive('Sell price must be positive').required('Sell price required'),
      carat: Yup.number().positive('Carat must be positive').required('Carat is required'),
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Material
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="name-label">Material Name</InputLabel>
          <Select
            labelId="name-label"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Material Name"
            error={formik.touched.name && Boolean(formik.errors.name)}
          >
            <MenuItem value="Silver">Silver</MenuItem>
            <MenuItem value="Platinum">Platinum</MenuItem>
            <MenuItem value="Gold 18K">Gold 18K</MenuItem>
            <MenuItem value="Gold 14K">Gold 14K</MenuItem>
            <MenuItem value="Gold 10K">Gold 10K</MenuItem>
            <MenuItem value="Gold 24K">Gold 24K</MenuItem>
          </Select>
          {formik.touched.name && formik.errors.name && (
            <Typography variant="caption" color="red">{formik.errors.name}</Typography>
          )}
        </FormControl>
        <CustomTextField
          name="buy_price"
          label="Buy Price"
          variant="outlined"
          type="number"
          value={formik.values.buy_price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.buy_price && Boolean(formik.errors.buy_price)}
          helperText={formik.touched.buy_price && formik.errors.buy_price}
        />
        <CustomTextField
          name="sell_price"
          label="Sell Price"
          variant="outlined"
          type="number"
          value={formik.values.sell_price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sell_price && Boolean(formik.errors.sell_price)}
          helperText={formik.touched.sell_price && formik.errors.sell_price}
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
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default MaterialForm;
