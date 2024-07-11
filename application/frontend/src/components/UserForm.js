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
  minWidth: 120,
  "& .MuiInputLabel-root": {
      fontSize: '1.3rem',
      "&.Mui-focused": {
          color: "#b48c72",
      },
  },
  "& .MuiOutlinedInput-root": {
      fontSize: '1.3rem',
      "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b48c72",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#b48c72",
      },
  },
});

const CustomMenuItem = styled(MenuItem)({
  fontSize: '1.3rem',
})

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72',
  fontSize: '1.3rem',
  '&:hover': {
    backgroundColor: '#a57d65',
  },
});

const UserForm = ({ initialValues, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
    validationSchema: Yup.object({
      address: Yup.string().required('Address is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().required('Password is required'),
      phone_number: Yup.string().matches(/^(\d{8,})$/, 'Phone number is not valid').required('Phone number is required'),
      role: Yup.string().oneOf(['user', 'admin', 'manager', 'sale_staff', 'design_staff', 'production_staff'], 'Invalid role').required('Role is required'),
      username: Yup.string().required('Username is required'),
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align='center'>
        Edit User
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomTextField
          name="username"
          label="Username"
          variant="outlined"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <CustomTextField
          name="phone_number"
          label="Phone Number"
          variant="outlined"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <CustomTextField
          name="address"
          label="Address"
          variant="outlined"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <CustomTextField
          name="email"
          label="Email"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <CustomFormControl variant="outlined" fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Role"
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <CustomMenuItem value="user">User</CustomMenuItem>
            <CustomMenuItem value="admin">Admin</CustomMenuItem>
            <CustomMenuItem value="manager">Manager</CustomMenuItem>
            <CustomMenuItem value="sale_staff">Sale Staff</CustomMenuItem>
            <CustomMenuItem value="design_staff">Design Staff</CustomMenuItem>
            <CustomMenuItem value="production_staff">Production Staff</CustomMenuItem>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <Typography variant="caption" color="red">{formik.errors.role}</Typography>
          )}
        </CustomFormControl>

        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default UserForm;
