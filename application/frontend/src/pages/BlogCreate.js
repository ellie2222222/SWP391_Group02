import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, styled, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, CardMedia, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Stack, TextField, InputAdornment } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
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
    fontSize: '1.3rem',
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

const CustomTextField = styled(TextField)({
    width: '100%',
    variant: "outlined",
    padding: "0",
    "& .MuiOutlinedInput-root": {
        fontSize: '1.3rem',
        "&:hover fieldset": {
            borderColor: "#b48c72",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#b48c72",
        },
    },
    "& .MuiInputLabel-root": {
        fontSize: '1.3rem',
        "&.Mui-focused": {
            color: "#b48c72",
        },
    },
});

const BlogCreate = () => {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
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
                    ...Object.fromEntries(searchParams),
                },
            });

            setBlogs(response.data.blogs);
            setTotal(response.data.total);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            toast.error('There was an error fetching blogs', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
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

    const handleSearchClick = () => {
        updateQueryParams('search', search, true);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
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
            toast.success('Blog post deleted successfully', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        } catch (error) {
            toast.error('Failed to delete blog post', {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
      };

    const handleSubmit = async (values) => {
        try {
            if (selectedBlog) {
                await axiosInstance.patch(`/blogs/${selectedBlog._id}`, values);
                toast.success('Blog post updated successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                })
            } else {
                await axiosInstance.post('/blogs', values);
                toast.success('Blog post added successfully', {
                    autoClose: 5000, // Auto close after 5 seconds
                    closeOnClick: true,
                    draggable: true,
                })
            }
            fetchBlogs();
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("There was an error saving the blog!", {
                autoClose: 5000, // Auto close after 5 seconds
                closeOnClick: true,
                draggable: true,
            })
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar /> 
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                <Container>
                    <Box mb={2}>
                        <CustomTextField
                            label="Search by blog title"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onKeyDown={handleKeyDown}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <StyledIconButton color="inherit" onClick={handleSearchClick}>
                                            <Search fontSize="large" />
                                        </StyledIconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box mb={2}>
                        <Typography variant='h5'>There are a total of {total} result(s)</Typography>
                    </Box>
                        
                    <CustomButton1 startIcon={<Add />} variant="contained" color="primary" onClick={handleAddClick}>
                        Add Blog
                    </CustomButton1>

                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell>Title</CustomTableCell>
                                    <CustomTableCell>Content</CustomTableCell>
                                    <CustomTableCell align="center">Actions</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {blogs.length > 0 ? (
                                    blogs.map((blog) => (
                                        <TableRow key={blog._id}>
                                            <CustomTableCell>{blog.blog_title}</CustomTableCell>
                                            <CustomTableCell>{truncateText(blog.blog_content, 100)}</CustomTableCell>
                                            <TableCell align="center">
                                                <StyledIconButton onClick={() => handleEditClick(blog)}>
                                                    <Edit fontSize='large'/>
                                                </StyledIconButton>
                                                <StyledIconButton onClick={() => handleDeleteClick(blog._id)}>
                                                    <Delete fontSize='large'/>
                                                </StyledIconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <CustomTableCell align="center" colSpan={4}>
                                            <Typography variant="h6">No blogs found</Typography>
                                        </CustomTableCell>
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
                                size='large'
                            />
                        </Stack>
                    </Box>

                    <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                        <DialogContent>
                            <BlogForm
                                initialValues={selectedBlog || { blog_title: '', blog_content: '', images: [] }}
                                onSubmit={handleSubmit}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDialogOpen(false)} sx={{ fontSize: '1.3rem', color: '#b48c72'}}>
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
