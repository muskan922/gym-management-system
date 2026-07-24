import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 270;
const collapsedWidth = 88;

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dynamic spacing calculations
  const leftMargin = isMobile ? 0 : (collapsed ? collapsedWidth + 16 : drawerWidth + 16);
  const rightMargin = isMobile ? 0 : 16;
  const contentWidth = isMobile 
    ? '100%' 
    : `calc(100% - ${leftMargin + rightMargin}px)`;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#0B0F19',
        transition: 'background-color 0.3s ease',
      }}
    >
      {/* Sidebar */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${leftMargin}px`,
          width: contentWidth,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Topbar */}
        <Topbar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          mobileOpen={mobileOpen} 
          setMobileOpen={setMobileOpen} 
        />

        {/* Page Content Container */}
        <Box
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              maxWidth: 1400,
              mx: 'auto',
              width: '100%',
            }}
          >
            <Outlet />
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 2.5,
            px: 4,
            textAlign: 'center',
            borderTop: '1px solid',
            borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
            backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#111827',
            borderRadius: isMobile ? 0 : '16px 16px 0 0',
            mx: isMobile ? 0 : 3,
            mb: isMobile ? 0 : 2,
            boxShadow: theme.palette.mode === 'light' 
              ? '0 -2px 10px rgba(0,0,0,0.01)' 
              : '0 -2px 10px rgba(0,0,0,0.2)',
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            &copy; {new Date().getFullYear()} Powerhouse Gym Management System. Built with Premium Material UI and Framer Motion.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
