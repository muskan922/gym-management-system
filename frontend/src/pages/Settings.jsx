import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  useTheme,
  Paper,
} from '@mui/material';
import toast from 'react-hot-toast';
import { getSettings, updateSettings } from '../services/settingsService';
import LoadingScreen from '../components/LoadingScreen';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from '@mui/icons-material';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY'];

const Settings = () => {
  const theme = useTheme();
  const [form, setForm] = useState({
    gymName: '',
    gymAddress: '',
    phone: '',
    email: '',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        const s = res.data?.settings || {};
        setForm({
          gymName: s.gymName || '',
          gymAddress: s.gymAddress || '',
          phone: s.phone || '',
          email: s.email || '',
          currency: s.currency || 'USD',
        });
      } catch {
        toast.error('Failed to load system settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success('Settings updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen message="Accessing global configurations..." />;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          Gym Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
          Manage your brand name, configure active currencies, update address records, and contact emails.
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Brand & Locale
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                Define how customers and invoices see your business.
              </Typography>
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Gym Name"
                  value={form.gymName}
                  onChange={(e) => setForm({ ...form, gymName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Currency"
                  select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  required
                >
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address details"
                  value={form.gymAddress}
                  onChange={(e) => setForm({ ...form, gymAddress: e.target.value })}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Button
                  component={motion.button}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 1.2,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  }}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
