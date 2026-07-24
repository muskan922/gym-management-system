import { Box, Typography, Button, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, actionLabel, onAction, actionIcon }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: 'text.primary',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              fontWeight: 500,
              fontSize: '0.92rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          component={motion.button}
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variant="contained"
          startIcon={actionIcon || <AddIcon />}
          onClick={onAction}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: theme.palette.mode === 'light'
              ? '0 4px 14px rgba(37, 99, 235, 0.25)'
              : '0 4px 20px rgba(0, 0, 0, 0.3)',
            color: '#FFFFFF',
            px: 3,
            py: 1.2,
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            transition: 'box-shadow 0.2s ease',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              boxShadow: theme.palette.mode === 'light'
                ? '0 6px 20px rgba(37, 99, 235, 0.35)'
                : '0 6px 25px rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
