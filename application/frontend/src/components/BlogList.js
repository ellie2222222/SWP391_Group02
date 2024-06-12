import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  border: '1px solid #000',
  color: '#000',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72', // Thay đổi màu chữ khi hover
    border: '1px solid #b48c72',
    backgroundColor: 'transparent',
  },
});

const BlogLists = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/blogs') // Thay đổi URL tới API của bạn
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the blogs!', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box padding='40px 0' minHeight="100vh">
        <Grid container spacing={2}>
          {blogs.map((blog, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card onClick={() => navigate(`/blog/${blog._id}`)}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {blog.blog_title}
                  </Typography>                 
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default BlogLists;
