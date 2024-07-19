import React from 'react';
import { useFormik } from 'formik';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import * as Yup from 'yup';
import { styled } from '@mui/system';
import useAuth from '../hooks/useAuthContext';
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

const UserFeedbackQuoteForm = ({ initialValues,onSubmit }) => {
  const {user} = useAuth();
  const formik = useFormik({
    initialValues: {
      ...initialValues,
      manager_feedback_quote: '',
      user_feedback_quote:'',
      request_status:'pending',
    },
    onSubmit: async (values) => {
      onSubmit(values);
    },
    validationSchema: Yup.object({
      manager_feedback_quote: user.role ==='manager' ? Yup.string().required('Manager feedback is required') : Yup.string().nullable() ,
      user_feedback_quote:user.role ==='user' ?Yup.string().required('User feedback is required') : Yup.string().nullable() ,
    }),
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align='center'>
        User Feedback Quote
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ '& > :not(style)': { m: 1, width: '100%' } }}>
        {user.role ==='manager' && (<CustomTextField
          name="manager_feedback_quote"
          label="Manager Feedback Quote"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.manager_feedback_quote}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.manager_feedback_quote && Boolean(formik.errors.manager_feedback_quote)}
          helperText={formik.touched.manager_feedback_quote && formik.errors.manager_feedback_quote}
        /> )}
        {user.role === 'user' &&( <CustomTextField
          name="user_feedback_quote"
          label="User Feedback Quote"
          variant="outlined"
          multiline
          rows={4}
          value={formik.values.user_feedback_quote}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.user_feedback_quote && Boolean(formik.errors.user_feedback_quote)}
          helperText={formik.touched.user_feedback_quote && formik.errors.user_feedback_quote}
        />)}
       
        <CustomButton type="submit" variant="contained" sx={{ mt: 2 }}>
          Submit
        </CustomButton>
      </Box>
    </Container>
  );
};

export default UserFeedbackQuoteForm;
