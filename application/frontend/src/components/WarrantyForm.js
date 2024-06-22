import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import { Container, TextField, Button, Typography, Box, CircularProgress, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72',
  color: '#fff',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#9b7a63',
  },
});

const initialValues = {
  userId: '',
  requestId: '',
  warrantyContent: '',
  warrantyStartDate: '',
  warrantyEndDate: '',
};

const validationSchema = Yup.object().shape({
  userId: Yup.string().required('Required'),
  requestId: Yup.string().required('Required'),
  warrantyContent: Yup.string().required('Required'),
  warrantyStartDate: Yup.date().required('Required'),
  warrantyEndDate: Yup.date().required('Required'),
});

const CustomTextField = ({ field, form, ...props }) => (
  <TextField
    fullWidth
    variant="outlined"
    margin="normal"
    {...field}
    {...props}
    helperText={<ErrorMessage name={field.name} />}
    error={form.touched[field.name] && Boolean(form.errors[field.name])}
  />
);

const WarrantyForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.post('/warranties', {
        user_id: values.userId,
        request_id: values.requestId,
        warranty_content: values.warrantyContent,
        warranty_start_date: values.warrantyStartDate,
        warranty_end_date: values.warrantyEndDate,
      });
      setSubmitting(false);
      navigate('/warranties'); // Redirect to warranty list page
    } catch (error) {
      console.error(error);
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Complete Transaction
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="userId"
                    label="User ID"
                    component={CustomTextField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="requestId"
                    label="Request ID"
                    component={CustomTextField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="warrantyContent"
                    label="Warranty Content"
                    component={CustomTextField}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="warrantyStartDate"
                    label="Warranty Start Date"
                    component={CustomTextField}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    name="warrantyEndDate"
                    label="Warranty End Date"
                    component={CustomTextField}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <CustomButton type="submit" disabled={isSubmitting} fullWidth>
                {isSubmitting ? <CircularProgress size={24} /> : 'Submit'}
              </CustomButton>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default WarrantyForm;
