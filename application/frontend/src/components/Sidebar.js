import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
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
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
    backgroundColor:'#b48c72',
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
    padding:'0 20px',
    color:'#000',
});


export default function MiniDrawer() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const CustomListItemIcon = styled(ListItemIcon)({
        minWidth: 0,
        mr: open ? 3 : 'auto',
        justifyContent: 'center',
        marginRight:'24px',
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
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Dashboard                    
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key="Jewelry" disablePadding sx={{ display: 'block' }}>
                        <Link to='/admin'>
                            <CustomListItemButton>
                                <CustomListItemIcon
                                >
                                    <LocalOfferIcon />
                                </CustomListItemIcon>
                                <ListItemText primary="Jewelry" sx={{ opacity: open ? 1 : 0 }} />
                            </CustomListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Orders" disablePadding sx={{ display: 'block' }}>
                        <Link>
                            <CustomListItemButton>
                                <CustomListItemIcon
                                >
                                    <ShoppingCartIcon />
                                </CustomListItemIcon>
                                <ListItemText primary="Orders" sx={{ opacity: open ? 1 : 0 }} />
                            </CustomListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Users" disablePadding sx={{ display: 'block' }}>
                        <Link to='/admin/users'>
                            <CustomListItemButton>
                                <CustomListItemIcon
                                >
                                     <PeopleIcon />
                                   
                                </CustomListItemIcon>
                                <ListItemText primary="Users" sx={{ opacity: open ? 1 : 0 }} />
                            </CustomListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem key="Warranty" disablePadding sx={{ display: 'block' }}>
                        <Link to=''>
                            <CustomListItemButton>
                                <CustomListItemIcon
                                >
                                     <PeopleIcon />
                                   
                                </CustomListItemIcon>
                                <ListItemText primary="Warranty" sx={{ opacity: open ? 1 : 0 }} />
                            </CustomListItemButton>
                        </Link>
                    </ListItem>
                </List>
                <Divider />

            </Drawer>
        </Box>

    );
}