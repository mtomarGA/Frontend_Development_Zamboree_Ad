'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Chip, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'


// MUI Imports

import PaginationRounded from '../master/pagination'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Link from '@/components/Link'
import AllTable from './AllTable'
import CouponRoute from '@/services/utsav/managecoupon/manage'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'


function PendingTable({ statusStyles, coupondata }) {

    const { hasPermission } = useAuth();


    const deleteid = async id => {
        let response = await CouponRoute.deleteData(id)
        getcoupon()
        toast.error('Coupon Deleted')
        // fetchData();
    }

    const getShortDay = () => {
        const dayMap = ["sun", "mon", "tues", "wed", "thurs", "fri", "sat"];
        return dayMap[new Date().getDay()];
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

    const paginatedData = [...coupondata]
        .reverse()
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    return (
        <>
            <div className='shadow p-4'>


                <TableContainer>
                    <Table className={tableStyles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell className='p-2'>
                                    <TableSortLabel>Coupon ID</TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel>Title</TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel>Business Name</TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>Category</TableCell>
                                <TableCell className='p-2'>Created Date</TableCell>
                                <TableCell className='p-2'>Expiry Date</TableCell>
                                <TableCell className='p-2'>Status</TableCell>

                                <TableCell className='p-2'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((item, index) => (
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
                                        <div className='font-medium'>{item.category?.categoryname}</div>
                                    </TableCell>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                        <div className='font-medium'>{expiryDateFun(item?.createdAt)}</div>
                                    </TableCell>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>

                                        <div className='font-medium'>{expiryDateFun(item?.expiryDate)}</div>
                                    </TableCell>

                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                        <Chip label={item.status} color={statusStyles[item?.status]} variant='tonal' />
                                    </TableCell>





                                    <TableCell className='px-4 py-2 flex items-center gap-3'>

                                        {hasPermission('utsav_approval:view') &&
                                            <Link href={`/apps/utsav/managecoupon/showcoupon/${item._id}`} passHref>
                                                <Eye className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition' />
                                            </Link>
                                        }

                                        {hasPermission('utsav_approval:edit') &&
                                            <Link href={`/apps/utsav/approval/edit/${item._id}`} passHref>
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
                            ))}
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

export default PendingTable
