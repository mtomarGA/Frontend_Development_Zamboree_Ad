'use client'
import React, { useEffect, useState, useMemo } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button, InputAdornment, Avatar, Grid } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'

// MUI Imports
import PaginationRounded from '../../announce/list/pagination';
import { Eye, Pencil, Trash2, Search } from 'lucide-react'
import Link from '@/components/Link'
import AllTable from './AllTable'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { toast } from 'react-toastify'
// import Grid from '@mui/material/Grid2'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import { useAuth } from '@/contexts/AuthContext'
import EventService from '@/services/event/event_mgmt/event';

function AllTableAprovaldata({ statusStyles, coupondata, getcoupon }) {
    // const [coupondata, setcoupondata] = useState([]);
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
                (item.event_title && item.event_title.toString().toLowerCase().includes(lowercasedSearch)) ||
                (item?.event_category?.categoryname && item?.event_category?.categoryname.toLowerCase().includes(lowercasedSearch)) ||
                (item.createdAt && item.createdAt.toLowerCase().includes(lowercasedSearch)) ||
                (item.organizer?.companyInfo?.companyName && item?.organizer?.companyInfo?.companyName.toLowerCase().includes(lowercasedSearch)) ||
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
    // const getcoupon = async () => {
    //     const response = await EventService.Get();
    //     setcoupondata(response.data);
    // }

    // useEffect(() => {
    //     getcoupon()
    // }, []);

    const deleteid = async (id) => {
        const response = await EventService.deleteData(id);
        if (response?.success == true) {
            toast.error(response.message);
            getcoupon();
            return
        }
    };

    // const getShortDay = () => {
    //     const dayMap = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
    //     return dayMap[new Date().getDay()];
    // };

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
                            placeholder='Search Event...'
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
