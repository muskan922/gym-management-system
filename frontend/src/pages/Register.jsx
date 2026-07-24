import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Link,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  FitnessCenter as GymIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#0B0F19',
      }}
    >
      {/* Left: Illustration & Motivational text */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#FFFFFF',
          p: { xs: 4, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 240, md: 'auto' },
        }}
      >
        {/* Glow Circles */}
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.06)',
            top: -50,
            left: -50,
            filter: 'blur(30px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
            bottom: -100,
            right: -100,
            filter: 'blur(50px)',
          }}
        />

        {/* Brand Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            position: 'absolute',
            top: { xs: 20, md: 40 },
            left: { xs: 20, md: 40 },
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <GymIcon sx={{ color: '#FFFFFF', fontSize: 18 }} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '0.05em' }}>
            POWERHOUSE
          </Typography>
        </Box>

        {/* Main Content Info */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          sx={{ textAlign: 'center', zIndex: 1, maxWidth: 460 }}
        >
          <Box
            component="img"
            src="/fitness_illustration.png"
            alt="Gym Illustration"
            sx={{
              width: '100%',
              maxHeight: { xs: 150, md: 280 },
              objectFit: 'contain',
              mb: 4,
              filter: 'drop-shadow(0px 15px 30px rgba(0,0,0,0.25))',
            }}
          />
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Join the Powerhouse Movement
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, lineHeight: 1.6, display: { xs: 'none', sm: 'block' } }}>
            Start managing gym rosters, plan subscriptions, billing records, and track attendee statuses securely.
          </Typography>
        </Box>
      </Box>

      {/* Right: Signup Card Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2.5, sm: 4, md: 8 },
        }}
      >
        <Card
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            maxWidth: 480,
            width: '100%',
            borderRadius: '24px',
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(30, 41, 59, 0.8)',
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.8)',
            backdropFilter: 'blur(20px)',
            boxShadow: theme.palette.mode === 'light'
              ? '0 20px 40px -15px rgba(15, 23, 42, 0.08)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                Get started today and initialize your gym settings
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                required
                helperText="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2.5 }}
              />

              <TextField
                fullWidth
                label="Organizational Role"
                name="role"
                select
                value={form.role}
                onChange={handleChange}
                sx={{ mb: 3.5 }}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="MANAGER">Manager</MenuItem>
                <MenuItem value="TRAINER">Trainer</MenuItem>
              </TextField>

              <Button
                component={motion.button}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.4,
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  boxShadow: theme.palette.mode === 'light'
                    ? '0 4px 14px rgba(37, 99, 235, 0.2)'
                    : '0 4px 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                    boxShadow: theme.palette.mode === 'light'
                      ? '0 6px 18px rgba(37, 99, 235, 0.3)'
                      : '0 6px 25px rgba(0,0,0,0.4)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, fontWeight: 500 }}>
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Register;
