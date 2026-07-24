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
  Divider,
  FormControlLabel,
  Checkbox,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  FitnessCenter as GymIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
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
          {/* Generated Premium Vector Illustration */}
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
            Sculpt Your Body, Own Your Destiny
          </Typography>
          <Typography variant="subtitle1" sx={{ opacity: 0.8, fontWeight: 500, lineHeight: 1.6, display: { xs: 'none', sm: 'block' } }}>
            Track workouts, manage membership ledgers, log daily attendance sheets, and schedule customized trainer guides dynamically.
          </Typography>
        </Box>
      </Box>

      {/* Right: Authentication Card Container */}
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
            maxWidth: 460,
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
                Sign In
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
                Enter your credentials to manage your dashboard
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
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
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
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: '4px' }}
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Remember me
                    </Typography>
                  }
                />
                <Link
                  component={RouterLink}
                  to="#"
                  variant="body2"
                  color="primary"
                  sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot password?
                </Link>
              </Box>

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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                OR
              </Typography>
            </Divider>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
              Don&apos;t have an account?{' '}
              <Link component={RouterLink} to="/register" sx={{ fontWeight: 700, textDecoration: 'none', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}>
                Create an account
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Login;
