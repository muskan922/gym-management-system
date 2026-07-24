import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  useTheme,
  InputBase,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';
import { getInitials } from '../utils/helpers';
import { motion } from 'framer-motion';

const getPageMeta = (pathname) => {
  if (pathname === '/dashboard') return { title: 'Dashboard Overview', breadcrumb: 'Dashboard' };
  if (pathname.startsWith('/members')) return { title: 'Members Directory', breadcrumb: 'Members' };
  if (pathname.startsWith('/trainers')) return { title: 'Trainers Registry', breadcrumb: 'Trainers' };
  if (pathname.startsWith('/plans')) return { title: 'Membership Plans', breadcrumb: 'Plans' };
  if (pathname.startsWith('/attendance')) return { title: 'Attendance Tracking', breadcrumb: 'Attendance' };
  if (pathname.startsWith('/payments')) return { title: 'Payments Ledger', breadcrumb: 'Payments' };
  if (pathname.startsWith('/reports')) return { title: 'Analytics Reports', breadcrumb: 'Reports' };
  if (pathname.startsWith('/settings')) return { title: 'System Settings', breadcrumb: 'Settings' };
  if (pathname.startsWith('/profile')) return { title: 'My Profile', breadcrumb: 'Profile' };
  return { title: 'Page', breadcrumb: 'App' };
};

const Topbar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState(null);

  const meta = getPageMeta(location.pathname);

  // Notifications Mock Data
  const notifications = [
    { id: 1, text: 'Member John Doe registered', desc: 'Assigned to Plan: Premium Gym', time: '5m ago' },
    { id: 2, text: 'Payment received from Sarah L.', desc: 'Monthly Subscription: $50.00', time: '1h ago' },
    { id: 3, text: 'Trainer Mark Watson added', desc: 'Specialty: Strength Training', time: '1d ago' },
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotiOpen = (event) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 },
        py: 2,
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.8)' : 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        gap: 2,
      }}
    >
      {/* Left: Collapse Button, Title & Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Toggle Button for mobile and desktop */}
        <IconButton
          color="inherit"
          onClick={() => {
            if (window.innerWidth < 900) {
              setMobileOpen(!mobileOpen);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          sx={{
            borderRadius: '10px',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
            p: 1,
            mr: 1,
          }}
        >
          {window.innerWidth < 900 ? (
            <MenuIcon fontSize="small" />
          ) : collapsed ? (
            <ChevronRightIcon fontSize="small" />
          ) : (
            <ChevronLeftIcon fontSize="small" />
          )}
        </IconButton>

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {/* Breadcrumbs */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              App
            </Typography>
            <Typography variant="caption" color="text.secondary">
              /
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
              {meta.breadcrumb}
            </Typography>
          </Box>
          {/* Page Title */}
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            {meta.title}
          </Typography>
        </Box>
      </Box>

      {/* Middle: Search Bar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
          borderRadius: '12px',
          px: 1.8,
          py: 0.8,
          width: 320,
          maxWidth: '100%',
          transition: 'all 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
            boxShadow: `0 0 0 3px ${theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(37, 99, 235, 0.2)'}`,
          },
        }}
      >
        <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1.2 }} />
        <InputBase
          placeholder="Search anything... (Ctrl + K)"
          sx={{ fontSize: '0.88rem', width: '100%' }}
        />
      </Box>

      {/* Right: Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Search button for Mobile/Tablet */}
        <IconButton
          sx={{
            display: { xs: 'flex', md: 'none' },
            borderRadius: '10px',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <SearchIcon fontSize="small" />
        </IconButton>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              borderRadius: '10px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              p: 1,
            }}
          >
            {mode === 'light' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Notifications Icon */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={handleNotiOpen}
            sx={{
              borderRadius: '10px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              p: 1,
            }}
          >
            <Badge badgeContent={notifications.length} color="error" overlap="circular" variant="dot">
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Dropdown Block */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            cursor: 'pointer',
            borderRadius: '12px',
            p: '4px 8px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
          onClick={handleMenu}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              backgroundColor: 'primary.main',
              fontWeight: 700,
              fontSize: '0.88rem',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)',
            }}
          >
            {user?.name ? getInitials(user.name) : <PersonIcon />}
          </Avatar>
          <Box sx={{ textAlign: 'left', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
              {user?.role || 'Admin'}
            </Typography>
          </Box>
        </Box>

        {/* User Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
              p: 1,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => { handleClose(); navigate('/profile'); }} sx={{ py: 1.2, borderRadius: '10px' }}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => { handleClose(); navigate('/settings'); }} sx={{ py: 1.2, borderRadius: '10px' }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={handleLogout} sx={{ py: 1.2, borderRadius: '10px', color: 'error.main', '&:hover': { backgroundColor: 'error.lighter' } }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Popover */}
        <Popover
          open={Boolean(notiAnchorEl)}
          anchorEl={notiAnchorEl}
          onClose={handleNotiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 320,
              borderRadius: '18px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
              p: 1.5,
              mt: 1.5,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ cursor: 'pointer', fontWeight: 600 }}>
              Mark all read
            </Typography>
          </Box>
          <Divider />
          <List sx={{ py: 0 }}>
            {notifications.map((n) => (
              <ListItem key={n.id} disablePadding sx={{ py: 1.5, borderBottom: `1px solid ${theme.palette.divider}`, '&:last-child': { borderBottom: 'none' } }}>
                <ListItemText
                  primary={n.text}
                  secondary={n.desc}
                  primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600, color: 'text.primary' }}
                  secondaryTypographyProps={{ fontSize: '0.78rem', color: 'text.secondary', sx: { mt: 0.2 } }}
                />
                <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'flex-start', mt: 0.5, ml: 1 }}>
                  {n.time}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>
    </Box>
  );
};

export default Topbar;
