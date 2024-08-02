//home page blog list 
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, CircularProgress, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

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
        <Typography variant="h2">There are no blogs available at the moment.</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Box padding="60px 0">
        <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold' }}>Read our latest blog</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            {blogsData.blogs.length > 0 && (
              <Card onClick={() => navigate(`/blog/${blogsData.blogs[0]._id}`)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  image={blogsData.blogs[0].blog_images && blogsData.blogs[0].blog_images.length > 0 ? blogsData.blogs[0].blog_images[0] : ''}
                  alt={blogsData.blogs[0].blog_title}
                  style={{ width: '60%', height: '300px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}
                />
                <CardContent style={{ flex: '1 0 auto' }}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ fontSize: '1.2rem' }}>
                    {blogsData.blogs[0].category} {new Date(blogsData.blogs[0].createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography gutterBottom variant="h5" component="div" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {blogsData.blogs[0].blog_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div" style={{ marginTop: '8px', fontSize: '1.2rem' }}>
                    {blogsData.blogs[0].excerpt}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '40px', fontSize: '2rem', fontWeight: 'bold' }}>Trending</Typography>
        <Grid container spacing={4}>
          {blogsData.blogs.slice(1, 4).map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card onClick={() => navigate(`/blog/${blog._id}`)} style={{ cursor: 'pointer', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  image={blog.blog_images && blog.blog_images.length > 0 ? blog.blog_images[0] : ''}
                  alt={blog.blog_title}
                  style={{ height: '180px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ fontSize: '1.2rem' }}>
                    {blog.category} {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {blog.blog_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div" style={{ marginTop: '8px', fontSize: '1.2rem' }}>
                    {blog.excerpt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '40px', fontSize: '2rem', fontWeight: 'bold' }}>Popular</Typography>
        <Grid container spacing={4}>
          {blogsData.blogs.slice(4, 7).map((blog, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card onClick={() => navigate(`/blog/${blog._id}`)} style={{ cursor: 'pointer', boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <CardMedia
                  component="img"
                  image={blog.blog_images && blog.blog_images.length > 0 ? blog.blog_images[0] : ''}
                  alt={blog.blog_title}
                  style={{ height: '180px', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}
                />
                <CardContent>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom style={{ fontSize: '1.2rem' }}>
                    {blog.category} {new Date(blog.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    {blog.blog_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="div" style={{ marginTop: '8px', fontSize: '1.2rem' }}>
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
