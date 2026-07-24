import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../services/authService';
import { getInitials } from '../utils/helpers';
import { motion } from 'framer-motion';

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await updateProfile(profileForm);
      updateUser(res.data?.user);
      toast.success('Profile details updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
          Manage your personal details, verify credentials, and update password parameters.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Card: Summary Profile */}
        <Grid item xs={12} md={4}>
          <Card sx={{ textAlign: 'center', p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 110,
                height: 110,
                mb: 3,
                backgroundColor: 'primary.main',
                fontSize: '2.5rem',
                fontWeight: 800,
                boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
              }}
            >
              {user?.name ? getInitials(user.name) : <PersonIcon />}
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
              {user?.email}
            </Typography>
            <Chip
              icon={<BadgeIcon />}
              label={user?.role || 'Staff'}
              color="primary"
              variant="filled"
              sx={{ fontWeight: 700, height: 28, px: 1 }}
            />
          </Card>
        </Grid>

        {/* Right Cards: Actions Form */}
        <Grid item xs={12} md={8}>
          {/* Edit details */}
          <Card sx={{ p: { xs: 3, sm: 4 }, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PersonIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Personal Information
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleProfileUpdate}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Full Name" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Email Address" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component={motion.button}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    variant="contained"
                    disabled={profileLoading}
                    sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}
                  >
                    {profileLoading ? 'Saving...' : 'Update Details'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Change password */}
          <Card sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  color: 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SecurityIcon fontSize="small" />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Change Password
              </Typography>
            </Box>

            <Box component="form" onSubmit={handlePasswordChange}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Current Password" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required helperText="Minimum 6 characters" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    component={motion.button}
                    whileHover={{ y: -2, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    variant="contained"
                    color="warning"
                    disabled={passwordLoading}
                    sx={{ boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)', color: '#FFFFFF' }}
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
