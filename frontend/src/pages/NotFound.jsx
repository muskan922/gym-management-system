import { Box, Typography, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 3,
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#0B0F19',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 900,
          fontSize: { xs: '6rem', sm: '9rem' },
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          mb: 2,
          letterSpacing: '-0.05em',
        }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.02em' }}>
        Page Not Found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 360, fontWeight: 500, lineHeight: 1.5 }}>
        The page you are looking for doesn&apos;t exist, has been removed, or was relocated.
      </Typography>
      <Button
        component={motion.button}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        variant="contained"
        size="large"
        startIcon={<HomeIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
          px: 4,
          py: 1.4,
          borderRadius: '12px',
          fontWeight: 700,
        }}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
