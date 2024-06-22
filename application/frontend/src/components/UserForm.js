import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, FormControlLabel, Switch, Typography, IconButton, CardMedia } from '@mui/material';
import * as Yup from 'yup';
export default function UserForm(initialValues, onSubmit) {
  const formik = useFormik({
    initialValues: {
      ...initialValues.initialValues,
    },
    onSubmit: async (values) => {


      return initialValues.onSubmit(values);
    },
    validationSchema: Yup.object({
      address: Yup.string().required('Address is required'),
      email: Yup.string().email('Invalid email format').required('Email is required'),
      password: Yup.string().required('Password is required'), // Assuming the hashed password is validated elsewhere
      phone_number: Yup.string().matches(/^(\d{8,})$/, 'Phone number is not valid').required('Phone number is required'),
      role: Yup.string().oneOf(['user', 'admin', 'sale_staff', 'manager', 'design_staff'], 'Role must be either "user" or "admin"').required('Role is required'),
      username: Yup.string().required('Username is required')
    }),
  })
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <TextField
          name="username"
          label="User Name"
          variant="outlined"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          name="phone_number"
          label="Phone Number"
          variant="outlined"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
          helperText={formik.touched.phone_number && formik.errors.phone_number}
        />
        <TextField
          name="address"
          label="Address"
          variant="outlined"
          value={formik.values.address}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
        />
        <TextField
          name="email"
          label="email"
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="role">Role</InputLabel>
          <Select
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="role"
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

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit
        </Button>

      </Box>
    </Container>
  )
}
