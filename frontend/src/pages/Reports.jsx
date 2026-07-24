import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Chip,
} from '@mui/material';
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
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { getDashboardStats } from '../services/dashboardService';
import LoadingScreen from '../components/LoadingScreen';
import { formatCurrency, formatDate } from '../utils/helpers';
import { motion } from 'framer-motion';

const PIE_COLORS = ['#2563EB', '#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#10B981'];

const Reports = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(res.data);
      } catch {
        console.error('Failed to fetch report analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingScreen message="Compiling reports and trends..." />;

  const { revenueChart = [], planDistribution = [], attendanceChart = [] } = data || {};

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.025em' }}>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
          Detailed gym statistics, payment curves, member plans, and weekly attendance charts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Revenue Area Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Revenue Curves
                </Typography>
                <Chip label="Monthly Breakdown" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="reportRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Revenue']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#reportRevenueGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 3, pt: 2, display: 'flex', justifyContent: 'space-around', textAlign: 'center', borderTop: '1px solid', borderColor: 'divider' }}>
                <Box>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>
                    {formatCurrency(revenueChart.reduce((sum, r) => sum + r.revenue, 0))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Total Revenue</Typography>
                </Box>
                <Box>
                  <Typography variant="h5" color="success.main" sx={{ fontWeight: 800 }}>
                    {formatCurrency(revenueChart.length > 0 ? revenueChart[revenueChart.length - 1].revenue : 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Latest Month</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Membership Plans Donut Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Membership Plans Distribution
                </Typography>
                <Chip label="Active Shares" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {planDistribution.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No active membership plans logged.
                  </Typography>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={planDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={95}
                          paddingAngle={4}
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
                    {/* Donut Center */}
                    <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {planDistribution.reduce((sum, item) => sum + (item.value || 0), 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Total Active
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mt: 2 }}>
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

        {/* Attendance Trend Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Attendance Logs (Last 7 Days)
                </Typography>
                <Chip label="Check-in Rates" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 500 }} />
                    <YAxis tick={{ fontSize: 11, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: theme.palette.divider,
                        backgroundColor: theme.palette.background.paper,
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.82rem', fontWeight: 600 }} />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#22C55E"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#22C55E' }}
                      name="Present"
                    />
                    <Line
                      type="monotone"
                      dataKey="absent"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#EF4444' }}
                      name="Absent"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Summary Table */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Ledger Statistics (By Month)
                </Typography>
                <Chip label="Financial Summary" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', py: 1.5 }}>Month</TableCell>
                      <TableCell sx={{ fontWeight: 700, backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937', py: 1.5 }} align="right">Revenue Volume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {revenueChart.map((row, index) => (
                      <TableRow key={index} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{row.month}</TableCell>
                        <TableCell align="right" sx={{ py: 1.5, fontWeight: 700, color: 'success.main' }}>
                          {formatCurrency(row.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {revenueChart.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                          No metrics recorded in ledger.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
