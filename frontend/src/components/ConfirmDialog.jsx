import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { WarningAmberRounded as WarningIcon } from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  confirmColor = 'error',
  loading = false,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: '20px', 
          p: 1.5,
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
        },
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>
        {/* Left: Modern Warning Icon for Delete/Destructive actions */}
        {confirmColor === 'error' && (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              color: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <WarningIcon />
          </Box>
        )}
        <Box sx={{ flexGrow: 1 }}>
          <DialogTitle sx={{ fontWeight: 800, p: 0, mb: 1, fontSize: '1.2rem' }}>
            {title}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.92rem', lineHeight: 1.5 }}>
              {message}
            </DialogContentText>
          </DialogContent>
        </Box>
      </Box>
      
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button 
          onClick={onCancel} 
          disabled={loading} 
          variant="outlined"
          sx={{ 
            borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
            color: 'text.secondary',
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={confirmColor}
          autoFocus
          sx={{
            px: 3,
            boxShadow: confirmColor === 'error' 
              ? '0 4px 12px rgba(239, 68, 68, 0.15)' 
              : '0 4px 12px rgba(37, 99, 235, 0.15)',
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
