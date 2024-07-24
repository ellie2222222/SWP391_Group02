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
  fontSize: '1.3rem',
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
      cut: Yup.string().required('Cut is required'),
      clarity: Yup.string().required('Clarity is required'),
      color: Yup.string().required('Color is required'),
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
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default GemstoneForm;
