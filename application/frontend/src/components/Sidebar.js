import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import FeedIcon from '@mui/icons-material/Feed';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedIcon from '@mui/icons-material/Verified';
import Button from '@mui/material/Button';
import PendingIcon from '@mui/icons-material/Pending';
import useAuth from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { Dashboard, Diamond } from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#b48c72',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const CustomListItemButton = styled(ListItemButton)({
    minHeight: 48,
    justifyContent: 'initial',
    px: 2.5,
    padding: '0 20px',
    color: '#000',
});

const CustomListItemText = styled(ListItemText)({
    '& .MuiListItemText-primary': {
        fontSize: '1.3rem'
    }
})

export default function Sidebar() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleLogout = () => {
        logout();
    };

    const handleNavigateHome = () => {
        navigate('/');
    };

    const CustomListItemIcon = styled(ListItemIcon)({
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
        marginRight: '24px',
    });

    return (
        <Box>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon fontSize='large' />
                    </IconButton>
                    <Typography variant="h4" noWrap component="div">
                        Management
                    </Typography>
                    <Button
                        onClick={handleNavigateHome}
                        color="inherit"
                        sx={{ marginLeft: 'auto', fontSize: '1.5rem' }}
                    >
                        Home
                    </Button>
                    <Button color="inherit" onClick={handleLogout} sx={{ fontSize: "1.5rem" }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon fontSize='large' /> : <ChevronLeftIcon fontSize='large' />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key="Jewelry" disablePadding sx={{ display: 'block' }}>
                        <Link to='/management'>
                            <CustomListItemButton>
                                <CustomListItemIcon>
                                    <LocalOfferIcon fontSize='large' />
                                </CustomListItemIcon>
                                <CustomListItemText primary="Jewelry" sx={{ opacity: open ? 1 : 0 }} />
                            </CustomListItemButton>
                        </Link>
                    </ListItem>
                    {user.role !== 'admin' && user.role !== 'user' && (
                        <ListItem key="My Requests" disablePadding sx={{ display: 'block' }}>
                            <Link to='/management/requests'>
                                <CustomListItemButton>
                                    <CustomListItemIcon>
                                        <ShoppingCartIcon fontSize='large' />
                                    </CustomListItemIcon>
                                    <CustomListItemText primary="Customer Requests" sx={{ opacity: open ? 1 : 0 }} />
                                </CustomListItemButton>
                            </Link>
                        </ListItem>
                    )}
                    {user.role === 'manager' && (
                        <div>
                            <ListItem key="My Requests" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/pending-requests'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <PendingIcon fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Pending Requests" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem key="Users" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/dashboard'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <Dashboard fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem key="Quote Requests" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/quote-request'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <RequestQuoteIcon fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Quote Requests" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem key="Gemstones" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/gemstones'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <Diamond fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Gemstones" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem key="Materials" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/materials'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <Diamond fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Materials" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                        </div>
                    )}
                    {user.role === 'admin' && (
                        <ListItem key="Users" disablePadding sx={{ display: 'block' }}>
                            <Link to='/management/users'>
                                <CustomListItemButton>
                                    <CustomListItemIcon>
                                        <PeopleIcon fontSize='large' />
                                    </CustomListItemIcon>
                                    <CustomListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
                                </CustomListItemButton>
                            </Link>
                        </ListItem>
                    )}
                    {user.role === 'admin' && (
                        <ListItem key="Blogs" disablePadding sx={{ display: 'block' }}>
                            <Link to='/management/blogs'>
                                <CustomListItemButton>
                                    <CustomListItemIcon>
                                        <FeedIcon fontSize='large' />
                                    </CustomListItemIcon>
                                    <CustomListItemText primary="Blogs" sx={{ opacity: open ? 1 : 0 }} />
                                </CustomListItemButton>
                            </Link>
                        </ListItem>
                    )}
                    {user.role === 'admin' && (
                        <ListItem key="Staffs" disablePadding sx={{ display: 'block' }}>
                            <Link to='/management/staffs'>
                                <CustomListItemButton>
                                        <CustomListItemIcon>
                                    <PeopleIcon fontSize='large' />
                                    </CustomListItemIcon>
                                    <CustomListItemText primary="Staffs" sx={{ opacity: open ? 1 : 0 }} />
                                </CustomListItemButton>
                            </Link>
                        </ListItem>
                    )}
                    {(user.role === 'sale_staff' || user.role === 'manager') && (
                        <div>
                            <ListItem key="invoices" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/invoices'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <ReceiptIcon fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Invoices" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                            <ListItem key="Warranty" disablePadding sx={{ display: 'block' }}>
                                <Link to='/management/warranty-request'>
                                    <CustomListItemButton>
                                        <CustomListItemIcon>
                                            <VerifiedIcon fontSize='large' />
                                        </CustomListItemIcon>
                                        <CustomListItemText primary="Warranty" sx={{ opacity: open ? 1 : 0 }} />
                                    </CustomListItemButton>
                                </Link>
                            </ListItem>
                        </div>
                    )}

                </List>
                <Divider />
            </Drawer>
        </Box>
    );
}
