import React from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Typography } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import { MarginOutlined } from '@mui/icons-material';

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
  "& .MuiTypography-root": {
    fontSize: "1.2rem",
    marginLeft: 0,
  },
  "& .MuiFormHelperText-root": {
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
  fontSize: "1.3rem",
  backgroundColor: '#b48c72',
  '&:hover': {
    backgroundColor: '#a57d65',
  },
});

const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
})

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
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align='center'>
        {initialValues._id ? 'Edit Material' : 'Add Material'}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomFormControl variant="outlined" fullWidth>
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
            <CustomMenuItem value="Silver">Silver</CustomMenuItem>
            <CustomMenuItem value="Platinum">Platinum</CustomMenuItem>
            <CustomMenuItem value="Gold 18K">Gold 18K</CustomMenuItem>
            <CustomMenuItem value="Gold 14K">Gold 14K</CustomMenuItem>
            <CustomMenuItem value="Gold 10K">Gold 10K</CustomMenuItem>
            <CustomMenuItem value="Gold 24K">Gold 24K</CustomMenuItem>
          </Select>
          {formik.touched.name && formik.errors.name && (
            <Typography variant="caption" color="red">{formik.errors.name}</Typography>
          )}
        </CustomFormControl>
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
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default MaterialForm;
