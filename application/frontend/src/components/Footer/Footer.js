import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton,styled } from '@mui/material';
import { Facebook, Instagram, YouTube } from '@mui/icons-material';
const CustomIconButton = styled(IconButton)({
  
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#b48c72',
  },
});
const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', color: '#333', py: 5 }}>
      <Container maxWidth="lg">
        <Grid container spacing={0} justifyContent="space-between" >
          <Grid item xs={6} sm={4} padding='20px' borderLeft="1px solid" borderRight="1px solid">
            <Typography variant="h3" gutterBottom>
              Contact
            </Typography>
            <Typography variant="h5">
              Call to purchase:
            </Typography>
            <Typography variant="h5">
              1900 232 354<br/>
              028 7106 2016<br/>
              0938 256 545
            </Typography>
            <Typography variant="h5" sx={{ mt: 2 }}>
              Connect with Tierra
            </Typography>
            <Box>
              <CustomIconButton href="#" color="inherit" variant="h5">
                <Facebook />
              </CustomIconButton>
              <CustomIconButton href="#" color="inherit" variant="h5"> 
                <Instagram />
              </CustomIconButton>
              <CustomIconButton href="#" color="inherit" variant="h5">
                <YouTube />
              </CustomIconButton>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} padding='20px'>
            <Typography variant="h3" gutterBottom>
              Support
            </Typography>
            <Link href="#" color="inherit" underline="none" variant="h5">Purchase Policy</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Exchange Policy</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Payment Methods</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Information Security</Link>
          </Grid>
          <Grid item xs={6} sm={4} padding='20px' borderLeft="1px solid" borderRight="1px solid">
            <Typography variant="h3" gutterBottom>
              About Us
            </Typography>
            <Link href="#" color="inherit" underline="none" variant="h5">Tierra Story</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Tierra and You</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Shop System</Link><br/>
            <Link href="#" color="inherit" underline="none" variant="h5">Recruitment</Link>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
