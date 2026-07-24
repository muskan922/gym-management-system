import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Avatar, useTheme } from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as RevenueIcon,
  Warning as ExpiringIcon,
  TrendingUp,
  CalendarToday,
  Payments as PaymentIcon,
  PersonAdd as PersonAddIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getDashboardStats } from '../services/dashboardService';
import { getMembers } from '../services/memberService';
import { getPayments } from '../services/paymentService';
import { getAttendanceByDate } from '../services/attendanceService';
import StatCard from '../components/StatCard';
import LoadingScreen from '../components/LoadingScreen';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../utils/helpers';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#2563EB', '#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#10B981'];

const Dashboard = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const [statsData, setStatsData] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const todayStr = new Date().toISOString().split('T')[0];

      // 1. Fetch core stats
      const statsRes = await getDashboardStats();
      setStatsData(statsRes.data);

      // 2. Fetch bottom sections from databases
      const [paymentsRes, membersRes, attendanceRes] = await Promise.all([
        getPayments({ limit: 5 }),
        getMembers({ limit: 5 }),
        getAttendanceByDate(todayStr),
      ]);

      setRecentPayments(paymentsRes.data?.payments || []);
      setRecentMembers(membersRes.data?.members || []);
      setTodayAttendance(attendanceRes.data?.attendance || []);

      // Filter upcoming expiring members (ACTIVE status, sorted by end date)
      const activeMembersRes = await getMembers({ limit: 50, status: 'ACTIVE' });
      const sortedExpiring = (activeMembersRes.data?.members || [])
        .filter((m) => m.membershipEnd)
        .sort((a, b) => new Date(a.membershipEnd) - new Date(b.membershipEnd))
        .slice(0, 5);
      setExpiringMembers(sortedExpiring);

    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen message="Assembling your dashboard..." />;

  const {
    stats = {},
    activities = [],
    revenueChart = [],
    planDistribution = [],
    attendanceChart = [],
  } = statsData || {};

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
          Welcome back! Here is a summary of your gym operations.
        </Typography>
      </Box>

      {/* 4 Premium Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Members"
            value={stats.totalMembers || 0}
            icon={<PeopleIcon />}
            color="primary"
            percentage="+8.2"
            subtitle={`${stats.activeMembers || 0} active members`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue || 0)}
            icon={<RevenueIcon />}
            color="success"
            percentage="+14.8"
            subtitle="Collected this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Members"
            value={stats.activeMembers || 0}
            icon={<TrendingUp />}
            color="warning"
            percentage="+12.5"
            subtitle={`${stats.totalMembers ? ((stats.activeMembers / stats.totalMembers) * 100).toFixed(0) : 0}% active ratio`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expiring Soon"
            value={stats.expiringSoon || 0}
            icon={<ExpiringIcon />}
            color="error"
            percentage="-4.1"
            subtitle="Renewals next 30 days"
          />
        </Grid>
      </Grid>

      {/* Middle: Revenue Chart, Plan Distribution & Attendance Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Revenue Area Chart */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Revenue Trends
              </Typography>
              <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500, fill: theme.palette.text.secondary }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 500, fill: theme.palette.text.secondary }} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
                        backgroundColor: theme.palette.background.paper,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#revenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Membership Plans Donut */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Membership Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {planDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center text */}
                <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {planDistribution.reduce((sum, item) => sum + (item.value || 0), 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Total Active
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
                {planDistribution.map((item, index) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {item.name} ({item.value})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Grid Section: 4 modern tables */}
      <Grid container spacing={3}>
        {/* Recent Payments */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaymentIcon color="primary" fontSize="small" /> Recent Payments
                </Typography>
                <Chip label="Transactions" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {recentPayments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No payments found.
                  </Typography>
                ) : (
                  recentPayments.map((p) => (
                    <Box key={p._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 1.5, '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'success.light', color: 'success.main', fontSize: '0.82rem', fontWeight: 700 }}>
                          $
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {p.member?.name || 'Unknown Member'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {p.paymentMethod} • {formatDate(p.paymentDate)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: p.status === 'PAID' ? 'success.main' : 'error.main' }}>
                          {formatCurrency(p.amount)}
                        </Typography>
                        <Chip label={p.status} size="small" color={getStatusColor(p.status)} variant="filled" sx={{ height: 16, fontSize: '0.62rem', mt: 0.3 }} />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Members */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonAddIcon color="primary" fontSize="small" /> Recent Registrations
                </Typography>
                <Chip label="Members" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {recentMembers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No members registered yet.
                  </Typography>
                ) : (
                  recentMembers.map((m) => (
                    <Box key={m._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 1.5, '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light', color: 'primary.main', fontSize: '0.82rem', fontWeight: 700 }}>
                          {m.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {m.planId?.name || 'Basic'}
                        </Typography>
                        <Chip label={m.status} size="small" color={getStatusColor(m.status)} variant="filled" sx={{ height: 16, fontSize: '0.62rem', mt: 0.3 }} />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Expiry */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ExpiringIcon color="error" fontSize="small" /> Expiring Soon
                </Typography>
                <Chip label="Action Required" color="error" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {expiringMembers.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No memberships expiring soon.
                  </Typography>
                ) : (
                  expiringMembers.map((m) => (
                    <Box key={m._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 1.5, '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'error.light', color: 'error.main', fontSize: '0.82rem', fontWeight: 700 }}>
                          !
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {m.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {m.phone}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'error.main' }}>
                          {formatDate(m.membershipEnd)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {m.planId?.name || 'Plan'}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Attendance Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="primary" fontSize="small" /> Today&apos;s Attendance
                </Typography>
                <Chip
                  label={`Present: ${todayAttendance.filter(a => a.attendanceStatus === 'PRESENT').length}`}
                  color="success"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                {todayAttendance.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                    No members logged today.
                  </Typography>
                ) : (
                  todayAttendance.slice(0, 5).map((a) => (
                    <Box key={a.memberId} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 1.5, '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{
                          width: 36,
                          height: 36,
                          bgcolor: a.attendanceStatus === 'PRESENT' ? 'success.light' : 'error.light',
                          color: a.attendanceStatus === 'PRESENT' ? 'success.main' : 'error.main',
                          fontSize: '0.82rem',
                          fontWeight: 700
                        }}>
                          {a.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {a.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {a.email}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Chip
                          label={a.attendanceStatus || 'ABSENT'}
                          size="small"
                          color={a.attendanceStatus === 'PRESENT' ? 'success' : 'error'}
                          variant="filled"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
