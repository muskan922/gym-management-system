import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  useTheme,
} from '@mui/material';
import toast from 'react-hot-toast';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../services/trainerService';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency } from '../utils/helpers';
import { motion } from 'framer-motion';

const initialForm = { name: '', email: '', phone: '', specialty: '', salary: '' };

const Trainers = () => {
  const theme = useTheme();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTrainers();
      setTrainers(res.data?.trainers || []);
    } catch {
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainers();
  }, [fetchTrainers]);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpenDialog(true);
  };

  const handleOpenEdit = (trainer) => {
    setEditing(trainer);
    setForm({
      name: trainer.name || '',
      email: trainer.email || '',
      phone: trainer.phone || '',
      specialty: trainer.specialty || '',
      salary: trainer.salary || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTrainer(deleteDialog.id);
      toast.success('Trainer deleted successfully');
      setDeleteDialog({ open: false, id: null });
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete trainer');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateTrainer(editing._id, form);
        toast.success('Trainer updated successfully');
      } else {
        await createTrainer(form);
        toast.success('Trainer created successfully');
      }
      setOpenDialog(false);
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Trainer Name',
      flex: 1.2,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'light' ? '#EEF2F6' : '#1E293B',
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            {row.name.charAt(0).toUpperCase()}
          </Box>
          <Box sx={{ fontWeight: 700, color: 'text.primary' }}>{row.name}</Box>
        </Box>
      ),
    },
    { field: 'email', headerName: 'Email Address', flex: 1.2 },
    { field: 'phone', headerName: 'Phone Number', width: 140 },
    {
      field: 'specialty',
      headerName: 'Specialty',
      width: 160,
      render: (row) => (
        <Chip
          label={row.specialty}
          size="small"
          color="secondary"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderColor: theme.palette.secondary.light,
            backgroundColor: theme.palette.mode === 'light' ? 'rgba(79, 70, 229, 0.04)' : 'rgba(79, 70, 229, 0.15)',
          }}
        />
      ),
    },
    {
      field: 'salary',
      headerName: 'Monthly Salary',
      width: 140,
      render: (row) => (
        <Box sx={{ fontWeight: 700, color: 'success.main' }}>
          {formatCurrency(row.salary)}
        </Box>
      ),
    },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Trainers" subtitle="Manage fitness staff, define specialties, and assign salaries." actionLabel="Add Trainer" onAction={handleOpenCreate} />

      <DataTable
        columns={columns}
        rows={trainers}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={(row) => setDeleteDialog({ open: true, id: row._id })}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', px: 3, pt: 3 }}>
            {editing ? 'Edit Trainer Profile' : 'Add New Trainer'}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Specialty (e.g., Yoga, HIIT)" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Salary Amount ($)" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required inputProps={{ min: 0 }} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'text.secondary', borderColor: theme.palette.divider }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
              {submitting ? 'Saving...' : editing ? 'Update Details' : 'Create Profile'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Trainer Profile"
        message="Are you sure you want to delete this trainer? This will remove their record from all assigned members. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  );
};

export default Trainers;
