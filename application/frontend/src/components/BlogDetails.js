import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, styled } from '@mui/material';
import axios from 'axios';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  backgroundColor:'#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72', // Thay đổi màu chữ khi hover
    backgroundColor: 'transparent',
  },
});

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/blogs/${id}`)
      .then(response => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the blog!', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Blog not found</Typography>
      </Box>
    )
  }

  return (
    <Container>
      <Box display="flex" flexDirection="row" padding="40px 0" minHeight="100vh">
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
          <Typography variant="h4" component="h1">{blog.blog_title}</Typography>
          <Typography variant="body1"> {blog.blog_content}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogDetails;
