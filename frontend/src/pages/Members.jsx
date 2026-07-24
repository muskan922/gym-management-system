import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  InputAdornment,
  Paper,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, ClearAll as ClearIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getMembers, createMember, updateMember, deleteMember } from '../services/memberService';
import { getPlans } from '../services/planService';
import { getTrainers } from '../services/trainerService';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate, formatCurrency, getStatusColor } from '../utils/helpers';
import { motion } from 'framer-motion';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  planId: '',
  trainerId: '',
  membershipStart: new Date().toISOString().split('T')[0],
  status: 'ACTIVE',
};

const Members = () => {
  const theme = useTheme();
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: '', status: '', planId: '' });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.planId && { planId: filters.planId }),
      };
      const res = await getMembers(params);
      setMembers(res.data.members || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [pagination, filters]);

  const fetchPlansAndTrainers = async () => {
    try {
      const [plansRes, trainersRes] = await Promise.all([getPlans(), getTrainers()]);
      setPlans(plansRes.data?.plans || []);
      setTrainers(trainersRes.data?.trainers || []);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchPlansAndTrainers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleOpenCreate = () => {
    setEditing(null);
    setForm({
      ...initialForm,
      membershipStart: new Date().toISOString().split('T')[0],
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      planId: member.planId?._id || member.planId || '',
      trainerId: member.trainerId?._id || member.trainerId || '',
      membershipStart: member.membershipStart ? member.membershipStart.split('T')[0] : '',
      status: member.status || 'ACTIVE',
    });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deleteMember(deleteDialog.id);
      toast.success('Member deleted successfully');
      setDeleteDialog({ open: false, id: null });
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await updateMember(editing._id, form);
        toast.success('Member updated successfully');
      } else {
        await createMember(form);
        toast.success('Member created successfully');
      }
      setOpenDialog(false);
      fetchMembers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
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
    { field: 'email', headerName: 'Email', flex: 1.2 },
    { field: 'phone', headerName: 'Phone', width: 140 },
    {
      field: 'planId',
      headerName: 'Plan',
      width: 140,
      render: (row) => (
        <Chip
          label={row.planId?.name || 'N/A'}
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937',
          }}
        />
      ),
    },
    {
      field: 'trainerId',
      headerName: 'Trainer',
      width: 140,
      render: (row) => row.trainerId?.name || '—',
    },
    {
      field: 'membershipStart',
      headerName: 'Start',
      width: 110,
      render: (row) => formatDate(row.membershipStart),
    },
    {
      field: 'membershipEnd',
      headerName: 'End',
      width: 110,
      render: (row) => (
        <Box sx={{ color: row.status === 'EXPIRED' ? 'error.main' : 'text.primary', fontWeight: 500 }}>
          {formatDate(row.membershipEnd)}
        </Box>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      render: (row) => (
        <Chip
          label={row.status}
          size="small"
          color={getStatusColor(row.status)}
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
      <PageHeader title="Members" subtitle="Manage gym members, search directory, and customize assignments." actionLabel="Add Member" onAction={handleOpenCreate} />

      {/* Filters Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#111827',
        }}
      >
        <TextField
          size="small"
          placeholder="Search members by name, email, phone..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280, flexGrow: 1 }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="EXPIRED">Expired</MenuItem>
        </TextField>
        <TextField
          select
          size="small"
          label="Membership Plan"
          value={filters.planId}
          onChange={(e) => handleFilterChange('planId', e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All Plans</MenuItem>
          {plans.map((p) => (
            <MenuItem key={p._id} value={p._id}>
              {p.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="outlined"
          onClick={() => {
            setFilters({ search: '', status: '', planId: '' });
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          startIcon={<ClearIcon />}
          sx={{ height: 40, borderColor: theme.palette.divider, borderRadius: '10px' }}
        >
          Reset
        </Button>
      </Paper>
 
      {/* Modern DataGrid Table */}
      <DataTable
        columns={columns}
        rows={members}
        total={total}
        page={pagination.page}
        rowsPerPage={pagination.limit}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        onRowsPerPageChange={(l) => setPagination({ page: 1, limit: l })}
        onView={(row) => handleOpenEdit(row)}
        onEdit={(row) => handleOpenEdit(row)}
        onDelete={(row) => setDeleteDialog({ open: true, id: row._id })}
        loading={loading}
      />

      {/* Create/Edit dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', px: 3, pt: 3 }}>
            {editing ? 'Edit Member Details' : 'Add New Member'}
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email Address" type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Start Date" type="date" name="membershipStart" value={form.membershipStart} onChange={(e) => setForm({ ...form, membershipStart: e.target.value })} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Membership Plan" name="planId" value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })} required>
                  {plans.map((p) => (
                    <MenuItem key={p._id} value={p._id}>{p.name} - {formatCurrency(p.price)}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Trainer (Optional)" name="trainerId" value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}>
                  <MenuItem value="">No Trainer Assigned</MenuItem>
                  {trainers.map((t) => (
                    <MenuItem key={t._id} value={t._id}>{t.name} - {t.specialty}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Status" name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="EXPIRED">Expired</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'text.secondary', borderColor: theme.palette.divider }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
              {submitting ? 'Saving...' : editing ? 'Update Details' : 'Create Member'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Member Profile"
        message="Are you sure you want to delete this member? All attendance, subscriptions, and payment history associated with this profile will be permanently removed. This action is irreversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  );
};

export default Members;
