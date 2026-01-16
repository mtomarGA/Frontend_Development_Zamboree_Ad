'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button, Avatar } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'


// MUI Imports

import PaginationRounded from '../../announce/list/pagination';
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Link from '@/components/Link'
import AllTable from './AllTable'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import EventService from '@/services/event/event_mgmt/event';


function RejectedTable({ statusStyles, coupondata, getcoupon }) {

    const { hasPermission } = useAuth();
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('createdAt');

    const deleteid = async (id) => {
        const response = await EventService.deleteData(id);
        if (response?.success == true) {
            toast.error(response.message);
            getcoupon();
            return
        }
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




    // formate date
    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate);
        const formattedDate = date.toLocaleDateString('en-GB'); // This formats it as dd/mm/yyyy
        return formattedDate
        // console.log(formattedDate)
    }


    // pagination 

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10 // or whatever number of rows per page you want
    const sortedData = stableSort(coupondata, getComparator(order, orderBy));
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <>

            <div className='shadow p-4'>


                <TableContainer>
                    <Table className={tableStyles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'thumbnail'}
                                        direction={orderBy === 'thumbnail' ? order : 'desc'}
                                        onClick={() => handleRequestSort('thumbnail')}
                                    >
                                        Image
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'event_title'}
                                        direction={orderBy === 'event_title' ? order : 'desc'}
                                        onClick={() => handleRequestSort('event_title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'event_category'}
                                        direction={orderBy === 'event_category' ? order : 'desc'}
                                        onClick={() => handleRequestSort('event_category')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'createdAt'}
                                        direction={orderBy === 'createdAt' ? order : 'desc'}
                                        onClick={() => handleRequestSort('createdAt')}
                                    >
                                        Created At
                                    </TableSortLabel>
                                </TableCell>


                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'organizer'}
                                        direction={orderBy === 'organizer' ? order : 'desc'}
                                        onClick={() => handleRequestSort('organizer')}
                                    >
                                        Organizer
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'sales'}
                                        direction={orderBy === 'sales' ? order : 'desc'}
                                        onClick={() => handleRequestSort('sales')}
                                    >
                                        Sales
                                    </TableSortLabel>
                                </TableCell>



                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'status'}
                                        direction={orderBy === 'status' ? order : 'desc'}
                                        onClick={() => handleRequestSort('status')}
                                    >
                                        Approval Status
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === 'is_feature'}
                                        direction={orderBy === 'is_feature' ? order : 'desc'}
                                        onClick={() => handleRequestSort('is_feature')}
                                    >
                                        Is Featured
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <TableRow key={index} className='border-b'>
                                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                            <div className='font-medium'>
                                                <Avatar src={row?.thumbnail} />
                                            </div>
                                        </TableCell>
                                        <TableCell className='p-2'>{row?.event_title}</TableCell>
                                        <TableCell className='p-2'>{row?.event_category?.categoryname}</TableCell>
                                        <TableCell className='p-2'>{expiryDateFun(row?.createdAt)}</TableCell>
                                        <TableCell className='p-2'>{row?.organizer?.companyInfo?.companyName}</TableCell>
                                        <TableCell className='p-2'>{row?.sales}</TableCell>

                                        <TableCell className='p-2'>
                                            <Chip label={row?.status} variant='tonal' color={statusStyles[row?.status]} />
                                        </TableCell>
                                        <TableCell className='p-2'>{row?.is_feature}</TableCell>
                                        <TableCell className='px-4 py-2 flex items-center gap-3'>


                                            {hasPermission('event_event_approval:view') &&


                                                <Link href={`/en/apps/event/manageEvents/show/${row._id}`} passHref>
                                                    <Eye className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                                </Link>
                                            }



                                            {hasPermission('event_event_approval:edit') &&

                                                <Link href={`/en/apps/event/approval/${row._id}/approval`} passHref>
                                                    <Pencil className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                                </Link>
                                            }


                                            {hasPermission('event_event_approval:delete') &&
                                                <Trash2
                                                    className='text-red-500 size-5 cursor-pointer mb-2 hover:scale-110 transition'
                                                    onClick={() => {
                                                        deleteid(row?._id)
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
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, coupondata.length)} of {coupondata.length} entries
                    </div>
                    <PaginationRounded
                        count={Math.ceil(coupondata.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>

            </div>
        </>
    )
}

export default RejectedTable
