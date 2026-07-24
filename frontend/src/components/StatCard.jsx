import { Card, CardContent, Typography, Box, Chip, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';

// Generate default sparkline path points if not provided
const generateDefaultChartData = (color) => {
  const seed = {
    primary: [30, 45, 38, 52, 48, 65, 58],
    success: [20, 25, 45, 40, 58, 62, 70],
    warning: [40, 35, 48, 42, 55, 45, 52],
    error: [60, 55, 48, 42, 35, 30, 25],
  };
  return (seed[color] || seed.primary).map((val, i) => ({ x: i, y: val }));
};

const StatCard = ({
  title,
  value,
  icon,
  color = 'primary',
  subtitle,
  percentage,
  chartData,
  onClick,
}) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  // Soft gradient background styles based on status color and mode
  const bgGradients = {
    primary: isLight
      ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'
      : 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(23, 37, 84, 0.4) 100%)',
    success: isLight
      ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)'
      : 'linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(2, 44, 34, 0.4) 100%)',
    warning: isLight
      ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'
      : 'linear-gradient(135deg, rgba(120, 53, 15, 0.4) 0%, rgba(69, 26, 3, 0.4) 100%)',
    error: isLight
      ? 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)'
      : 'linear-gradient(135deg, rgba(127, 29, 29, 0.4) 0%, rgba(69, 10, 10, 0.4) 100%)',
  };

  const borderColors = {
    primary: isLight ? 'rgba(37, 99, 235, 0.12)' : 'rgba(37, 99, 235, 0.25)',
    success: isLight ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.25)',
    warning: isLight ? 'rgba(245, 158, 11, 0.12)' : 'rgba(245, 158, 11, 0.25)',
    error: isLight ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.25)',
  };

  const chartColor = {
    primary: '#2563EB',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  }[color];

  const data = chartData || generateDefaultChartData(color);

  // Parse positive vs negative percentage
  const isNegative = percentage ? percentage.toString().startsWith('-') : false;
  const cleanPercentage = percentage ? percentage.toString().replace(/[+-]/g, '') : null;

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22, cubicBezier: [0.16, 1, 0.3, 1] }}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        background: bgGradients[color],
        borderColor: borderColors[color],
        borderWidth: '1px',
        borderStyle: 'solid',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mt: 0.5, letterSpacing: '-0.03em', color: isLight ? 'text.primary' : '#FFFFFF' }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.8)',
              color: `${color}.main`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {icon}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
          {/* Subtitle / Percentage */}
          <Box>
            {cleanPercentage && (
              <Chip
                icon={isNegative ? <TrendingDown style={{ color: '#EF4444' }} /> : <TrendingUp style={{ color: '#22C55E' }} />}
                label={`${isNegative ? '-' : '+'}${cleanPercentage}%`}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid',
                  borderColor: isNegative ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                  mb: 0.5,
                  '& .MuiChip-icon': {
                    marginLeft: '4px',
                    marginRight: '-4px',
                    fontSize: '14px',
                  },
                }}
              />
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 500 }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Sparkline mini chart */}
          <Box sx={{ width: 100, height: 42, mt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke={chartColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#grad-${color})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
