import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, styled, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Stack } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import BlogForm from '../components/BlogForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';  // Import the Sidebar component

const CustomButton1 = styled(Button)({
    backgroundColor: '#b48c72',
    color: '#fff',
    width: '100%',
    fontSize: '1rem',
    '&:hover': {
        color: '#b48c72',
        backgroundColor: 'transparent',
    },
});

const StyledIconButton = styled(IconButton)({
    color: '#b48c72',
    '&:hover': {
        color: '#8e735c',
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

const CustomTableCell = styled(TableCell)({
    fontSize: '1.3rem',
});

const BlogCreate = () => {
    const [blogs, setBlogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchBlogs = async () => {
        try {
            const response = await axiosInstance.get('/blogs', {
                params: {
                    page,
                },
            });

            setBlogs(response.data.blogs);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("There was an error fetching the blogs!", error);
        }
    };

    const updateQueryParams = (key, value, resetPage = false) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key);
        }
        if (resetPage) {
            newSearchParams.set('page', '1');
        }
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        updateQueryParams('page', newPage.toString());
    };

    useEffect(() => {
        fetchBlogs();
    }, [searchParams, page]);

    const handleAddClick = () => {
        setSelectedBlog(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (blog) => {
        setSelectedBlog(blog);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (id) => {
        try {
            await axiosInstance.delete(`/blogs/${id}`);
            fetchBlogs();
            toast.success('Blog post deleted successfully');
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog post');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (selectedBlog) {
                await axiosInstance.patch(`/blogs/${selectedBlog._id}`, values);
                toast.success('Blog post updated successfully');
            } else {
                await axiosInstance.post('/blogs', values);
                toast.success('Blog post added successfully');
            }
            fetchBlogs();
            setIsDialogOpen(false);
        } catch (error) {
            console.error("There was an error saving the blog!", error);
            toast.error(error.response?.data?.error || error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar /> 
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container>
                    <Typography variant="h4" gutterBottom>Manage Blogs</Typography>

                    <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={handleAddClick}>
                        Add Blog
                    </CustomButton1>

                    <TableContainer component={Paper} sx={{ mt: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Title</CustomTableCell>
                                    <CustomTableCell>Content</CustomTableCell>
                                    <CustomTableCell>Images</CustomTableCell>
                                    <CustomTableCell align="center">Actions</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <TableRow key={blog._id}>
                                            <CustomTableCell>{blog.blog_title}</CustomTableCell>
                                            <CustomTableCell>{blog.blog_content}</CustomTableCell>
                                            <TableCell>
                                                {blog.images && blog.images[0] && (
                                                    <CardMedia
                                                        component="img"
                                                        alt="Blog"
                                                        image={blog.images[0]}
                                                        sx={{ width: '100%', maxHeight: '150px' }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <StyledIconButton onClick={() => handleEditClick(blog)}>
                                                    <Edit />
                                                </StyledIconButton>
                                                <StyledIconButton onClick={() => handleDeleteClick(blog._id)}>
                                                    <Delete />
                                                </StyledIconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell align="center" colSpan={4}>
                                            <Typography variant="h6">No blogs found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box display="flex" justifyContent="center" marginTop="20px">
                        <Stack spacing={2}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    </Box>

                    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                        <DialogTitle>{selectedBlog ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
                        <DialogContent>
                            <BlogForm
                                initialValues={selectedBlog || { blog_title: '', blog_content: '', images: [] }}
                                onSubmit={handleSubmit}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Container>
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default BlogCreate;
