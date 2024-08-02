import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import axiosInstance from '../utils/axiosInstance';
import { Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const GoldPrice = () => {
    const [goldPrices, setGoldPrices] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGoldPrices = async () => {
            try {
                const response = await axiosInstance.get('/materials');
                let list = response.data.filter((material) => material.name.toLowerCase().includes('gold'))
                setGoldPrices(list);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchGoldPrices();
    }, []);

    return (
        <div>
            <Navbar />
            <Container maxWidth="md" sx={{ minHeight: '90vh'}}>
                <Box mt={4}>
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: '300', textAlign: 'center' }}>
                        GOLD PRICE
                    </Typography>
                    <TableContainer sx={{ my: 2 }} component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Unit: VND/mace (VND/chỉ)</Typography></TableCell>
                                    <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Buying Price</Typography></TableCell>
                                    <TableCell sx={{ color: "#b48c72" }} align='center'><Typography variant="h5" sx={{ fontWeight: 'bold' }}>Selling Price</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align='center'>
                                            <Typography variant="h5">Loading...</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <>
                                        {goldPrices && goldPrices.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell align='center'>
                                                    <Typography variant="h5">
                                                        {item.name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align='center'><Typography variant="h5">{item.buy_price ? item.buy_price.toLocaleString() + '₫' : '-'}</Typography></TableCell>
                                                <TableCell align='center'><Typography variant="h5">{item.sell_price ? item.sell_price.toLocaleString() + '₫' : '-'}</Typography></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
            <Footer />
        </div>
    );
};

export default GoldPrice;
