import React from 'react';
import { Container, Typography, Button, Box, styled, Grid, Card, CardMedia, CardContent } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';

const Banner = styled(Box) ({
    backgroundImage: 'url(https://www.tierra.vn/wp-content/uploads/2024/07/CAT-TSKC-1-scaled.webp)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '40vw', // Adjust the height to be relative to the viewport
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.7)', // Optional for better text visibility
    flexDirection: 'column',
    textAlign: 'center',
});

const items = [
    {
        image: 'https://www.tierra.vn/wp-content/uploads/2024/07/BANNER-HOMEPAGE-2.webp', // Replace with actual image URL
        title: 'Engagement Rings',
        actionText: 'Explore Now'
    },
    {
        image: 'https://www.tierra.vn/wp-content/uploads/2024/07/BANNER-TRANG-CHU-2.webp', // Replace with actual image URL
        title: 'Diamond Jewelry',
        actionText: 'Explore Now'
    },
    {
        image: 'https://www.tierra.vn/wp-content/uploads/2024/07/VTA8111.webp', // Replace with actual image URL
        title: 'Bracelets',
        actionText: 'Explore Now'
    }
];

const ringItems = [
    {
        label: 'Solitaire',
        image: 'https://tierra.vn/wp-content/uploads/2024/07/NCH9916_4.webp'
    },
    {
        label: 'Halo',
        image: 'https://tierra.vn/wp-content/uploads/2024/07/NCH9907_4.webp'
    },
    {
        label: 'Best Selling',
        image: 'https://tierra.vn/wp-content/uploads/2024/07/NCH9906_4.webp'
    },
    {
        label: 'New Collection',
        image: 'https://tierra.vn/wp-content/uploads/2024/07/NCH8210_4.webp'
    }
];

const CustomButton = styled(Button)({
    color: '#000',
    textTransform: 'uppercase',
    width: '100%',
    height: '100%', // Take full height of Grid item
    fontSize: '1.6rem',
    fontWeight: '400',
    '&:hover': {
        backgroundColor: 'transparent', // Remove default border effect
        color: '#b48c72', // Change text color on hover
        borderRadius: '0',
    },
    '&.active': {
        backgroundColor: 'transparent', // Remove default border effect
        color: '#b48c72', // Change text color when active
        borderRadius: '0',
    },
});

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    border: '1px solid #000',
    color: '#000',
    width: '100%',
    fontSize:'1.6rem',
    '&:hover': {
        color: '#b48c72', // Change text color on hover
        border: '1px solid #b48c72',
        backgroundColor: 'transparent',
    },
});

const HomePageBody = () => {
    return (
        <Box>
            {/* Banner Section */}
            <Banner>
                {/* Add any content or text here if needed */}
            </Banner>
            {/* Rest of the content */}
            <Container sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
                <Grid container spacing={2}>
                    {items.map((item, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.title}
                                />
                                <CardContent>
                                    <Typography variant="h4" component="div">
                                        {item.title}
                                    </Typography>
                                    <Box mt={2}>
                                        <CustomButton variant="text" color="primary">
                                            {item.actionText}
                                        </CustomButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Box sx={{
                padding: '40px 0',
                backgroundColor: '#f5f5f5',
                marginBottom: '40px',
            }}>
                <Container>
                    <Grid container spacing={0} alignItems="center">
                        {/* Text Content */}
                        <Grid item xs={12} md={4} marginBottom="20px">
                            <Box>
                                <Typography variant="h3" gutterBottom>
                                    Engagement Rings
                                </Typography>
                                <Typography variant="h5" color="textSecondary" paragraph>
                                    A sparkling ring to be given, marking the beginning of a lifelong love journey.
                                </Typography>
                                <CustomButton1 variant="outlined" color="primary">
                                    VIEW MORE
                                </CustomButton1>
                            </Box>
                        </Grid>
                        {/* Image 1 */}
                        <Grid item xs={6} md={4} sx={{ padding: '30px' }}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/wp-content/uploads/2024/07/nhan-cuoi-eternity.webp"  // Replace with actual image URL or path
                                alt="Engagement Ring"
                            />
                        </Grid>
                        {/* Image 2 */}
                        <Grid item xs={6} md={4}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/wp-content/uploads/2024/07/Banner-trang-chu-1.webp"  // Replace with actual image URL or path
                                alt="Engagement Ring on hand"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Container sx={{ marginBottom: '40px' }}>
                <Grid container spacing={2}>
                    {ringItems.map((item, index) => (
                        <Grid item xs={6} sm={6} md={3} key={index}>
                            <Box textAlign="center">
                                <CardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.label}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                                <Typography variant="h6" color="textPrimary" gutterBottom marginTop='20px'>
                                    {item.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Box sx={{
                padding: '40px 0',
                backgroundColor: '#f5f5f5',
                marginBottom: '40px',
            }}>
                <Container>
                    <Grid container spacing={0} alignItems="center" flexDirection='row-reverse'>
                        {/* Text Content */}
                        <Grid item xs={12} md={4} marginBottom="20px">
                            <Box>
                                <Typography variant="h3" gutterBottom>
                                    Custom Ring
                                </Typography>
                                <Typography variant="h5" color="textSecondary" paragraph>
                                    A sparkling ring to be given, marking the beginning of a lifelong love journey.
                                </Typography>
                                <CustomButton1 variant="outlined" color="primary">
                                    Custom
                                </CustomButton1>
                            </Box>
                        </Grid>
                        {/* Image 1 */}
                        <Grid item xs={6} md={4} sx={{ padding: '30px' }}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/wp-content/uploads/2024/07/banner-homepage-1.webp"  // Replace with actual image URL or path
                                alt="Custom Ring"
                            />
                        </Grid>
                        {/* Image 2 */}
                        <Grid item xs={6} md={4}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/wp-content/uploads/2024/07/COVER-COLLECTION.webp"  // Replace with actual image URL or path
                                alt="Custom Ring on hand"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Container sx={{paddingBottom:'40px'}}>
                <Grid container spacing={4}>
                    {/* Left Side - Image */}
                    <Grid item xs={12} md={6}>
                        <Box component="img" src="https://www.tierra.vn/wp-content/uploads/2024/03/11-cuahang-Re1KmV2Ptu.webp" alt="Jewelry Store" sx={{ width: '100%', borderRadius: 0 }} />
                    </Grid>
                    {/* Right Side - Text and Icons */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h3" component="div" mb={4}>
                                Our Services
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <SwapHorizIcon sx={{ mr: 1 }} />
                                <Typography variant="h5">Exchange policy up to 100%</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <VerifiedIcon sx={{ mr: 1 }} />
                                <Typography variant="h5">Lifetime warranty</Typography>
                            </Box>
                            <Typography variant="h5" mb={4}>
                                Find a store near you
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePageBody;
