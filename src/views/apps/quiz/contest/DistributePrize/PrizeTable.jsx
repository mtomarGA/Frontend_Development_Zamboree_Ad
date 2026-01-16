'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, CircularProgress } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../../announce/list/pagination'
import quizRoute from '@/services/quiz/quiztypeServices'
import { toast } from 'react-toastify'

const rowsPerPageOptions = [5, 10, 25, 50]

function PrizeTable({ data }) {

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...data].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    const paginatedData = sortedData
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }


    const [editData, setEditData] = useState({});
   const handleEdit = () => {
  const ids = data
    .filter(item => item._id)
    .map(item => ({ customer_id: item.user._id, id: item._id, prize: item.prize }));

  return ids;
};

const[isloading,setIsLoading] = useState(false)
const handleDistributePrize = async () => {
  try {
    setIsLoading(true);
    const ids = handleEdit(); 
    const response = await quizRoute.distribute_Prize(ids);
    console.log(response, "success")
    if (response?.success === true) {
      toast.success(response?.message || "Prize distributed successfully");
    }
  } catch (error) {
    toast.error(error.message || "Failed to distribute prize");
  } finally {
    setIsLoading(false);
  }
};


    return (
        <div>
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Distribute Prize</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
                                label='Rows per page'
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'user.userId'}
                                    direction={orderBy === 'user.userId' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user.userId')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'user.firstName'}
                                    direction={orderBy === 'user.firstName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user.firstName')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'user.email'}
                                    direction={orderBy === 'user.email' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user.email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'score'}
                                    direction={orderBy === 'score' ? order : 'asc'}
                                    onClick={() => handleRequestSort('score')}
                                >
                                    Score
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'rank'}
                                    direction={orderBy === 'rank' ? order : 'asc'}
                                    onClick={() => handleRequestSort('rank')}
                                >
                                    Rank
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'prize'}
                                    direction={orderBy === 'prize' ? order : 'asc'}
                                    onClick={() => handleRequestSort('prize')}
                                >
                                    Prize
                                </TableSortLabel>
                            </TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.user?.userId}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row?.user?.firstName}&nbsp;{row?.user?.lastName}</TableCell>
                                <TableCell className='p-2'>{row?.user?.email}</TableCell>
                                <TableCell className='p-2'>{row?.score}</TableCell>
                                <TableCell className='p-2'>{row?.rank}</TableCell>
                                <TableCell className='p-2'>{row?.prize ? `${row?.prize} coins` : '0'}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, data.length)} of {data.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(data.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>

                {/* buttons */}

                <div className='flex justify-center'>
                    <Button variant='contained' color='primary' onClick={() => {  handleDistributePrize(); }} className='mx-4'
                       startIcon={isloading ? <CircularProgress size={20} /> : null} >Distribute Prize</Button>
                    <Button className='mx-4 bg-gray-600 text-white'>Cancel</Button>
                </div>
            </TableContainer>
        </div>
    )
}

export default PrizeTable
