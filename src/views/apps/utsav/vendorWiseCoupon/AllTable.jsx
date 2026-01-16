'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button, InputAdornment } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'

// MUI Imports
import PaginationRounded from '../master/pagination'
import { Eye, Pencil, Trash2, Search } from 'lucide-react'
import Link from '@/components/Link'
import AllTable from './AllTable'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { toast } from 'react-toastify'
import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAuth } from '@/contexts/AuthContext'

function AllTableAprovaldata({ statusStyles }) {
    const [coupondata, setcoupondata] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');

    // Sorting function
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filteredData = coupondata;

        // Apply search filter if search term exists
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            filteredData = coupondata.filter(item =>
                (item.couponId && item.couponId.toString().toLowerCase().includes(lowercasedSearch)) ||
                (item.title && item.title.toLowerCase().includes(lowercasedSearch)) ||
                (item.BusinessName && item.BusinessName.toLowerCase().includes(lowercasedSearch)) ||
                (item.category?.categoryname && item.category.categoryname.toLowerCase().includes(lowercasedSearch)) ||
                (item.status && item.status.toLowerCase().includes(lowercasedSearch))
            );
        }

        // Apply sorting
        return [...filteredData].sort((a, b) => {
            // Handle date fields differently
            if (orderBy === 'createdAt' || orderBy === 'expiryDate') {
                const dateA = new Date(a[orderBy]).getTime();
                const dateB = new Date(b[orderBy]).getTime();
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Handle string comparison
            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [coupondata, searchTerm, order, orderBy]);

    // fetch coupon
    const getcoupon = async () => {
        const response = await CouponRoute.getCoupon();
        setcoupondata(response.data);
    }

    useEffect(() => {
        getcoupon()
    }, []);

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

    const paginatedData = filteredAndSortedData

        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when search changes
    }

    const { hasPermission } = useAuth();

    return (
        <>
            <div className='shadow p-4'>
                <div className='flex mb-4'>
                    <Grid item xs={12} md={6}>
                        <CustomTextField
                            fullWidth
                            placeholder='Search coupons...'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Search className='text-textSecondary' />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </div>

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
                                        active={orderBy === 'category'}
                                        direction={orderBy === 'category' ? order : 'asc'}
                                        onClick={() => handleRequestSort('category')}
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

                                <TableCell className='p-2'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{item.couponId}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{item.title}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{item.BusinessName}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{item.category?.categoryname}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{expiryDateFun(item.createdAt)}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <div className='font-medium'>{expiryDateFun(item.expiryDate)}</div>
                                        </TableCell>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                            <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                                        </TableCell>
                                        <TableCell className='px-4 py-2 flex items-center gap-3'>


                                            {hasPermission('utsav_approval:view') &&


                                                <Link href={`/en/apps/utsav/managecoupon/showcoupon/${item._id}`} passHref>
                                                    <Eye className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                                </Link>
                                            }



                                            {hasPermission('utsav_approval:edit') &&

                                                <Link href={`/en/apps/utsav/approval/edit/${item._id}`} passHref>
                                                    <Pencil className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                                </Link>
                                            }


                                            {hasPermission('utsav_approval:delete') &&
                                                <Trash2
                                                    className='text-red-500 size-5 cursor-pointer mb-2 hover:scale-110 transition'
                                                    onClick={() => {
                                                        deleteid(item._id)
                                                    }}
                                                />
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" className='p-4'>
                                        No coupons found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className='flex justify-between items-center m-4'>
                    <div className='text-sm text-gray-600'>
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length} entries
                    </div>
                    {filteredAndSortedData.length > 0 && (
                        <PaginationRounded
                            count={Math.ceil(filteredAndSortedData.length / itemsPerPage)}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                        />
                    )}
                </div>
            </div>
        </>
    )
}

export default AllTableAprovaldata
