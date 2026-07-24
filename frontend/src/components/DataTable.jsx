import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  InboxOutlined,
} from '@mui/icons-material';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  rows = [],
  total,
  page,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    if (onPageChange) onPageChange(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    const limit = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(limit);
    } else if (onPageChange) {
      onPageChange(1);
    }
  };

  const hasActions = onView || onEdit || onDelete;
  const colCount = columns.length + (hasActions ? 1 : 0);

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '18px',
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
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'text.secondary',
                    backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937',
                    borderBottom: '1.5px solid',
                    borderColor: theme.palette.divider,
                    py: 2,
                    px: 3,
                    whiteSpace: 'nowrap',
                    ...col.headerStyle,
                  }}
                >
                  {col.headerName}
                </TableCell>
              ))}
              {hasActions && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'text.secondary',
                    backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#1F2937',
                    borderBottom: '1.5px solid',
                    borderColor: theme.palette.divider,
                    py: 2,
                    px: 3,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Loading Skeleton Rows
              Array.from(new Array(5)).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {Array.from(new Array(colCount)).map((_, colIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} sx={{ py: 2.2, px: 3, borderColor: theme.palette.divider }}>
                      <Skeleton variant="text" height={24} width={colIndex === 0 ? '60%' : colIndex === colCount - 1 ? '40%' : '80%'} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={colCount} align="center" sx={{ py: 6, borderColor: 'transparent' }}>
                  <EmptyState message="No entries found. Try adding some!" />
                </TableCell>
              </TableRow>
            ) : (
              // Active Rows
              rows.map((row, index) => (
                <TableRow
                  key={row._id || index}
                  hover
                  sx={{
                    transition: 'background-color 0.15s ease',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' ? 'rgba(241, 245, 249, 0.5)' : 'rgba(30, 41, 59, 0.4)',
                    },
                    '& td, & th': {
                      borderColor: theme.palette.divider,
                      py: 1.8,
                      px: 3,
                    },
                    '&:last-child td, &:last-child th': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.field} align={col.align || 'left'} sx={{ fontSize: '0.9rem', color: 'text.primary', ...col.cellStyle }}>
                      {col.render ? col.render(row) : row[col.field] ?? '—'}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        {onView && (
                          <Tooltip title="View details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => onView(row)}
                              sx={{
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                                borderRadius: '8px',
                                p: 0.6,
                                color: 'primary.main',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit entry" arrow>
                            <IconButton
                              size="small"
                              onClick={() => onEdit(row)}
                              sx={{
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                                borderRadius: '8px',
                                p: 0.6,
                                color: 'info.main',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: 'rgba(2, 136, 209, 0.08)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete entry" arrow>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(row)}
                              sx={{
                                border: '1px solid',
                                borderColor: theme.palette.mode === 'light' ? '#E2E8F0' : '#1E293B',
                                borderRadius: '8px',
                                p: 0.6,
                                color: 'error.main',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {total !== undefined && total > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total || 0}
          rowsPerPage={rowsPerPage}
          page={(page || 1) - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFC' : '#111827',
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;
