import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import useAuth from '../hooks/useAuthContext';


const WarrantyLists = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const response = await axiosInstance.get('/warranties', 
    );
        setWarranties(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchWarranties();
  }, [user.token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box padding="40px 0" minHeight="60vh">
        <Typography variant="h2" component="h1" marginBottom="20px" textAlign="center">
          Warranty List
        </Typography>
        <Grid container spacing={3}>
          {warranties.map((warranty, index) => (
            <Grid item xs={12} sm={6} md={4} key={warranty._id}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="p" marginBottom="20px">
                    Warranty #{index + 1}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Warranty ID: {warranty._id}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Jewelry ID: {warranty.jewelry_id}
                  </Typography>
                  <Typography variant="body1" component="p">
                    User ID: {warranty.user_id}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Content: {warranty.warranty_content}
                  </Typography>
                  <Typography variant="body1" component="p">
                    Start Date: {new Date(warranty.warranty_start_date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" component="p">
                    End Date: {new Date(warranty.warranty_end_date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default WarrantyLists;
