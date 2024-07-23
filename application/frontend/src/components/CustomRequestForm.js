import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1.3rem',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const StyledDialogTitle = styled(DialogTitle)({
    textAlign: 'center',
});

const StyledDialogContentText = styled(DialogContentText)({
    color: '#000',
    fontSize: '1.3rem',
    textAlign: 'center',
});

const CustomTextField = styled(TextField)({
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

const CustomRequestForm = () => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRequest = async () => {
        setOpen(false);
        setLoading(true);
        try {
            await axiosInstance.post(`/requests`, { request_description: description }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('Request sent successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            setLoading(false);  
        } catch (error) {
            toast.error(error.response?.data?.error || error.message, {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            });
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box padding="40px 0" minHeight="80vh">
                <Typography variant="h2" component="h1" marginBottom="20px">Custom Jewelry Request</Typography>
                <Typography variant='h4' sx={{ fontWeight: 300 }} marginBottom="20px">Please tell us about your design; describe any changes you'd like to make to an existing design on this website or a completely custom item idea.</Typography>
                <CustomTextField
                    label="Describe your idea"
                    multiline
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    required
                />
                <Box display="flex" justifyContent="center" alignItems="center" marginTop="20px">
                    <CustomButton1 variant="contained" color="primary" onClick={handleClickOpen} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'SEND REQUEST'}
                    </CustomButton1>
                </Box>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <StyledDialogTitle id="confirm-dialog-title">{"Confirm Request"}</StyledDialogTitle>
                <DialogContent>
                    <StyledDialogContentText id="confirm-dialog-description">
                        Are you sure you want to send this request?
                    </StyledDialogContentText>
                </DialogContent>
                <DialogActions>
                    <CustomButton1 onClick={handleClose} color="primary">
                        Cancel
                    </CustomButton1>
                    <CustomButton1 onClick={handleRequest} color="primary" autoFocus>
                        Confirm
                    </CustomButton1>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Container>
    );
};

export default CustomRequestForm;
