'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
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
import createUtsavService from '@/services/utsav-packages/createOrder.Service';
import TablePaginationComponent from '@components/TablePaginationComponent';
import CustomTextField from '@/@core/components/mui/TextField';
import styles from '@/@core/styles/table.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';
import { ChevronRight } from 'lucide-react';
import DialogCloseButton from '@/components/dialogs/DialogCloseButton';
import OrdersEdit from '@/components/dialogs/utsav-package-order/orderEdit';
import DeleteConfirmationDialog from '../deleteConfirmation';
import { FamilyRestroomOutlined } from '@mui/icons-material';


const OrdersDialog = ({ open, onClose, order }) => {
  if (!order) return null;

  const statusColors = {
    COMPLETED: 'success',
    PENDING: 'error',
    FAILED: 'error'
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Details</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Order ID</Typography>
            <Typography>{order.orderId || ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>User ID</Typography>
            <Typography>{order.userId?.userId || ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Package</Typography>
            <Typography>{order.choosePackage?.title || ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Transaction ID</Typography>
            <Typography>{order.transactionId || ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Payment Gateway</Typography>
            <Typography>{order.paymentGateway || ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Payment Date</Typography>
            <Typography>{order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata', hour12: true }) : new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata', hour12: true })}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Created By</Typography>
            <Typography>{order.createdBy?.firstName ? `${order.createdBy.firstName} ${order.createdBy.lastName}` : ''}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography sx={{ fontWeight: 'bold' }}>Payment Status</Typography>
            <Chip
              label={order.paymentStatus?.toUpperCase() || ''}
              color={statusColors[order.paymentStatus?.toUpperCase()] || 'default'}
              size="small"
            />
          </Grid>
        </Grid>

        <Box mt={3} textAlign="right">
          <Button variant="contained" onClick={onClose}>Close</Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

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
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);
  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

const productStatusObj = {
  PENDING: { title: 'PENDING', color: 'warning' },
  COMPLETED: { title: 'COMPLETED', color: 'primary' },
  // ACTIVE: { title: 'ACTIVE', color: 'success' },
  FAILED: { title: 'FAILED', color: 'error' }
};

const AllOrders = () => {
  const router = useRouter();
  const { hasPermission } = useAuth();

  const [globalFilter, setGlobalFilter] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await createUtsavService.getAllOrder();
      if (res?.success && Array.isArray(res.data)) {
        setData(res.data);
      } else {
        setData([]);
        toast.error('Invalid data structure received from server');
      }
    } catch (error) {
      setData([]);
      toast.error(error?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async id => {
    try {
      const res = await createUtsavService.deleteOrder(id);
      if (res?.status === 200 || res?.success) {
        toast.success('Order deleted successfully');
        fetchOrders();
      } else {
        toast.error(res?.message || 'Failed to delete order');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error deleting order');
    }
  };

  const handleAdd = () => router.push('/en/apps/utsav-package/create-order');

  const handleEdit = order => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const columns = useMemo(() => [
    columnHelper.accessor('orderId', { header: 'ORDER ID', cell: info => info.getValue() || 'N/A' }),
    columnHelper.accessor('userId', { header: 'USER ID', cell: info => info.getValue()?.userId || 'N/A' }),
    columnHelper.accessor(
      row => row.choosePackage?.[0]?.title || '—',
      {
        id: 'choosePackageTitle',
        header: 'PACKAGE NAME',
        cell: info => info.getValue()
      }
    )
    ,
    columnHelper.accessor('paymentGateway', { header: 'PAYMENT GATEWAY', cell: info => info.getValue() }),
    columnHelper.accessor('transactionId', { header: 'TRANSACTION ID', cell: info => info.getValue() }),
    columnHelper.accessor('updatedAt', { header: 'PAYMENT DATE', cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '' }),
    columnHelper.accessor('createdBy', { header: 'CREATED BY', cell: info => info.getValue()?.firstName ? `${info.getValue().firstName} ${info.getValue().lastName}` : 'N/A' }),
    columnHelper.accessor('paymentStatus', {
      header: 'PAYMENT STATUS',
      cell: ({ row }) => {
        const status = row.original.paymentStatus?.toUpperCase();
        const statusData = productStatusObj[status];
        return <Chip label={statusData?.title || status || 'Unknown'} variant={statusData ? 'tonal' : 'outlined'} color={statusData?.color || 'default'} size='small' />;
      }
    }),
    columnHelper.display({
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => {
        const { paymentGateway, _id } = row.original;
        return (
          <Box display='flex' gap={1}>
            {hasPermission("utsav_package_all_order:view") && (
              <Button size='small' onClick={() => { setViewData(row.original); setViewOpen(true); }}>
                <i className='tabler-eye' />
              </Button>
            )}

            {/* {paymentGateway?.toLowerCase() === 'manual' && hasPermission("utsav_package_All_orders:edit") && ( */}
            <Button size='small' onClick={() => handleEdit(row.original)}>
              <i className='tabler-edit' />
            </Button>
            {/* )} */}

            {/* {hasPermission("utsav_package_All_orders:delete") && (
    <Button size='small' color='error' onClick={() => handleDelete(_id)}>
      <i className='tabler-trash' />
    </Button> */}


            {hasPermission("utsav_package_All_orders:delete") && (
              <DeleteConfirmationDialog
                itemName='Order list'
                onConfirm={() => handleDelete(_id)}
                icon={<i className='tabler-trash text-2xl text-error' />}
              />
            )}
          </Box>

        );
      }
    })
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: { fuzzy: fuzzyFilter },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          pt: 4,
          pb: 2,
          flexWrap: 'wrap',
          gap: 2,
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: 3
          }
        }}
      >
        <Typography variant='h4' >
          Orders List
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
              width: '100%'
            }
          }}
        >
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search all columns...'
            sx={{
              minWidth: 250,
              '@media (max-width: 768px)': {
                minWidth: 'auto',
                width: '100%'
              }
            }}
          />
          {hasPermission("utsav_package_All_orders:add") && (
            <Button
              variant='contained'
              sx={{
                color: 'white',
                minWidth: 120,
                height: 'fit-content',
                '@media (max-width: 768px)': {
                  width: '100%'
                }
              }}
              onClick={handleAdd}
            >
              Create Order
            </Button>
          )}
        </Box>
      </Box>

      <div className='overflow-x-auto mt-4'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div className={classnames({ 'flex items-center': header.column.getIsSorted(), 'cursor-pointer select-none': header.column.getCanSort() })} onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() && <ChevronRight fontSize='1.25rem' className={header.column.getIsSorted() === 'asc' ? '-rotate-90' : 'rotate-90'} />}
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
                <td colSpan={table.getAllLeafColumns().length} className='text-center'>
                  {loading ? 'Loading...' : 'No data available'}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePaginationComponent table={table} />

      <Dialog fullWidth maxWidth='lg' scroll='body' open={editDialogOpen} onClose={() => setEditDialogOpen(false)} sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
        <DialogCloseButton onClick={() => setEditDialogOpen(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle className='text-center'>Edit Order</DialogTitle>
        <OrdersEdit orderData={selectedOrder} onClose={() => setEditDialogOpen(false)} fetchOrders={fetchOrders} />
      </Dialog>

      <OrdersDialog open={viewOpen} onClose={() => setViewOpen(false)} order={viewData} />

    </Card>
  );
};

export default AllOrders;
