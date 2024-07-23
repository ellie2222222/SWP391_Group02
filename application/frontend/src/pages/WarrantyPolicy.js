import React from 'react';
import { Container, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const WarrantyPolicy = () => {
    return (
        <div>
            <Navbar />
            <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: '300', textAlign: 'center' }}>
                        WARRANTY POLICY
                    </Typography>
                    <Box mt={4}>
                        <Typography variant='h4' sx={{ color: '#b48c72', fontWeight: 'bold' }}>1. FREE SERVICE</Typography>
                        <TableContainer sx={{my: 2}} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%', color: "#b48c72"}} align='center'><Typography variant="h5" sx={{fontWeight: 'bold'}}>Content</Typography></TableCell>
                                        <TableCell sx={{ width: '50%', color: "#b48c72"}} align='center'><Typography variant="h5" sx={{fontWeight: 'bold'}}>Time</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Cleaning products at the store</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">02 years</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Polishing and re-plating</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">02 years</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Adjusting products size</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">02 years</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Straightening ring</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">01 times</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Engraving names</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">02 times</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Soldering chains, repairing clasp</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">03 times</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant='body1' align='center'>Table 1.1</Typography>
                    </Box>
                    <Box mt={4}>
                        <Typography variant='h4' sx={{ color: '#b48c72', fontWeight: 'bold' }}>2. CHARGED SERVICE</Typography>
                        <TableContainer sx={{my: 2}} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%', color: "#b48c72"}} align='center'><Typography variant="h5" sx={{fontWeight: 'bold'}}>Content</Typography></TableCell>
                                        <TableCell sx={{ width: '50%', color: "#b48c72"}} align='center'><Typography variant="h5" sx={{fontWeight: 'bold'}}>Cost</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Soldering chains, repairing clasp</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">50.000₫</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Engraving names</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">50.000₫</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Straightening ring</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">50.000₫</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Stone replacement</Typography></TableCell>
                                        <TableCell sx={{ width: '50%' }} align='center'><Typography variant="h5">Depends</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant='body1' align='center'>Table 2.1</Typography>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default WarrantyPolicy;
