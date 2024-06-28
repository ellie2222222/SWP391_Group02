import React, { useState } from 'react';
import { Container, Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuthContext';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
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
    fontSize: '1.1rem',
    textAlign: 'center',
});

const CustomRequestForm = () => {
    const [description, setDescription] = useState('');
    const { user } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRequest = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(`/requests`, { request_description: description }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setError('');
            setMessage('Request sent successfully');
            setLoading(false);
            setOpen(false); // Close the dialog after sending the request
        } catch (error) {
            setMessage('');
            if (error.response === undefined) setError(error.message);
            else setError(error.response.data.error);
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box padding="40px 0" minHeight="60vh">
                <Typography variant="h2" component="h1" marginBottom="20px">Custom Jewelry Request</Typography>
                <Typography marginBottom="20px">Please tell us about your design; describe any changes you'd like to make to an existing design on this website or a completely custom item idea.</Typography>
                <TextField
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
                {message && (
                    <Typography marginBottom="20px" color="green">{message}</Typography>
                )}
                {error && (
                    <Typography marginBottom="20px" color="red">{error}</Typography>
                )}
                <CustomButton1 variant="contained" color="primary" style={{ marginTop: '20px' }} onClick={handleClickOpen}>
                    SEND REQUEST
                </CustomButton1>
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

            {loading && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            )}
        </Container>
    );
};

export default CustomRequestForm;
