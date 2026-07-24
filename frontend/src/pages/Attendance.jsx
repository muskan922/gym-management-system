import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import { getAttendanceByDate, markAttendance } from '../services/attendanceService';
import PageHeader from '../components/PageHeader';
import LoadingScreen from '../components/LoadingScreen';
import { motion } from 'framer-motion';

const Attendance = () => {
  const theme = useTheme();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAttendanceByDate(date);
      setAttendance(res.data?.attendance || []);
    } catch {
      toast.error('Failed to load attendance logs');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleMark = async (memberId, status) => {
    setSubmitting(memberId);
    try {
      await markAttendance({ memberId, date, status });
      toast.success(`Marked member as ${status.toLowerCase()}`);
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record attendance');
    } finally {
      setSubmitting(null);
    }
  };

  const presentCount = attendance.filter((a) => a.attendanceStatus === 'PRESENT').length;
  const absentCount = attendance.filter((a) => a.attendanceStatus === 'ABSENT').length;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title="Attendance"
        subtitle="Manage daily check-ins, record present/absent statuses, and track statistics."
        actionLabel={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RefreshIcon fontSize="small" /> Refresh Logs
          </Box>
        }
        onAction={fetchAttendance}
      />

      {/* Date Picker & Metrics Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
          mb: 4,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          backgroundColor: theme.palette.mode === 'light' ? '#FFFFFF' : '#111827',
        }}
      >
        <TextField
          label="Reporting Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ minWidth: 200 }}
        />
        <Box sx={{ display: 'flex', gap: 1.2, flexWrap: 'wrap', ml: { sm: 'auto' } }}>
          <Chip
            label={`Present: ${presentCount}`}
            color="success"
            variant="filled"
            sx={{ fontWeight: 700, px: 1 }}
          />
          <Chip
            label={`Absent: ${absentCount}`}
            color="error"
            variant="filled"
            sx={{ fontWeight: 700, px: 1 }}
          />
          <Chip
            label={`Total Roster: ${attendance.length}`}
            variant="outlined"
            sx={{ fontWeight: 600, px: 1, borderColor: theme.palette.divider }}
          />
        </Box>
      </Paper>

      {/* Attendance Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
          boxShadow: theme.palette.mode === 'light'
            ? '0 1px 3px rgba(0,0,0,0.01), 0 10px 20px -2px rgba(15, 23, 42, 0.04)'
            : '0 1px 3px rgba(0,0,0,0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.4)',
        }}
      >
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>Email Address</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>Phone</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>Status</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', color: 'text.secondary', backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', borderBottom: '1.5px solid', borderColor: theme.palette.divider, py: 2, px: 3 }}>Action Toggle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <LoadingScreen message="Reading member rosters..." />
                  </TableCell>
                </TableRow>
              ) : attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      No active gym members found for this date.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((item, index) => (
                  <TableRow
                    key={item.memberId}
                    hover
                    sx={{
                      '& td, & th': { py: 1.8, px: 3, borderColor: theme.palette.divider },
                      '&:last-child td, &:last-child th': { borderBottom: 0 },
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell align="center">
                      {item.attendanceStatus ? (
                        <Chip
                          label={item.attendanceStatus}
                          color={item.attendanceStatus === 'PRESENT' ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 700, height: 22, fontSize: '0.68rem' }}
                        />
                      ) : (
                        <Chip
                          label="UNMARKED"
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600, height: 22, fontSize: '0.68rem', borderColor: theme.palette.divider }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <ToggleButtonGroup
                        size="small"
                        value={item.attendanceStatus}
                        exclusive
                        disabled={submitting === item.memberId}
                        sx={{
                          border: '1px solid',
                          borderColor: theme.palette.divider,
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: theme.palette.background.paper,
                        }}
                      >
                        <ToggleButton
                          value="PRESENT"
                          onClick={() => handleMark(item.memberId, 'PRESENT')}
                          sx={{
                            px: 2,
                            py: 0.6,
                            borderRadius: 0,
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            border: 'none',
                            color: item.attendanceStatus === 'PRESENT' ? 'success.main' : 'text.secondary',
                            backgroundColor: item.attendanceStatus === 'PRESENT' ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(34, 197, 94, 0.12)',
                            },
                          }}
                        >
                          <PresentIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Present
                        </ToggleButton>
                        <ToggleButton
                          value="ABSENT"
                          onClick={() => handleMark(item.memberId, 'ABSENT')}
                          sx={{
                            px: 2,
                            py: 0.6,
                            borderRadius: 0,
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            border: 'none',
                            color: item.attendanceStatus === 'ABSENT' ? 'error.main' : 'text.secondary',
                            backgroundColor: item.attendanceStatus === 'ABSENT' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.12)',
                            },
                          }}
                        >
                          <AbsentIcon fontSize="small" sx={{ mr: 0.5 }} />
                          Absent
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Attendance;
