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
      role: Yup.string().oneOf(['user', 'admin', 'sale_staff', 'manager', 'design_staff'], 'Role must be either "user" or "admin"').required('Role is required'),
      username: Yup.string().required('Username is required'),
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomTextField
          name="username"
          label="User Name"
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
        <FormControl variant="outlined" fullWidth>
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
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="sale_staff">Sale Staff</MenuItem>
            <MenuItem value="design_staff">Design Staff</MenuItem>
          </Select>
          {formik.touched.role && formik.errors.role && (
            <Typography variant="caption" color="red">{formik.errors.role}</Typography>
          )}
        </FormControl>

        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>

      </Box>
    </Container>
  );
};

export default UserForm;
