'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Button } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import Link from '@/components/Link'
import PaginationRounded from '../master/pagination'
import RedeemRoute from '@/services/utsav/managecoupon/redeem.services'
import RedeemDateDropdown from './RedeemDateDropdown'

function Historytable({ id }) {

    // console.log(id);
    // const data = [
    //     {
    //         user_id: 1,
    //         user_name: "shyam",
    //         code_by_redeem: "24sjhns",
    //         date_of_redeem: "05/05/2025"
    //     },
    //     {
    //         user_id: 2,
    //         user_name: "Ramji",
    //         code_by_redeem: "2sjnjdnji",
    //         date_of_redeem: "05/05/2025"
    //     },
    //     {
    //         user_id: 3,
    //         user_name: "shyam1",
    //         code_by_redeem: "sbnjsnj",
    //         date_of_redeem: "05/05/2025"
    //     },
    //     {
    //         user_id: 4,
    //         user_name: "shyam2",
    //         code_by_redeem: "2njsjnj",
    //         date_of_redeem: "05/05/2025"
    //     },

    // ]


    const [data, setdata] = useState([]);

    const getHistory = async () => {
        const history = await RedeemRoute.getRedeemHistory(id);
        // console.log(history)
        setdata(history?.data || []);
    }

    useEffect(() => {
        getHistory()
    }, []);


    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // or whatever number of rows per page you want

    const filteredData = [...data]
        .filter(item => item.redeemAt && (Array.isArray(item.redeemAt) ? item.redeemAt.length > 0 : true))
        .reverse();

    const paginatedData = filteredData
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


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
        <div>


            <div>


                <div className='m-2'>
                    <p><span className='mr-2 font-bold'>Redeem History:</span>{paginatedData[0]?.couponId?.title}</p>
                </div>

                <TableContainer>
                    <Table className={tableStyles.table}>
                        <TableHead>
                            <TableRow>

                                <TableCell className='p-2'>
                                    <TableSortLabel>
                                        Customer ID
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel>
                                        User name
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>
                                    <TableSortLabel>
                                        Code by Redeem
                                    </TableSortLabel>
                                </TableCell>

                                <TableCell className='p-2'>Date Of Redeem</TableCell>

                            </TableRow>
                        </TableHead>
                        {paginatedData.map((item, index) =>
                            <TableBody key={index}>
                                <TableRow className='border-b'>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                        <div className='font-medium'>{item?.customerId?.userId}</div>
                                    </TableCell>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                        <div className='font-medium'>
                                            {item?.customerId?.firstName} {item?.customerId?.lastName}
                                        </div>
                                    </TableCell>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                                        <div className='font-medium'>
                                            {item?.couponcode.map(row => row.code).join(', ')}
                                        </div>
                                    </TableCell>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                        {Array.isArray(item?.redeemAt) && item?.redeemAt.length > 2 ? (
                                            <RedeemDateDropdown dates={item.redeemAt} />
                                        ) : (
                                            <div className='font-medium'>
                                                {expiryDateFun(item?.redeemAt)}
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}

                    </Table>
                </TableContainer>
            </div>
            <div className='flex justify-end m-4'>
                <PaginationRounded
                    count={Math.ceil(filteredData.length / itemsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />

            </div>

        </div>
    )
}

export default Historytable
