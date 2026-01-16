'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { toast } from 'react-toastify'
import Link from '@/components/Link'
import PaginationRounded from '../master/pagination'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAccordion } from '@material-tailwind/react'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'next/navigation'

function CouponTable({ statusStyles, coupondata, setcoupondata, getcoupon }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const { hasPermission } = useAuth();
  // const { lang } = useParams();

  // Sorting function
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Search function - filters data based on search term
  const filteredData = React.useMemo(() => {
    // Ensure coupondata is an array
    const dataArray = Array.isArray(coupondata) ? coupondata : [];

    if (!searchTerm.trim()) {
      return dataArray;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return dataArray.filter((item) => {
      return (
        item.couponId?.toLowerCase().includes(searchLower) ||
        item.title?.toLowerCase().includes(searchLower) ||
        item.BusinessName?.toLowerCase().includes(searchLower) ||
        item.vouchertype?.vouchertype?.toLowerCase().includes(searchLower) ||
        item.status?.toLowerCase().includes(searchLower)
      );
    });
  }, [coupondata, searchTerm]);

  // Improved sorting function that handles different data types
  const sortData = (array, orderBy, order) => {
    return array.sort((a, b) => {
      // Handle null/undefined values
      if (!a[orderBy] && !b[orderBy]) return 0;
      if (!a[orderBy]) return order === 'asc' ? -1 : 1;
      if (!b[orderBy]) return order === 'asc' ? 1 : -1;

      let valueA = a[orderBy];
      let valueB = b[orderBy];

      // Special handling for nested objects
      if (orderBy === 'vouchertype') {
        valueA = a.vouchertype?.vouchertype || '';
        valueB = b.vouchertype?.vouchertype || '';
      }

      // Handle date fields
      if (orderBy === 'createdAt' || orderBy === 'expiryDate') {
        valueA = new Date(valueA).getTime();
        valueB = new Date(valueB).getTime();
      }

      // Handle string comparison (case insensitive)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort filtered data
  const sortedData = React.useMemo(() => {
    return sortData([...filteredData], orderBy, order);
  }, [filteredData, order, orderBy]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // delete voucher
  const deleteid = async id => {
    let response = await CouponRoute.deleteData(id)
    getcoupon()
    toast.error('Coupon Deleted')
  }

  const getShortDay = () => {
    const dayMap = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
    return dayMap[new Date().getDay()];
  };

  // format date
  const expiryDateFun = (ExpiryDate) => {
    const date = new Date(ExpiryDate);
    const formattedDate = date.toLocaleDateString('en-GB');
    return formattedDate
  }

  // pagination 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = sortedData
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const { lang } = useParams();

  return (
    <>
      <div className='shadow p-4'>
        <div className='flex justify-between'>
          <div className='flex m-2'>
            <Grid size={{ xs: 12, md: 4 }}>
              <CustomTextField
                name="search"
                id='form-props-search'
                label='Search coupons...'
                value={searchTerm}
                onChange={handleSearch}
                type='search'
                placeholder='Search by ID, Title, Business Name, Category, or Status'
              />
            </Grid>
          </div>
          <div className='flex justify-end m-5'>
            {hasPermission('utsav_manage_utsav:add') && (
              <Link href={`/${lang}/apps/utsav/managecoupon/addcoupon`} passHref>
                <Button variant="contained">
                  Add Utsav
                </Button>
              </Link>

            )}
          </div>
        </div>

        {/* Show search results info */}
        {searchTerm && (
          <div className='mb-4 px-2'>
            <span className='text-sm text-gray-600'>
              {filteredData.length > 0
                ? `Found ${filteredData.length} result${filteredData.length !== 1 ? 's' : ''} for "${searchTerm}"`
                : `No results found for "${searchTerm}"`
              }
            </span>
            {searchTerm && (
              <Button
                size="small"
                onClick={() => setSearchTerm('')}
                className='ml-2 text-xs'
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        <TableContainer>
          <Table className={tableStyles.table}>
            <TableHead>
              <TableRow>
                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'couponId'}
                    direction={orderBy === 'couponId' ? order : 'asc'}
                    onClick={() => handleRequestSort('couponId')}
                  >
                    Coupon ID
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleRequestSort('title')}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'BusinessName'}
                    direction={orderBy === 'BusinessName' ? order : 'asc'}
                    onClick={() => handleRequestSort('BusinessName')}
                  >
                    Business Name
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'vouchertype'}
                    direction={orderBy === 'vouchertype' ? order : 'asc'}
                    onClick={() => handleRequestSort('vouchertype')}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleRequestSort('createdAt')}
                  >
                    Created Date
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'expiryDate'}
                    direction={orderBy === 'expiryDate' ? order : 'asc'}
                    onClick={() => handleRequestSort('expiryDate')}
                  >
                    Expiry Date
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>

                <TableCell className='p-2'>Click To Redeem</TableCell>
                <TableCell className='p-2'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={index} className='border-b'>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{item?.couponId}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{item?.title}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{item?.BusinessName}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{item?.vouchertype?.vouchertype}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{expiryDateFun(item?.createdAt)}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <div className='font-medium'>{new Date(item?.expiryDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: true })}</div>
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      <Chip label={item.status} color={statusStyles[item?.status]} variant='tonal' />
                    </TableCell>
                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                      {item.status === "ACTIVE" ? (
                        <Link href={`/${lang}/apps/utsav/managecoupon/redeemhistory/${item._id}`} passHref>
                          <Button
                            variant="contained"
                            disabled={new Date(item.expiryDate) < new Date()}
                          >
                            Redeem
                          </Button>
                        </Link>
                      ) : <Link >
                        <Button
                          variant="contained"
                          disabled
                        >
                          Redeem
                        </Button>
                      </Link>}
                    </TableCell>
                    <TableCell className='px-4 py-2 flex items-center gap-3'>
                      {hasPermission("utsav_manage_utsav:view") && <Link href={`/${lang}/apps/utsav/managecoupon/showcoupon/${item._id}`} passHref>
                        <Eye className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                      </Link>}

                      {hasPermission("utsav_manage_utsav:edit") && (
                        (item.status !== "ACTIVE" || item.status === "PENDING" || item.status === "EXPIRED") ? (
                          <Link href={`/${lang}/apps/utsav/managecoupon/edit/${item._id}`} passHref>
                            <Pencil className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                          </Link>
                        ) : (
                          <span className='cursor-not-allowed'>
                            <Pencil className='text-gray-600 size-5' />
                          </span>
                        )
                      )}

                      {hasPermission("utsav_manage_utsav:delete") && (
                        (item.status !== "ACTIVE" || item.status === "PENDING" || item.status === "EXPIRED") ? (
                          <Trash2
                            className='text-red-500 size-5 cursor-pointer mb-2 hover:scale-110 transition'
                            onClick={() => deleteid(item._id)}
                          />
                        ) : (
                          <span className='cursor-not-allowed'>
                            <Trash2 className='text-gray-600 size-5 hover:scale-110 transition' />
                          </span>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className='text-center py-8'>
                    <div className='text-gray-500'>
                      {searchTerm ? 'No coupons found matching your search.' : 'No coupons available.'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <div className='flex justify-between items-center m-4'>
          <div className='text-sm text-gray-600'>
            {paginatedData.length > 0 ? (
              <>Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries</>
            ) : (
              <>No entries to show</>
            )}
            {searchTerm && (
              <span className='text-gray-500'> (filtered from {Array.isArray(coupondata) ? coupondata.length : 0} total entries)</span>
            )}
          </div>
          {totalPages > 1 && (
            <PaginationRounded
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default CouponTable
