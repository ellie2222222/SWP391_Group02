import React from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
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

const CustomButton = styled(Button)({
  backgroundColor: '#b48c72',
  fontSize: '1.3rem',
  '&:hover': {
    backgroundColor: '#a57d65',
  },
});

const UserFeedbackDesignForm = ({ initialValues,onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      user_feedback_design:'',
      request_status:'design',
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
    validationSchema: Yup.object({
        user_feedback_design:  Yup.string().required('User feedback is required') ,
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align='center'>
        User Feedback Design
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        <CustomTextField
          name="user_feedback_design"
          label="User Feedback Quote"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.user_feedback_design}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_feedback_design && Boolean(formik.errors.user_feedback_design)}
          helperText={formik.touched.user_feedback_design && formik.errors.user_feedback_design}
        />
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default UserFeedbackDesignForm;
