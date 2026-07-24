import { Box, Typography, Button, useTheme } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

const EmptyState = ({ message = 'No data found', actionLabel, onAction }) => {
  const theme = useTheme();
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
        gap: 2,
        color: 'text.secondary',
        borderRadius: '16px',
        backgroundColor: theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.5)' : 'rgba(30, 41, 59, 0.2)',
        border: '1px dashed',
        borderColor: theme.palette.divider,
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <InboxOutlined sx={{ fontSize: 32, opacity: 0.6, color: 'text.secondary' }} />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>
        {message}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto', mt: -1 }}>
        We couldn&apos;t find any records. Add new items to populate the data.
      </Typography>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          sx={{ 
            mt: 1, 
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
