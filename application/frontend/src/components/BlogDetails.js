import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { styled } from '@mui/system';
import axiosInstance from '../utils/axiosInstance';

const CustomButton1 = styled(Button)({
  outlineColor: '#000',
  backgroundColor: '#b48c72',
  color: '#fff',
  width: '100%',
  fontSize: '1rem',
  marginTop: '20px',
  '&:hover': {
    color: '#b48c72',
    backgroundColor: 'transparent',
  },
});

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blogs/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error('There was an error fetching the blog!', error);
        setLoading(false);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        setBlogs(response.data.blogs);
      } catch (error) {
        console.error('There was an error fetching the blogs!', error);
      }
    };

    fetchBlog();
    fetchBlogs();
  }, [id]);

  const renderBlogContent = (content, images) => {
    if (!content || !images) return null;

    const parts = content.split(/(\[image\d+\])/);
    return parts.map((part, index) => {
      const match = part.match(/\[image(\d+)\]/);
      if (match) {
        const imageIndex = parseInt(match[1], 10);
        if (images[imageIndex]) {
          return <img key={index} src={images[imageIndex]} alt={`blog image ${imageIndex}`} style={{ width: '100%', borderRadius: '10px', margin: '20px 0' }} />;
        }
      }
      return <Typography key={index} variant="body1" component="div" style={{ whiteSpace: 'pre-line' }}>{part}</Typography>;
    });
  };

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
    );
  }

  return (
    <Container>
      <Box display="flex" flexDirection="row" padding="40px 0" minHeight="100vh">
        <Box flex={1} mr={4}>
          <Typography variant="h4" component="h1" gutterBottom>{blog.blog_title}</Typography>
          {renderBlogContent(blog.blog_content, blog.blog_images)}
          <CustomButton1 onClick={() => navigate(-1)}>Go Back</CustomButton1>
        </Box>
        <Box width="300px">
          <Typography variant="h5" gutterBottom>Recommended Blogs</Typography>
          <Grid container spacing={2}>
            {blogs.map((recommendedBlog) => (
              <Grid item xs={12} key={recommendedBlog._id}>
                <Card
                  onClick={() => navigate(`/blog/${recommendedBlog._id}`)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}
                >
                  <CardMedia
                    component="img"
                    image={recommendedBlog.blog_images && recommendedBlog.blog_images[0] ? recommendedBlog.blog_images[0] : ''}
                    alt={recommendedBlog.blog_title}
                    style={{ width: '40%', height: '100px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
                  />
                  <CardContent style={{ flex: '1 0 auto' }}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      {new Date(recommendedBlog.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      {recommendedBlog.blog_title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogDetails;
