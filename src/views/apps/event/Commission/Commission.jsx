'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, createFilterOptions, Autocomplete } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import AttendeesService from '@/services/event/event_mgmt/AttendeesService'

const rowsPerPageOptions = [5, 10, 25, 50]

function Commission({ handleClickOpen }) {
    const { hasPermission } = useAuth();
    const [Data, setData] = useState([]);



    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)



    // Sorting state - default to newest first
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...Data].sort((a, b) => {
        // For date fields, newest first by default
        if (orderBy === 'createdAt' || orderBy === 'id') {
            if (order === 'desc') {
                return new Date(b[orderBy]) - new Date(a[orderBy])
            } else {
                return new Date(a[orderBy]) - new Date(b[orderBy])
            }
        }

        // For other fields
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }
    // search
    const [formData, setFormData] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    console.log(formData, "dnjdjdj");

    const handleSearch = async (searchValue) => {
        if (searchValue?.length >= 3) {
            const response = await BannerRoute.getsearch({ search: searchValue });
            if (response.success === true) {
                setSearchData(response.data);
            }
        } else {
            setSearchData([]);
        }
    };

    useEffect(() => { handleSearch() }, [searchValue]);

    const filter = createFilterOptions();

    // 

    const GetData = async () => {
        console.log(formData, "inside")
        const response = await AttendeesService.CommissionSearch(formData);
        setData(response?.data || []);
    }

    useEffect(() => {
        if (formData?.organizer) {
            GetData()
        }

    }, [formData])

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;


    return (
        <div>

            <Autocomplete
                className="w-96"
                freeSolo
                options={SearchData}
                filterOptions={(options, state) => {
                    const input = state.inputValue.toLowerCase();
                    return options.filter((option) => {
                        const companyName = option.companyInfo?.companyName?.toLowerCase() || '';
                        const vendorId = option.vendorId?.toLowerCase() || '';
                        const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || '';
                        return (
                            companyName.includes(input) ||
                            vendorId.includes(input) ||
                            phoneNo.includes(input)
                        );
                    });
                }}
                getOptionLabel={(option) =>
                    option.companyInfo?.companyName ||
                    option.vendorId ||
                    option.contactInfo?.phoneNo ||
                    ''
                }
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    handleSearch(newInputValue);
                }}
                onChange={(event, newValue) => {
                    if (newValue && newValue._id) {
                        setFormData(prev => ({
                            ...prev,
                            organizer: newValue._id
                        }));
                        // setFormErrors(prev => ({ ...prev, organizer: '' }));
                    }
                }}
                renderInput={(params) => (
                    <CustomTextField
                        {...params}
                        className='w-96 mx-4'
                        label="Search Organizer/Vendor"
                        variant="outlined"
                        placeholder="Type at least 3 characters"

                    />
                )}
                renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                        {option.companyInfo?.companyName} - {option.vendorId} - {option.contactInfo?.phoneNo}
                    </li>
                )}
                noOptionsText={
                    inputValue.length < 3
                        ? "Type at least 3 characters to search"
                        : "No Organizer/Vendor found"
                }
            />



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Commission Report</h3>
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
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'desc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    organizer name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'categoryName'}
                                    direction={orderBy === 'categoryName' ? order : 'desc'}
                                    onClick={() => handleRequestSort('categoryName')}
                                >
                                    event name
                                </TableSortLabel>
                            </TableCell>



                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'isPremium'}
                                    direction={orderBy === 'isPremium' ? order : 'desc'}
                                    onClick={() => handleRequestSort('isPremium')}
                                >
                                    Commission %
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'coins'}
                                    direction={orderBy === 'coins' ? order : 'desc'}
                                    onClick={() => handleRequestSort('coins')}
                                >
                                    sales amount
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'totalQuestion'}
                                    direction={orderBy === 'totalQuestion' ? order : 'desc'}
                                    onClick={() => handleRequestSort('totalQuestion')}
                                >
                                    Commission
                                </TableSortLabel>
                            </TableCell>


                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Data.length > 0 ? (
                            paginatedData.map((row) => (
                                <TableRow key={row?._id} className='border-b'>
                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                        <div className='font-medium'>{row?.organizer?.companyInfo?.companyName}</div>
                                    </TableCell>
                                    <TableCell className='p-2'>{row?.event_title}</TableCell>
                                    <TableCell className='p-2'>{row?.commission_percentage} {row?.commission_type === "PERCENTAGE" ? ' %' : ''}</TableCell>
                                    <TableCell className='p-2'>₹{row?.totalsellsAmount}</TableCell>
                                    <TableCell className='p-2'>
                                        ₹ {Number(row?.AllOrganizerAmount || 0) + Number(row?.gst || 0)}

                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align='center'>
                                    No data available.
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, Data.length)} of {Data.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(Data.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default Commission
