import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box, Button } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  border: '1px solid #000',
  color: '#000',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72',
    border: '1px solid #b48c72',
    backgroundColor: 'transparent',
  },
});

const BlogLists = () => {
  const [blogsData, setBlogsData] = useState({ blogs: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        setBlogsData(response.data); // expecting response.data to be { blogs: [], total: ..., totalPages: ..., currentPage: ... }
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the blogs!', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (blogsData.blogs.length <= 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">There are no blogs available.</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box padding="60px 0">
        <Grid container spacing={4}>
          {blogsData.blogs.map((blog, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                onClick={() => navigate(`/blog/${blog._id}`)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
              >
                <CardMedia
                  component="img"
                  image={blog.blog_images && blog.blog_images.length > 0 ? blog.blog_images[0] : ''} // Use the first image as the thumbnail
                  alt={blog.blog_title}
                  style={{ width: '40%', height: '180px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
                />
                <CardContent style={{ flex: '1 0 auto' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {blog.category} {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                    {blog.blog_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div" style={{ marginTop: '8px' }}>
                    {blog.excerpt}
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

export default BlogLists;
