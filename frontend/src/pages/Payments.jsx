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
  MenuItem,
  Chip,
  InputAdornment,
  Paper,
  useTheme,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, ClearAll as ClearIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getPayments, recordPayment, deletePayment } from '../services/paymentService';
import { getMembers } from '../services/memberService';
import DataTable from '../components/DataTable';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate, getStatusColor } from '../utils/helpers';
import { PAYMENT_METHODS } from '../utils/constants';
import { motion } from 'framer-motion';

const initialForm = {
  memberId: '',
  amount: '',
  paymentDate: new Date().toISOString().split('T')[0],
  paymentMethod: 'Cash',
  status: 'PAID',
  notes: '',
};

const Payments = () => {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ search: '', status: '' });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      };
      const res = await getPayments(params);
      setPayments(res.data?.payments || []);
      setTotal(res.data?.total || 0);
    } catch {
      toast.error('Failed to load payment transactions');
    } finally {
      setLoading(false);
    }
  }, [pagination, filters]);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await getMembers({ limit: 1000 });
      setMembers(res.data?.members || []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleOpenCreate = () => {
    setForm({ ...initialForm, paymentDate: new Date().toISOString().split('T')[0] });
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    try {
      await deletePayment(deleteDialog.id);
      toast.success('Payment record deleted successfully');
      setDeleteDialog({ open: false, id: null });
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete payment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await recordPayment(form);
      toast.success('Payment recorded successfully');
      setOpenDialog(false);
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      field: 'member',
      headerName: 'Member',
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
            {row.member?.name ? row.member.name.charAt(0).toUpperCase() : '?'}
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {row.member?.name || 'N/A'}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {row.member?.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'amount',
      headerName: 'Amount Paid',
      width: 140,
      render: (row) => (
        <Box sx={{ fontWeight: 800, color: row.status === 'PAID' ? 'success.main' : 'error.main' }}>
          {formatCurrency(row.amount)}
        </Box>
      ),
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      width: 130,
      render: (row) => formatDate(row.paymentDate),
    },
    {
      field: 'paymentMethod',
      headerName: 'Method',
      width: 130,
      render: (row) => (
        <Chip
          label={row.paymentMethod}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: theme.palette.divider }}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
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
    { field: 'notes', headerName: 'Transaction Notes', flex: 1, render: (row) => row.notes || '—' },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader title="Payments" subtitle="Record member billing, check payment history, and audit ledger balances." actionLabel="Record Payment" onAction={handleOpenCreate} />

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
          placeholder="Search by member name..."
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
          <MenuItem value="PAID">Paid</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="FAILED">Failed</MenuItem>
        </TextField>
        <Button
          variant="outlined"
          onClick={() => {
            setFilters({ search: '', status: '' });
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          startIcon={<ClearIcon />}
          sx={{ height: 40, borderColor: theme.palette.divider, borderRadius: '10px' }}
        >
          Reset
        </Button>
      </Paper>

      {/* Transactions Data Table */}
      <DataTable
        columns={columns}
        rows={payments}
        total={total}
        page={pagination.page}
        rowsPerPage={pagination.limit}
        onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
        onRowsPerPageChange={(l) => setPagination({ page: 1, limit: l })}
        onDelete={(row) => setDeleteDialog({ open: true, id: row._id })}
        loading={loading}
      />

      {/* Record Payment Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800, fontSize: '1.25rem', px: 3, pt: 3 }}>
            Record New Transaction
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 1 }}>
            <Grid container spacing={2.5} sx={{ mt: 0.2 }}>
              <Grid item xs={12}>
                <TextField select fullWidth label="Select Member Profile" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} required>
                  {members.map((m) => (
                    <MenuItem key={m._id} value={m._id}>{m.name} ({m.email})</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Amount Paid ($)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required inputProps={{ min: 0, step: 0.01 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Payment Date" type="date" value={form.paymentDate} onChange={(e) => setForm({ ...form, paymentDate: e.target.value })} InputLabelProps={{ shrink: true }} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} required>
                  {PAYMENT_METHODS.map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select fullWidth label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
                  <MenuItem value="PAID">Paid</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="FAILED">Failed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Notes / Comments" multiline rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
            <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ color: 'text.secondary', borderColor: theme.palette.divider }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting} sx={{ boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)' }}>
              {submitting ? 'Recording...' : 'Record Payment'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Transaction Record"
        message="Are you sure you want to delete this payment record? This action will adjust the member's financial state but does not perform refunds. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, id: null })}
      />
    </Box>
  );
};

export default Payments;
