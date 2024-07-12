import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Box my={5} >
        <Typography  variant="h5" component="h1" gutterBottom style={{ fontSize: '2.9rem', fontWeight: 'bold' }}>
        Welcome to our Jewelry Shop!
        </Typography>
        
        <Typography variant="body1" paragraph style={{ fontSize: '1.8rem', marginBottom: '50px' }} >
          We specialize in selling exquisite jewelry and creating handmade pieces tailored to our customer's unique desires. Our mission is to provide high-quality, beautiful jewelry that not only enhances your beauty but also tells your personal story.
        </Typography>

        <Grid container spacing={4} alignItems="center" style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={6}>
            <img src="https://media.istockphoto.com/id/1318820702/photo/jewelry-manufacture.jpg?s=612x612&w=0&k=20&c=JAxKaKMQfz4wSqdDRi6n-WbgPKHFz2DIEHeyzvVWagw=" alt="Jewelry Manufacture" style={{ width: '100%', borderRadius: '10px' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" paragraph style={{ fontSize: '2.5rem', fontWeight: '500' }}>
              Our Responsibility
            </Typography>
            <Typography variant="body1" paragraph style={{ fontSize: '1.8rem' }}>
              We take our responsibility seriously. Every piece of jewelry we create is crafted with the utmost care and precision. We source our materials ethically and ensure that our craftsmen work in a safe and supportive environment. We believe in transparency and honesty, ensuring that you know exactly what you are getting when you purchase from us.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center" style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Typography variant="h5" paragraph style={{ fontSize: '2.5rem', fontWeight: '500' }}>
              Our Reliability
            </Typography>
            <Typography variant="body1" paragraph style={{ fontSize: '1.8rem' }}>
              Our customers trust us to deliver quality products on time, every time. We have built a reputation for reliability by consistently meeting deadlines and exceeding expectations. Whether you are purchasing a ready-made piece or commissioning a custom design, you can count on us to deliver jewelry that meets your highest standards.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <img src="https://www.jewepiter.com/wp-content/uploads/2023/10/The-Quality-Control-Checklist-for-Jewelry-1.jpeg" alt="Quality Control" style={{ width: '100%', borderRadius: '10px' }} />
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center" style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={6}>
            <img src="https://media.istockphoto.com/id/486861622/photo/inspecting-for-flaws.jpg?s=612x612&w=0&k=20&c=LvDZS59BNKixejLbrIFDAAYyqs1I3OfPy97tHfo4YQo=" alt="Inspecting Jewelry" style={{ width: '100%', borderRadius: '10px' }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" paragraph style={{ fontSize: '2.5rem', fontWeight: '500' }}>
              Our Reputation
            </Typography>
            <Typography variant="body1" paragraph style={{ fontSize: '1.8rem' }}>
              We are proud of the reputation we have built over the years. Our customers appreciate our dedication to quality, ethical practices, and customer satisfaction. We are committed to maintaining this reputation by continually improving our products and services.
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center" style={{ marginBottom: '50px' }}>
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <Typography variant="h5" paragraph style={{ fontSize: '2.5rem', fontWeight: '500' }}>
              Benefits of Choosing Us
            </Typography>
            <Typography variant="body1" paragraph style={{ fontSize: '1.8rem' }}>
              When you choose our jewelry, you benefit from:
            </Typography>
            <ul>
              <li><Typography variant="body1" component="span" style={{ fontSize: '1.8rem' }}>High-quality craftsmanship</Typography></li>
              <li><Typography variant="body1" component="span" style={{ fontSize: '1.8rem' }}>Ethically sourced materials</Typography></li>
              <li><Typography variant="body1" component="span" style={{ fontSize: '1.8rem' }}>Custom designs tailored to your preferences</Typography></li>
              <li><Typography variant="body1" component="span" style={{ fontSize: '1.8rem' }}>Reliable delivery and excellent customer service</Typography></li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <img src="https://media.istockphoto.com/id/181596884/photo/jewelry-quality-control.jpg?s=612x612&w=0&k=20&c=yIOyiuvTQJL67Uy0D5Rpfm2RaryyX6WRWAYDO7bezxs=" alt="Benefits" style={{ width: '100%', borderRadius: '10px' }} />
          </Grid>
        </Grid>

        <Card variant="outlined" style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="h6" style={{ fontSize: '2.5rem', fontWeight: '500' }}>
              Custom Orders
            </Typography>
            <Typography variant="body2" style={{ fontSize: '1.8rem' }}>
              We take pride in our ability to create custom jewelry based on your specific requirements. From engagement rings to unique necklaces, our skilled artisans work closely with you to bring your vision to life. Contact us today to start designing your one-of-a-kind piece.
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" paragraph style={{ marginTop: '40px', fontSize: '2.5rem', fontWeight: '500' }}>
          Customer Feedback
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1" paragraph style={{ fontSize: '1.8rem' }}>
                  "I couldn't be happier with my custom engagement ring. The attention to detail and quality are outstanding. Thank you for making this special moment even more memorable!"
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.5rem' }}>
                  - Emily R.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1" paragraph style={{ fontSize: '2rem' }}>
                  "Excellent service and beautiful jewelry. The team was very responsive and made sure I got exactly what I wanted. Highly recommend!"
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.5rem' }}>
                  - Michael B.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="body1" paragraph style={{ fontSize: '2rem' }}>
                  "I love my handmade necklace! It's exactly what I envisioned, and the craftsmanship is top-notch. I will definitely be coming back for more."
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ fontSize: '1.5rem' }}>
                  - Sarah W.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
