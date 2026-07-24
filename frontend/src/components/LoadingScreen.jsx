import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Loading workspace...' }) => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        height: '100%',
        width: '100%',
        gap: 3,
        py: 8,
      }}
    >
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow effect in background */}
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          sx={{
            position: 'absolute',
            width: 70,
            height: 70,
            borderRadius: '50%',
            backgroundColor: 'primary.light',
            filter: 'blur(15px)',
            zIndex: 0,
          }}
        />
        <CircularProgress
          size={56}
          thickness={4.5}
          sx={{
            zIndex: 1,
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
      <Typography
        component={motion.p}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontSize: '0.78rem',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
