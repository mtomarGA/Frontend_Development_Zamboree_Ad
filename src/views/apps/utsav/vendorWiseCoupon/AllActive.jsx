'use client';
import React, { useEffect, useState } from 'react';
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Chip,
} from '@mui/material';
import tableStyles from '@core/styles/table.module.css';
import PaginationRounded from '../master/pagination';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Link from '@/components/Link';
import CouponRoute from '@/services/utsav/managecoupon/manage';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

function AllActive({ statusStyles, coupondata }) {
    const { hasPermission } = useAuth();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('couponId');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const deleteid = async (id) => {
        await CouponRoute.deleteData(id);
        getcoupon();
        toast.error('Coupon Deleted');
    };

    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate);
        return date.toLocaleDateString('en-GB');
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
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

    const sortedData = stableSort(coupondata, getComparator(order, orderBy));
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className='shadow p-4'>
            <TableContainer>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {[
                                { id: 'couponId', label: 'Coupon ID' },
                                { id: 'title', label: 'Title' },
                                { id: 'BusinessName', label: 'Business Name' },
                                { id: 'category', label: 'Category' },
                                { id: 'createdAt', label: 'Created Date' },
                                { id: 'expiryDate', label: 'Expiry Date' },
                                { id: 'status', label: 'Status' },
                            ].map((col) => (
                                <TableCell key={col.id} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === col.id}
                                        direction={orderBy === col.id ? order : 'asc'}
                                        onClick={() => handleRequestSort(col.id)}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell className='p-2'>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2'>{item?.couponId}</TableCell>
                                <TableCell className='p-2'>{item?.title}</TableCell>
                                <TableCell className='p-2'>{item?.BusinessName}</TableCell>
                                <TableCell className='p-2'>{item?.category?.categoryname}</TableCell>
                                <TableCell className='p-2'>{expiryDateFun(item?.createdAt)}</TableCell>
                                <TableCell className='p-2'>{expiryDateFun(item?.expiryDate)}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip
                                        label={item.status}
                                        color={statusStyles[item?.status] || 'default'}
                                        variant='tonal'
                                    />
                                </TableCell>
                                <TableCell className='p-2 flex items-center gap-2'>
                                    {hasPermission('utsav_approval:view') && (
                                        <Link href={`/en/apps/utsav/managecoupon/showcoupon/${item._id}`} passHref>
                                            <Eye className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                        </Link>)
                                    }
                                    {hasPermission('utsav_approval:edit') && (
                                        <Link href={`/en/apps/utsav/approval/edit/${item._id}`} passHref>
                                            <Pencil className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                        </Link>)
                                    }

                                    {hasPermission('utsav_approval:delete') && (
                                        <Trash2
                                            className='text-red-500 size-5 cursor-pointer hover:scale-110 transition'
                                            onClick={() => deleteid(item._id)}
                                        />)
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className='flex justify-between items-center m-4'>
                <div className='text-sm text-gray-600'>
                    Showing {(currentPage - 1) * itemsPerPage + 1}–
                    {Math.min(currentPage * itemsPerPage, coupondata.length)} of {coupondata.length} entries
                </div>
                <PaginationRounded
                    count={Math.ceil(coupondata.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />
            </div>
        </div>
    );
}

export default AllActive;
