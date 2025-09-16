import React, { useState, useContext } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    Box, 
    IconButton, 
    Menu, 
    MenuItem, 
    Avatar, 
    Tooltip,
    ListItemIcon
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';

// Import Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    // --- Handlers for opening/closing menus ---
    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleLogout = () => {
        logout();
        handleCloseUserMenu(); // Close the menu after action
        navigate('/login');
    };

    // --- Navigation Links Configuration ---
    // This makes it easy to add/remove links
    const navLinks = [
        { title: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" />, requiresAuth: true },
        { title: 'My Applications', path: '/my-applications', icon: <ListAltIcon fontSize="small" />, requiresAuth: true },
        { title: 'Admin Panel', path: '/admin', icon: <AdminPanelSettingsIcon fontSize="small" />, requiresAuth: true, adminOnly: true },
    ];

    const visibleNavLinks = navLinks.filter(link => {
        if (!link.requiresAuth) return true;
        if (!user) return false;
        if (link.adminOnly && user.role !== 'admin') return false;
        return true;
    });

    return (
        <AppBar position="static">
            <Toolbar>
                {/* --- Logo / Brand Name (Visible on all screen sizes) --- */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        mr: 2,
                        flexGrow: { xs: 1, md: 0 }, // Takes all space on mobile
                        textDecoration: 'none',
                        color: 'inherit',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.1rem',
                    }}
                >
                    Sai Setu Center
                </Typography>

                {/* --- Desktop Navigation Links --- */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
                    {user && visibleNavLinks.map((page) => (
                        <Button
                            key={page.title}
                            component={Link}
                            to={page.path}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page.title}
                        </Button>
                    ))}
                </Box>
                
                {/* --- Mobile Navigation (Hamburger Menu) --- */}
                {user && (
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
                        <IconButton
                            size="large"
                            aria-label="navigation menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {visibleNavLinks.map((page) => (
                                <MenuItem key={page.title} component={Link} to={page.path} onClick={handleCloseNavMenu}>
                                    <ListItemIcon>{page.icon}</ListItemIcon>
                                    <Typography textAlign="center">{page.title}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                )}


                {/* --- User/Auth Section (Right side) --- */}
                <Box sx={{ flexGrow: 0 }}>
                    {user ? (
                        <>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    {/* Display user's initial in Avatar */}
                                    <Avatar alt={user.name}>{user.name.charAt(0).toUpperCase()}</Avatar>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-user"
                                anchorEl={anchorElUser}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem disabled>
                                    <Typography>Welcome, {user.name}</Typography>
                                </MenuItem>

                                {/* You can add more user-specific links here */}

                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        // --- Unauthenticated User Links ---
                        <Box>
                            <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register" startIcon={<AppRegistrationIcon />}>
                                Register
                            </Button>
                        </Box>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;