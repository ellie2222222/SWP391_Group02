import React from 'react';
import { Container, Typography, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const ExchangePolicy = () => {
    return (
        <div>
            <Navbar />
            <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: '300', textAlign: 'center' }}>
                        EXCHANGE POLICY
                    </Typography>
                    <Box mt={4}>
                        <Typography variant='h4' sx={{ color: '#b48c72', fontWeight: 'bold' }}>1. FOR INTACT PRODUCTS</Typography>
                        <TableContainer sx={{ my: 2 }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Product Line</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Conditions</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Exchange Rate</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Buyback Rate</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Gold jewelry</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Products are intact</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">80%</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">70%</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">24K jewelry</Typography></TableCell>
                                        <TableCell align='center' colSpan={3}><Typography variant="h5">Exchange according to the current market price</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center' rowSpan={2}><Typography variant="h5">Loose diamonds</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Intact accompanying jewelry</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">80%</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">70%</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Not intact accompanying jewelry</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">65%</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">60%</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant='body1' align='center'>Table 1.1</Typography>
                    </Box>
                    <Box mt={4}>
                        <Typography variant='h4' sx={{ color: '#b48c72', fontWeight: 'bold' }}>2. FOR DEFECTIVE, DAMAGED PRODUCTS</Typography>
                        <TableContainer sx={{ my: 2 }} component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Product Line</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Conditions</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Exchange Rate</Typography></TableCell>
                                        <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Buyback Rate</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Manufacturer defect products</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Falling/missing stones, prong settings without external impact, product surface intact</Typography></TableCell>
                                        <TableCell align='center' colSpan={2}><Typography variant="h5">Refer to table 1.1</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Ring</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Deformed, damaged, bent</Typography></TableCell>
                                        <TableCell align='center' colSpan={2} rowSpan={6}><Typography variant="h5">Based on gold weight and gold price at the time (buying price) according to the gold content of the product</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center' rowSpan={4}><Typography variant="h5">Necklace, Bracelet</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Deformed, damaged, bent</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Broken chains</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Broken into multiple pieces</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Broken clasp due to impact, misuse</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center' rowSpan={2}><Typography variant="h5">Earring</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Deformed, bent, broken horizontal post, broken prong setting, deformed</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">One earring lost (remaining earring intact)</Typography></TableCell>
                                        <TableCell align='center' colSpan={2}><Typography variant="h5">Calculate the value of the remaining piece; Refer to table 1.1</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center' rowSpan={2}><Typography variant="h5">Custom Jewelry Design</Typography></TableCell>
                                        <TableCell align='center'><Typography variant="h5">Custom-designed per customer request</Typography></TableCell>
                                        <TableCell align='center' colSpan={2}><Typography variant="h5">Refer to table 1.1</Typography></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'><Typography variant="h5">Design changes based on company samples</Typography></TableCell>
                                        <TableCell align='center' colSpan={2}><Typography variant="h5">Refer to table 1.1 (Design cost not included)</Typography></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Typography variant='body1' align='center'>Table 2.1</Typography>
                    </Box>
                    <Box mt={4}>
                        <Typography variant='h5'>Note:</Typography>
                        <Typography variant='h5'>Products that are not intact or missing an invoice will be bought back at the current gold price</Typography>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default ExchangePolicy;

