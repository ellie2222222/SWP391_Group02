import React, {  useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Link } from 'react-router-dom';
import logo from '../assets/imgs/logo.png';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import useAuth from '../../hooks/useAuthContext';
const CustomAppBar = styled(AppBar)({
  backgroundColor: '#fff',
  color: '#000',
});

const CustomButton = styled(Button)({
  color: '#000',
  textTransform: 'uppercase',
  width: '100%',
  height: '100%', // Chiếm toàn bộ chiều cao của Grid item
  fontSize: '1.6rem',
  fontWeight: '400',
  '&:hover': {
    backgroundColor: 'transparent', // Xóa hiệu ứng viền mặc định
    color: '#b48c72', // Thay đổi màu chữ khi hover
    borderRadius: '0',
  },
  '&.active': {
    backgroundColor: 'transparent', // Xóa hiệu ứng viền mặc định
    color: '#b48c72', // Thay đổi màu chữ khi active
    borderRadius: '0',
  },
});

const CustomListItem = styled(ListItem)({  
  textTransform: 'uppercase',
  '&:hover': {
    backgroundColor: 'transparent', // Xóa hiệu ứng viền mặc định
    color: '#b48c72', // Thay đổi màu chữ khi hover
  },
});
const CustomLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
});

const CustomIconButton = styled(IconButton)({
  color: '#000',
  fontSize: '2.6rem',
  
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#b48c72',
  },
});
const CustomTextField = styled(TextField)({
  width: '200px', // Increase the width by 100px
  borderRadius: '30px', // Add border radius to round the corners
  variant: "outlined",
  padding:'0',
  '& fieldset': {
    borderRadius: '30px',
  },
});
const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, logout } = useAuth();

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <CustomLink to='/'><img src={logo} alt="Diamond Logo" style={{ height: '50px', cursor: 'pointer' }} /></CustomLink>
        </Box>
        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerClose}
            >
              <List>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to='/products'>
                    <ListItemText primary="Products" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to='/blogs'>
                    <ListItemText primary="Blogs" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to='/aboutus'>
                    <ListItemText primary="About Us" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <ListItemText primary="Sales" />
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <ListItemText primary="Custom Request" />
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <ListItemIcon>
                    <SearchIcon style={{ fontSize: '1.6rem' }} />
                  </ListItemIcon>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <ListItemIcon>
                    <AccountCircleIcon style={{ fontSize: '1.6rem' }} />
                  </ListItemIcon>
                </CustomListItem>
              </List>
            </Drawer>
          </>
        ) : (
          <Box sx={{ flexGrow: 2, display: 'flex', justifyContent: 'space-between' }}>
           
              <Grid container spacing={0} sx={{ height: '64px' }}> {/* Chiều cao của AppBar */}
                <Grid item xs>
                  <Link to='/products'>
                    <CustomButton>Products</CustomButton>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to='/blogs'>
                    <CustomButton>Blogs</CustomButton>
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link to='/aboutus'>
                    <CustomButton>About Us</CustomButton>
                  </Link>
                </Grid>
                <Grid item xs>
                  <CustomButton>Sales</CustomButton>
                </Grid>
                <Grid item xs>
                  <Link to='/request'>
                    <CustomButton>Custom Request</CustomButton>
                  </Link>
                </Grid>
              </Grid>
            {/* Thêm icon login và thanh search */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomTextField
               
                size="normal"
                label='Search...'
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CustomIconButton color='inherit'>
                        <SearchIcon fontSize='2.6rem' />
                      </CustomIconButton>
                    </InputAdornment>
                  ),
                }}

              />
              {user ? (
                <>
                  <CustomIconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircleIcon fontSize='2.6rem' />
                  </CustomIconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={logout}>Logout</MenuItem>
                    <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                      Profile
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Link to='/login'>
                  <CustomIconButton color="inherit">
                    <AccountCircleIcon fontSize='2.6rem' />
                  </CustomIconButton>
                </Link>
              )}
            </Box>
          </Box>
        )}
      </Toolbar>
    </CustomAppBar>
  );
};

export default Navbar;
