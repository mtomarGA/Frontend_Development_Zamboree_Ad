'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import RedeemRoute from '@/services/utsav/managecoupon/redeem.services'
import PaginationRounded from '../master/pagination'
import RedeemDateDropdown from './RedeemDateDropdown'


function Couponhistory() {


    const CouponId = useParams();
    console.log(CouponId.id);


    const [HistoryData, setHistoryData] = useState([]);

    const getHistory = async () => {
        const history = await RedeemRoute.getRedeemHistory(CouponId.id);
        console.log(history.data)
        setHistoryData(history.data);
    }

    useEffect(() => {
        getHistory()
    }, []);


    // pagination


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // or whatever number of rows per page you want

    // const paginatedData = [...HistoryData]
    //     .reverse()
    //     .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const filteredData = [...HistoryData]
        .filter(item => item.redeemAt && (Array.isArray(item.redeemAt) ? item.redeemAt.length > 0 : true))
        .reverse();

    const paginatedData = filteredData
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    // formate date
    const expiryDateFun = (expiryDates) => {
        if (Array.isArray(expiryDates)) {
            return expiryDates.map(date =>
                new Date(date).toLocaleDateString('en-GB')
            ).join(', '); // Join the formatted dates with commas or line breaks
        } else {
            return new Date(expiryDates).toLocaleDateString('en-GB');
        }
    };


    return (
        <>

            <div className='m-2'>
                <h3 className='font-bold'>
                    Redeem History:
                    <span className='font-normal mx-2'>
                        {HistoryData?.[0]?.couponId?.title || 'N/A'}
                    </span>
                </h3>
            </div>


            <TableContainer>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>

                            <TableCell className='p-2'>
                                <TableSortLabel>
                                    Customer Id
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel>
                                    Customer Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel>
                                    Code by Redeem
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>Date of Redeem</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((item, index) =>


                            <TableRow key={index} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <div className='font-medium'>{item.customerId?.userId}</div>
                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <div className='font-medium'>{item.customerId?.firstName} <span>{item.customerId?.lastName}</span>
                                    </div>
                                </TableCell>

                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                    <div className='font-medium'>
                                        {item?.couponcode.map(row => row.code).join(', ')}
                                    </div>

                                </TableCell>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    {Array.isArray(item.redeemAt) && item.redeemAt.length > 2 ? (
                                        <RedeemDateDropdown dates={item.redeemAt} />
                                    ) : (
                                        <div className='font-medium'>
                                            {expiryDateFun(item.redeemAt)}
                                        </div>
                                    )}
                                </TableCell>


                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className='flex justify-end m-4'>

                    <PaginationRounded
                        count={Math.ceil(filteredData.length / itemsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />

                </div>
            </TableContainer>
        </>
    )
}

export default Couponhistory
