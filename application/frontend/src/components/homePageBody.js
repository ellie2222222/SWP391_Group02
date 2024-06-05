import React from 'react';
import { Container, Typography, Button, Box, styled, useMediaQuery, useTheme, Grid, Card, CardMedia, CardContent, Paper } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';

const Banner = styled(Box)(({ theme }) => ({
    backgroundImage: 'url(https://www.tierra.vn/files/2560x/main-banner-homepage-copy-r8w7lY2k3z.webp)',
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
}));

const CustomCardMedia = styled(CardMedia)({
    height: '500px',
});

const items = [
    {
        image: 'https://www.tierra.vn/files/450x/banner-homepage-2-EYD97kmwoZ.webp', // Replace with actual image URL
        title: 'Nhẫn cầu hôn',
        discount: 'Giảm ngay 15%',
        actionText: 'Khám phá ngay'
    },
    {
        image: 'https://www.tierra.vn/files/450x/banner-homepage-1--qjEoES5diQ.webp', // Replace with actual image URL
        title: 'Trang sức kim cương',
        discount: 'Giảm ngay 15%',
        actionText: 'Khám phá ngay'
    },
    {
        image: 'https://www.tierra.vn/files/450x/banner-homepage-2--orMpIUzaGr.webp', // Replace with actual image URL
        title: 'Nhẫn nam',
        discount: 'Giảm ngay 15%',
        actionText: 'Khám phá ngay'
    }
];

const ringItems = [
    {
        label: 'Solitaire',
        image: 'https://www.tierra.vn/files/halo-A7tL5Eltco.webp'
    },
    {
        label: 'Halo',
        image: 'https://www.tierra.vn/files/halo-A7tL5Eltco.webp'
    },
    {
        label: 'Best selling',
        image: 'https://www.tierra.vn/files/halo-A7tL5Eltco.webp'
    },
    {
        label: 'New collection',
        image: 'https://www.tierra.vn/files/halo-A7tL5Eltco.webp'
    }
];

const CustomButton = styled(Button)({
    color: '#000',
    textTransform: 'uppercase',
    width: '100%',
    height: '100%', // Chiếm toàn bộ chiều cao của Grid item
    fontSize: '1rem',
    fontWeight: '400',
    '&:hover': {
        backgroundColor: 'transparent', // Xóa hiệu ứng viền mặc định
        color: '#b48c72', // Thay đổi màu chữ khi hover
        borderRadius: '0',
    },
    '&.active': {
        backgroundColor: 'transparent', // Xóa hiệu ứng viền mặc định
        color: '#b48c72', // Thay đổi màu chữ khi active
        borderRadius: '0',
    },
});

const CustomButton1 = styled(Button)({
    outlineColor: '#000',
    border: '1px solid #000',
    color: '#000',
    width: '100%',
    '&:hover': {
        color: '#b48c72', // Thay đổi màu chữ khi hover
        border: '1px solid #b48c72',
        backgroundColor: 'transparent',
    },
});

const HomePageBody = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box>
            {/* Banner Section */}
            <Banner>
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
                                    <Typography variant="h6" component="div">
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.discount}
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
                                <Typography variant="h4" gutterBottom>
                                    Nhẫn Cầu Hôn
                                </Typography>
                                <Typography variant="body1" color="textSecondary" paragraph>
                                    Một chiếc nhẫn lấp lánh trao tay, mở ra hành trình yêu thương viên mãn.
                                </Typography>
                                <CustomButton1 variant="outlined" color="primary">
                                    XEM THÊM
                                </CustomButton1>
                            </Box>
                        </Grid>
                        {/* Image 1 */}
                        <Grid item xs={6} md={4} sx={{ padding: '30px' }}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/files/oh-nch-homepage-mobile-kpxZd0aqlc.webp"  // Replace with actual image URL or path
                                alt="Nhẫn Cầu Hôn"
                            />
                        </Grid>
                        {/* Image 2 */}
                        <Grid item xs={6} md={4}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/files/oh-nch-homepage-mobile-kpxZd0aqlc.webp"  // Replace with actual image URL or path
                                alt="Nhẫn Cầu Hôn trên tay"
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
                                <Typography variant="h4" gutterBottom>
                                    Nhẫn Cầu Hôn
                                </Typography>
                                <Typography variant="body1" color="textSecondary" paragraph>
                                    Một chiếc nhẫn lấp lánh trao tay, mở ra hành trình yêu thương viên mãn.
                                </Typography>
                                <CustomButton1 variant="outlined" color="primary">
                                    XEM THÊM
                                </CustomButton1>
                            </Box>
                        </Grid>
                        {/* Image 1 */}
                        <Grid item xs={6} md={4} sx={{ padding: '30px' }}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/files/600x/banner-bta-mobile-2lQtsfIA8D.webp"  // Replace with actual image URL or path
                                alt="Nhẫn Cầu Hôn"
                            />
                        </Grid>
                        {/* Image 2 */}
                        <Grid item xs={6} md={4}>
                            <CardMedia
                                component="img"
                                image="https://www.tierra.vn/files/600x/banner-bta-mobile-2lQtsfIA8D.webp"  // Replace with actual image URL or path
                                alt="Nhẫn Cầu Hôn trên tay"
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Container sx={{paddingBottom:'40px'}}>
                <Grid container spacing={4}>
                    {/* Left Side - Image */}
                    <Grid item xs={12} md={6}>
                        <Box component="img" src="https://www.tierra.vn/files/11-cuahang-Re1KmV2Ptu.webp" alt="Jewelry Store" sx={{ width: '100%', borderRadius: 0 }} />
                    </Grid>
                    {/* Right Side - Text and Icons */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h4" component="div" mb={4}>
                                Dịch vụ của chúng tôi
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocalShippingIcon sx={{ mr: 1 }} />
                                <Typography variant="h5">Giao hàng miễn phí toàn quốc</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <SwapHorizIcon sx={{ mr: 1 }} />
                                <Typography variant="h5">Chế độ thu đổi đến 100%</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <VerifiedIcon sx={{ mr: 1 }} />
                                <Typography variant="h5">Bảo hành trọn đời</Typography>
                            </Box>
                            <Typography variant="h5" mb={4}>
                                Tìm cửa hàng gần bạn
                            </Typography>
                            <CustomButton1 color="primary">
                                ĐẶT LỊCH HẸN
                            </CustomButton1>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePageBody;
