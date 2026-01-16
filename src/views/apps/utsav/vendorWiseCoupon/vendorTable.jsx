'use client'

import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import Link from '@/components/Link'
import { Pencil } from 'lucide-react'
import Grid from '@mui/material/Grid2'
import CustomTextField from '@core/components/mui/TextField'
import VendorWiseCouponRoute from '@/services/utsav/managecoupon/vendor.services'
import PaginationRounded from '../master/pagination'
import { useAuth } from '@/contexts/AuthContext'

function VendorTable({ vendordata, setvendordata }) {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('vendorId');
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setsearch] = useState('');
    const itemsPerPage = 10;

    const { hasPermission } = useAuth();

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const descendingComparator = (a, b, orderBy) => {
        const getValue = (obj, path) => {
            return path.split('.').reduce((o, p) => (o ? o[p] : null), obj);
        };

        const aValue = getValue(a, orderBy);
        const bValue = getValue(b, orderBy);

        if (bValue < aValue) return -1;
        if (bValue > aValue) return 1;
        return 0;
    };

    const getComparator = (order, orderBy) => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const onsearch = (e) => {
        setsearch(e.target.value.toLowerCase());
    };

    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate);
        return date.toLocaleDateString('en-GB');
    };

    const filteredData = vendordata.filter(item =>
        item.vendor?.vendorId?.toLowerCase().includes(search) ||
        item.vendor?.companyInfo?.companyName?.toLowerCase().includes(search)
    );

    const sortedData = stableSort(filteredData, getComparator(order, orderBy));
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className='shadow p-4'>
            <div className='mx-2 my-2'>
                <h3>Vendor Wise Coupons</h3>
            </div>

            <div className='flex m-2 my-3'>
                <Grid size={{ xs: 12, md: 2 }}>
                    <CustomTextField
                        id='form-props-search'
                        label='Search field'
                        name='search'
                        placeholder='Search by Business Id or Business Name'
                        onChange={onsearch}
                        type='search'
                        value={search}
                    />
                </Grid>
            </div>

            <TableContainer>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'vendor.vendorId'}
                                    direction={orderBy === 'vendor.vendorId' ? order : 'asc'}
                                    onClick={() => handleRequestSort('vendor.vendorId')}
                                >
                                    Business Id
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'vendor.companyInfo.companyName'}
                                    direction={orderBy === 'vendor.companyInfo.companyName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('vendor.companyInfo.companyName')}
                                >
                                    Business Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'totalActiveCoupons'}
                                    direction={orderBy === 'totalActiveCoupons' ? order : 'asc'}
                                    onClick={() => handleRequestSort('totalActiveCoupons')}
                                >
                                    Total Active Coupons
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'lastAddedCoupon'}
                                    direction={orderBy === 'lastAddedCoupon' ? order : 'asc'}
                                    onClick={() => handleRequestSort('lastAddedCoupon')}
                                >
                                    Last Added Coupon Date
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{item.vendor?.vendorId}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{item.vendor?.companyInfo?.companyName}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{item.totalActiveCoupons}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{expiryDateFun(item.lastAddedCoupon)}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    {hasPermission('utsav_vendor_wise_utsav:view') && (
                                        <Link href={`/en/apps/utsav/vendorwiseallcoupons/${item._id}`} passHref>
                                            <Button variant='contained' size='small'>View All Coupons</Button>
                                        </Link>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex justify-between items-center m-4'>
                    <div className='text-sm text-gray-600'>
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <PaginationRounded
                        count={Math.ceil(filteredData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    );
}

export default VendorTable;
