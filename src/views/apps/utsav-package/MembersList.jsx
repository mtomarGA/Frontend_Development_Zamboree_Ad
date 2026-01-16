'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  TablePagination,
  Chip,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import classnames from 'classnames';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@core/components/mui/TextField';
import ChevronRight from '@menu/svg/ChevronRight';
import styles from '@core/styles/table.module.css';
import TicketStatsCards from './Cards';
import createUtsavService from '@/services/utsav-packages/createOrder.Service';
import { toast } from 'react-toastify';
import DialogCloseButton from '@/components/dialogs/DialogCloseButton';
import { useAuth } from '@/contexts/AuthContext';

const columnHelper = createColumnHelper();

const fuzzyFilter = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => setValue(initialValue), [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value]);

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

// ✅ Status Map Object
const productStatusObj = {
  PENDING: { title: 'PENDING', color: 'warning' },
  ACTIVE: { title: 'ACTIVE', color: 'success' },
  COMPLETED: { title: 'COMPLETED', color: 'primary' },
  FAILED: { title: 'FAILED', color: 'error' }
};

const MemberList = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    memberList();
  }, []);

  // const memberList = async () => {
  //   try {
  //     const res = await createUtsavService.getAllOrder(true);
  //     const allOrders = res.data?.sort(
  //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  //     );
  //     setData(allOrders);
  //   } catch (error) {
  //     console.error('Failed to fetch orders:', error);
  //   }
  // };

  const [counts, setCounts] = useState({ all: 0, active: 0, expired: 0 });

  const memberList = async () => {
    try {
      const res = await createUtsavService.getAllOrder(true);
      const allOrders = res.data?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setData(allOrders);

      // ✅ Compute counts
      const total = allOrders.length;
      const active = allOrders.filter(order => order.membershipStatus === 'ACTIVE').length;
      const expired = allOrders.filter(order => order.membershipStatus === 'COMPLETED' || order.membershipStatus === 'EXPIRED').length;

      setCounts({ all: total, active, expired });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };


  const handleStatusUpdate = async () => {
    if (!selectedOrder?.paymentStatus) {
      toast.error('Please select a valid status');
      return;
    }

    const statusUpper = selectedOrder.paymentStatus.toUpperCase();

    if (!['PENDING', 'ACTIVE'].includes(statusUpper)) {
      toast.error('Invalid status. Must be PENDING or ACTIVE.');
      return;
    }

    try {
      const res = await createUtsavService.updateOrder(selectedOrder._id, {
        paymentStatus: statusUpper
      });
      if (res?.success) {
        toast.success('Payment status updated successfully');
        memberList();
        setEditDialogOpen(false);
      } else {
        toast.error(res?.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };

  // ✅ Define Columns
  const columns = useMemo(
    () => [
      columnHelper.accessor('orderId', {
        header: 'ORDER ID',
        cell: info => info.getValue() || 'N/A'
      }),
      columnHelper.accessor('userId', {
        header: 'USER NAME',
        cell: info => info.getValue()?.userId || 'N/A'
      }),
      columnHelper.accessor(
        row => row.choosePackage?.[0]?.title || '—',
        {
          id: 'choosePackageTitle',
          header: 'PACKAGE NAME',
          cell: info => info.getValue()
        }
      ),
      columnHelper.accessor('createdAt', {
        header: 'CREATED AT',
        cell: info => {
          const date = info.getValue();
          return date
            ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
            : 'N/A';
        }
      }),
      columnHelper.accessor('validDate', {
        header: 'EXPIRE DATE',
        cell: info => {
          const date = info.getValue();
          return date
            ? new Date(date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
            : 'N/A';
        }
      }),
      columnHelper.accessor('membershipStatus', {
        header: 'MEMBERSHIP STATUS',
        cell: ({ row }) => {
          const status = row?.original?.membershipStatus;
          const statusData = productStatusObj[status?.toUpperCase()] || null;

          return (
            <Box display='flex' alignItems='center' gap={1}>
              <Chip
                label={statusData?.title || status || 'Unknown'}
                variant={statusData ? 'tonal' : 'outlined'}
                color={statusData?.color || 'default'}
                size='small'
              />
              {hasPermission('utsav_package_members_list:edit') && (
                <Button
                  size='small'
                  onClick={() => {
                    setSelectedOrder(row.original);
                    setEditDialogOpen(true);
                  }}
                >
                  <i className='tabler-edit' />
                </Button>
              )}
            </Box>
          );
        }
      })
    ],
    [hasPermission]
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }]
    }
  });

  return (
    <Card>
      <Typography variant='h4' className='p-4'>
        All Member Orders
      </Typography>

      <TicketStatsCards counts={counts} />


      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={classnames({
                          'flex items-center': header.column.getIsSorted(),
                          'cursor-pointer select-none': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === 'asc' && (
                          <ChevronRight
                            fontSize='1.25rem'
                            className='-rotate-90'
                          />
                        )}
                        {header.column.getIsSorted() === 'desc' && (
                          <ChevronRight
                            fontSize='1.25rem'
                            className='rotate-90'
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getVisibleFlatColumns().length}
                  className='text-center'
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page);
        }}
      />

      <Dialog
        fullWidth
        maxWidth='sm'
        scroll='body'
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'visible',
            borderRadius: 2,
            padding: 2,
            border: 'none',
            boxShadow: 'none',
            position: 'relative'
          }
        }}
      >
        <DialogCloseButton onClick={() => setEditDialogOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle className='text-center' sx={{ pb: 2 }}>
          Edit Payment Status
        </DialogTitle>

        <DialogContent sx={{ border: 'none', paddingTop: 0 }}>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={selectedOrder?.paymentStatus?.toUpperCase() || ''}
                onChange={e =>
                  setSelectedOrder(prev => ({
                    ...prev,
                    paymentStatus: e.target.value
                  }))
                }
              >
                <MenuItem value='PENDING'>PENDING</MenuItem>
                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ borderTop: 'none', justifyContent: 'flex-end', pt: 2 }}>
          <Button onClick={handleStatusUpdate} variant='contained'>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MemberList;
