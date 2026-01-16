'use client'
import React, { useState, useEffect } from 'react'
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import quizRoute from '@/services/quiz/quiztypeServices'


const rowsPerPageOptions = [5, 10, 25, 50]

function LeaderDailyTable() {
    const [data, setdata] = useState([]);
    const [isloading, setloading] = useState(false);


    const getLeaderboard = async () => {
        try {
            setloading(true);
            const res = await quizRoute.allleaderboard('monthly');
            setdata(res.data || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        getLeaderboard();
    }, []);






    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        const searchTerm = search.toLowerCase()
        const filtered = data.filter(item =>
            item?.id?.toString().includes(searchTerm) ||
            item?.user?.firstName?.toLowerCase().includes(searchTerm) ||
            item?.user?.lastName?.toLowerCase().includes(searchTerm) ||
            item?.user?.email?.toLowerCase().includes(searchTerm) ||
            item?.totalScore?.toString().includes(searchTerm) ||
            item?.rank?.toString().includes(searchTerm)
        )
        setFilteredData(filtered)
    }, [search, data])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...filteredData].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    return (
        <div>
            <div className='flex justify-center items-center'>
                {isloading && <CircularProgress />}
            </div>
            {!isloading &&
                <TableContainer className='shadow p-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h3 className='mb-4'>Leaderboard Daily</h3>
                        <div className='flex items-center gap-2'>
                            <CustomTextField
                                placeholder='Search...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Typography variant='body2'>Rows per page:</Typography>
                            <FormControl size='small' variant='standard'>
                                <Select
                                    value={rowsPerPage}
                                    className='mx-2 w-16'
                                    onChange={handleChangeRowsPerPage}
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
                                {['id', 'name', 'email', 'totalScore', 'rank'].map(column => (
                                    <TableCell key={column} className='p-2'>
                                        <TableSortLabel
                                            active={orderBy === column}
                                            direction={orderBy === column ? order : 'asc'}
                                            onClick={() => handleRequestSort(column)}
                                        >
                                            {column.charAt(0).toUpperCase() + column.slice(1)}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((row) => (
                                <TableRow key={row?.id} className='border-b'>
                                    <TableCell className='p-2'>{row?.id}</TableCell>
                                    <TableCell className='p-2'>{row?.name}</TableCell>
                                    <TableCell className='p-2'>{row?.email}</TableCell>
                                    <TableCell className='p-2'>{row?.score}</TableCell>
                                    <TableCell className='p-2'>{row?.rank}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                        <Typography variant='body2' className='text-gray-600'>
                            Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
                        </Typography>
                        <PaginationRounded
                            count={Math.ceil(filteredData.length / rowsPerPage)}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                        />
                    </div>
                </TableContainer>}
        </div>
    )
}

export default LeaderDailyTable
