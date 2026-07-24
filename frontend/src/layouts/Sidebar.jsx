import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  FitnessCenter as TrainerIcon,
  CardMembership as PlanIcon,
  CalendarToday as AttendanceIcon,
  Payments as PaymentIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';

const drawerWidth = 270;
const collapsedWidth = 88;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Members', icon: <PeopleIcon />, path: '/members' },
  { text: 'Trainers', icon: <TrainerIcon />, path: '/trainers' },
  { text: 'Membership Plans', icon: <PlanIcon />, path: '/plans' },
  { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
  { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
  { text: 'Reports', icon: <ReportIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        py: 2.5,
        px: collapsed ? 1.5 : 2,
        background: theme.palette.mode === 'light' 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <Box>
        {/* Logo Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            mb: 4,
            px: collapsed ? 0 : 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component={motion.div}
              whileHover={{ rotate: 15, scale: 1.05 }}
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                fontWeight: 800,
                fontSize: 22,
                boxShadow: `0 4px 14px ${theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(0,0,0,0.3)'}`,
              }}
            >
              P
            </Box>
            {!collapsed && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: '1.05rem', bgGradient: 'linear-gradient(135deg, #2563EB, #4F46E5)' }}
                >
                  Powerhouse
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}
                >
                  Gym Management
                </Typography>
              </Box>
            )}
          </Box>
          {!isMobile && !collapsed && (
            <IconButton onClick={() => setCollapsed(true)} size="small" sx={{ color: 'text.secondary' }}>
              <ChevronLeftIcon />
            </IconButton>
          )}
          {!isMobile && collapsed && (
            <IconButton onClick={() => setCollapsed(false)} size="small" sx={{ color: 'text.secondary', display: 'none' }}>
              <ChevronRightIcon />
            </IconButton>
          )}
        </Box>

        {/* Navigation list */}
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
                <Tooltip title={collapsed ? item.text : ''} placement="right" arrow>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      borderRadius: '12px',
                      py: 1.4,
                      px: collapsed ? 1.5 : 2,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      backgroundColor: active 
                        ? theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(37, 99, 235, 0.15)'
                        : 'transparent',
                      color: active ? 'primary.main' : 'text.secondary',
                      borderLeft: active ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: active 
                          ? theme.palette.mode === 'light' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.2)'
                          : 'action.hover',
                        color: 'text.primary',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 0 : 38,
                        color: active ? 'primary.main' : 'text.secondary',
                        justifyContent: 'center',
                        transition: 'color 0.2s',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.92rem',
                          fontWeight: active ? 700 : 500,
                          letterSpacing: '-0.01em',
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Footer Profile Section */}
      <Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            gap: 1,
            px: collapsed ? 0 : 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: 'primary.main',
                fontSize: '0.95rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)',
              }}
            >
              {user?.name ? getInitials(user.name) : <PersonIcon />}
            </Avatar>
            {!collapsed && (
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 130 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Admin'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', display: 'block' }}>
                  {user?.role?.toLowerCase() || 'manager'}
                </Typography>
              </Box>
            )}
          </Box>
          {!collapsed ? (
            <Tooltip title="Log out" placement="top">
              <IconButton onClick={handleLogout} color="error" size="small" sx={{ borderRadius: '10px' }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Log out" placement="right">
              <IconButton onClick={handleLogout} color="error" size="small" sx={{ mt: 1 }}>
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button - managed by Layout now */}
      
      {/* Mobile Temporary Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              border: 'none',
              backgroundColor: 'transparent',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* Desktop Floating Sidebar */
        <Box
          component={motion.div}
          animate={{ width: currentWidth }}
          transition={{ duration: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
          sx={{
            width: currentWidth,
            flexShrink: 0,
            height: 'calc(100vh - 32px)',
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1100,
          }}
        >
          <Box
            sx={{
              height: '100%',
              borderRadius: '20px',
              border: '1px solid',
              borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
              overflow: 'hidden',
              boxShadow: theme.palette.mode === 'light'
                ? '0 10px 30px -5px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.01)'
                : '0 10px 30px -5px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {drawerContent}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Sidebar;
