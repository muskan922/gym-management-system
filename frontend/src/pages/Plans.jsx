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
import { getPlans, createPlan, updatePlan, deletePlan } from '../services/planService';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency } from '../utils/helpers';
import { motion } from 'framer-motion';

const initialForm = { name: '', durationMonths: '', price: '', description: '' };

const Plans = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPlans();
      setPlans(res.data?.plans || []);
    } catch {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpenDialog(true);
  };

  const handleOpenEdit = (plan) => {
    setEditing(plan);
    setForm({
      name: plan.name || '',
      durationMonths: plan.durationMonths || '',
      price: plan.price || '',
      description: plan.description || '',
    });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deletePlan(deleteDialog.id);
      toast.success('Plan deleted successfully');
      setDeleteDialog({ open: false, id: null });
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updatePlan(editing._id, form);
        toast.success('Plan updated successfully');
      } else {
        await createPlan(form);
        toast.success('Plan created successfully');
      }
      setOpenDialog(false);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Plan Name',
      flex: 1.2,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: theme.palette.mode === 'light' ? '#EFF6FF' : '#1E293B',
              color: 'primary.main',
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
    {
      field: 'durationMonths',
      headerName: 'Duration',
      width: 140,
      render: (row) => (
        <Chip
          label={`${row.durationMonths} Months`}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: theme.palette.divider }}
        />
      ),
    },
    {
      field: 'price',
      headerName: 'Price Rate',
      width: 130,
      render: (row) => (
        <Box sx={{ fontWeight: 700, color: 'success.main' }}>
          {formatCurrency(row.price)}
        </Box>
      ),
    },
    { field: 'description', headerName: 'Description', flex: 1.5, render: (row) => row.description || '—' },
    {
      field: '_count',
      headerName: 'Active Members',
      width: 150,
      render: (row) => (
        <Chip
          label={`${row._count?.members || 0} Members`}
          size="small"
          color="primary"
          variant="filled"
          sx={{ fontWeight: 700, height: 24, fontSize: '0.72rem' }}
        />
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
      <PageHeader title="Membership Plans" subtitle="Define gym tiers, customize durations, and adjust price rates." actionLabel="Add Plan" onAction={handleOpenCreate} />

      <DataTable
        columns={columns}
        rows={plans}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={(row) => setDeleteDialog({ open: true, id: row._id })}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', px: 3, pt: 3 }}>
            {editing ? 'Edit Membership Plan' : 'Create New Plan'}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Plan Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Duration (Months)" type="number" value={form.durationMonths} onChange={(e) => setForm({ ...form, durationMonths: e.target.value })} required inputProps={{ min: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Price Rate ($)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required inputProps={{ min: 0, step: 0.01 }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description Summary" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'text.secondary', borderColor: theme.palette.divider }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
              {submitting ? 'Saving...' : editing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Membership Plan"
        message="Are you sure you want to delete this subscription plan? Active members assigned to this plan will remain registered, but they will not be able to renew under this package tier. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  );
};

export default Plans;
