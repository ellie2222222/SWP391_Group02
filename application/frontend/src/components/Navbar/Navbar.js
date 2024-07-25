import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { border, borderRadius, styled } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/imgs/logo.png";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Collapse from "@mui/material/Collapse";
import useAuth from "../../hooks/useAuthContext";
import { Typography } from "@mui/material";
import ArticleIcon from '@mui/icons-material/Article';
import SellIcon from '@mui/icons-material/Sell';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Search } from '@mui/icons-material';

const CustomAppBar = styled(AppBar)({
  backgroundColor: "#fff",
  color: "#000",
});

const CustomButton = styled(Button)({
  color: "#000",
  textTransform: "uppercase",
  width: "100%",
  height: "100%",
  fontSize: "1.6rem",
  fontWeight: "400",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
    borderRadius: "0",
  },
  "&.active": {
    backgroundColor: "transparent",
    color: "#b48c72",
    borderRadius: "0",
  },
});

const CustomListItem = styled(ListItem)({
  textTransform: "uppercase",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
  },
});

const CustomLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
  },
});

const CustomIconButton = styled(IconButton)({
  color: "#000",
  fontSize: "2.6rem",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#b48c72",
  },
});

const CustomTextField = styled(TextField)({
  width: '100%',
  variant: "outlined",
  padding: "0",
  borderRadius: '30px',
  "&  fieldset": {
    borderRadius: '30px',
  },
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

const StyledIconButton = styled(IconButton)({
  color: '#b48c72',
  '&:hover': {
      color: '#8e735c',
  },
});

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [serviceOpen, setServiceOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const allowRole = ["admin", "sale_staff", "manager", "design_staff", "production_staff"];

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

  const handleServiceToggle = () => {
    setServiceOpen(!serviceOpen);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(`/products?name=${search}`)
    }
  };

  const handleLogOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <CustomAppBar position="static">
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <CustomLink to="/">
            <img
              src={logo}
              alt="Diamond Logo"
              style={{ height: "50px", cursor: "pointer" }}
            />
          </CustomLink>
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
                  <CustomLink to="/products">
                    <ListItemText primary="Products" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/blogs">
                    <ListItemText primary="Blogs" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/about-us">
                    <ListItemText primary="About Us" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/warranty-policy">
                    <ListItemText primary="Warranty Policy" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/exchange-policy">
                    <ListItemText primary="Exchange Policy" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/gold-price">
                    <ListItemText primary="Gold Price Today" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <CustomLink to="/request">
                    <ListItemText primary="Custom" />
                  </CustomLink>
                </CustomListItem>
                <CustomListItem button onClick={handleDrawerClose}>
                  <ListItemIcon>
                    <SearchIcon style={{ fontSize: "1.6rem" }} />
                  </ListItemIcon>
                </CustomListItem>
                {user ? (
                  <>
                    <CustomIconButton color="inherit" onClick={handleMenuOpen}>
                      <AccountCircleIcon fontSize="2.6rem" />
                    </CustomIconButton>
                    {allowRole.includes(user.role) ? (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                        <MenuItem component={Link} to={`/management`} onClick={handleMenuClose}>
                          Dashboard
                        </MenuItem>
                      </Menu>
                    ) : (
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                        <MenuItem component={Link} to={`/profile/${user._id}`} onClick={handleMenuClose}>
                          Profile
                        </MenuItem>
                      </Menu>
                    )}
                  </>
                ) : (
                  <Link to="/login">
                    <CustomIconButton color="inherit">
                      <AccountCircleIcon fontSize="2.6rem" />
                    </CustomIconButton>
                  </Link>
                )}
              </List>
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              flexGrow: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid container spacing={0} sx={{ height: "64px" }}>
              <Grid item xs>
                <Link to="/products">
                  <CustomButton>Products</CustomButton>
                </Link>
              </Grid>
              <Grid item xs>
                <Link to="/collections">
                  <CustomButton>Collection</CustomButton>
                </Link>
              </Grid>
              
              <Grid item xs>
                <Link to="/blogs">
                  <CustomButton>Blogs</CustomButton>
                </Link>
              </Grid>
              <Grid item xs>
                <Link to="/about-us">
                  <CustomButton>About Us</CustomButton>
                </Link>
              </Grid>
              <Grid item xs>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                  }}
                  onMouseEnter={handleServiceToggle}
                  onMouseLeave={handleServiceToggle}
                >
                  <CustomButton>Service</CustomButton>
                  <Collapse
                    in={serviceOpen}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                      bgcolor: "background.paper",
                      height: 200,
                      width: 500,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', boxShadow: 3, p: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CustomLink to="/warranty-policy" style={{ textDecoration: 'none' }}>
                          <ArticleIcon sx={{ fontSize: 100, mb: 1 }} />
                          <Typography sx={{ fontSize: '1.3rem' }}>
                            WARRANTY POLICY
                          </Typography>
                        </CustomLink>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CustomLink to="/exchange-policy" style={{ textDecoration: 'none' }}>
                          <ChangeCircleIcon sx={{ fontSize: 100, mb: 1 }} />
                          <Typography sx={{ fontSize: '1.3rem' }}>
                            EXCHANGE POLICY
                          </Typography>
                        </CustomLink>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CustomLink to="/gold-price" style={{ textDecoration: 'none' }}>
                          <SellIcon sx={{ fontSize: 100, mb: 1 }} />
                          <Typography sx={{ fontSize: '1.3rem' }}>
                            GOLD PRICE TODAY
                          </Typography>
                        </CustomLink>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
              <Grid item xs>
                <Link to="/request">
                  <CustomButton>Custom</CustomButton>
                </Link>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CustomTextField
                size="normal"
                label="Search..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <StyledIconButton color="inherit" onClick={() => navigate(`/products?name=${search}`)}>
                        <Search fontSize="large" />
                      </StyledIconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {user ? (
                <>
                  <CustomIconButton color="inherit" onClick={handleMenuOpen}>
                    <AccountCircleIcon fontSize="2.6rem" />
                  </CustomIconButton>
                  {allowRole.includes(user.role) ? (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                      <MenuItem component={Link} to={`/management`} onClick={handleMenuClose}>
                        Dashboard
                      </MenuItem>
                    </Menu>
                  ) : (
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                      <MenuItem component={Link} to={`/profile/${user._id}`} onClick={handleMenuClose}>
                        Profile
                      </MenuItem>
                    </Menu>
                  )}
                </>
              ) : (
                <Link to="/login">
                  <CustomIconButton color="inherit">
                    <AccountCircleIcon fontSize="2.6rem" />
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
