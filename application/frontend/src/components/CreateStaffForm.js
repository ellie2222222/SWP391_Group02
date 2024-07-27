import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Adjust import as needed

const CustomContainer = styled(Grid)({
    minHeight: '100vh',
    backgroundColor: '#f3f0e4', // beige background color
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const FormContainer = styled(Grid)({
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%',
});

const CustomTextField = styled(TextField)({
    width: '100%',
    marginBottom: '1rem',
    "& .MuiOutlinedInput-root": {
        fontSize: '1.3rem',
        "&:hover fieldset": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#b48c72",
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
});

const CustomButton = styled(Button)({
    backgroundColor: '#b48c72',
    color: '#fff',
    marginTop: '1rem',
    width: '100%',
    '&:hover': {
        backgroundColor: '#8e735c',
    },
    fontSize: '1.3rem',
});

const CustomLink = styled(Link)({
    color: '#b48c72',
    textDecoration: 'none',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '1rem',
});

const staffRoles = ['manager', 'sale_staff', 'design_staff', 'production_staff'];

const CreateStaffForm = () => {
    const [staffData, setStaffData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    phone_number: '',
    address: ''
});
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setStaffData({ ...staffData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form data:', staffData); // Debugging line
    
        try {
            await axiosInstance.post('/user/signup', staffData);
            setError('');
            navigate('/management/staffs');
        } catch (error) {
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
        }
    };

    return (
        <FormContainer item>
            <Typography variant="h4" align="center" style={{ fontSize: '2.2rem', fontWeight: 'bold' }} gutterBottom>
                Create Staff's Account
            </Typography>
            <form onSubmit={handleSubmit}>
                <CustomTextField
                    label="Username"
                    name="username"
                    fullWidth
                    margin="normal"
                    value={staffData.username}
                    onChange={handleChange}
                />
                <CustomTextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="normal"
                    value={staffData.email}
                    onChange={handleChange}
                />
                <CustomTextField
                    label="Password"
                    name="password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={staffData.password}
                    onChange={handleChange}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="role-label" sx={{ fontSize: '1.3rem' }}>Role</InputLabel>
                    <Select
                        labelId="role-label"
                        name="role"
                        value={staffData.role}
                        onChange={handleChange}
                        label="Role"
                    >
                        {staffRoles.map((role) => (
                            <MenuItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <CustomTextField
                    label="Phone Number"
                    name="phone_number"
                    fullWidth
                    margin="normal"
                    value={staffData.phone_number}
                    onChange={handleChange}
                />
                <CustomTextField
                    label="Address"
                    name="address"
                    fullWidth
                    margin="normal"
                    value={staffData.address}
                    onChange={handleChange}
                />

                <CustomButton variant="contained" type="submit">
                    Create Account
                </CustomButton>
                {error && <Typography color="error" mt={1} variant='h6'>{error}</Typography>}
            </form>
        </FormContainer>
    );
};

export default CreateStaffForm;
