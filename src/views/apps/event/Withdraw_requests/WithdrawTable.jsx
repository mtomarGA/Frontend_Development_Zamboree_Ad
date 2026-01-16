'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Autocomplete, createFilterOptions, Tooltip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import WithdrawService from '@/services/event/event_mgmt/WithdrawService'
import BannerRoute from '@/services/utsav/banner/bannerServices'
import ShowModal from './ShowModal'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyle = {
    APPROVED: "success",
    PENDING: 'error'
}

function WithdrawTable({ handleClickOpen, getdata, data, getbank, getBankFun, Editopen, setEditOpen, }) {
    const { hasPermission } = useAuth();

    // show modal
    // States
    const [ShowData, setShowData] = useState([]);

    const [Showopen, setShowOpen] = useState(false)
    const handleShowOpen = (row) => {
        setShowOpen(true)
        setShowData({
            bank: row.bank || "",
            accountNo: row.accountNo || "",
            ifsc: row.ifsc || '',
            req_amount: row.req_amount || '',
            contactNo: row.organizer.contactInfo.phoneNo || '',

        })
    }
    const handleShowClose = () => setShowOpen(false)


    const [EditData, setEditData] = useState({
        status: "",
        withdrawid: '',
        req_amount: '',
        organizer: ''
    });

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State

    const handleEditOpen = (row) => {
        getBankFun();
        setEditData({
            id: row._id,
            // total_amount: row.total_amount || '',
            req_amount: row.req_amount,
            status: row.status || 'ACTIVE',
            organizer: row.organizer._id,
            bank: row.bank,
            accountNo: row.accountNo,
            ifsc: row.ifsc,
            repeat_accountNo: row.accountNo,
            withdrawid: row.withdrawid || '',
            eventid: row.eventid

        })
        setEditOpen(true)
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setEditData({
            status: "",
            withdrawid: '',
            req_amount: '',
            organizer: ''
        })
    }

    // Sorting state - default to newest first
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...data].sort((a, b) => {
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

    // form error and submit
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const validateFields = (data) => {
        let errors = {}
        if (!data.req_amount) errors.req_amount = 'Request Amount is required'
        if (!data.organizer) errors.organizer = 'Organizer is required'
        if (!data.status) errors.status = 'Status is required'
        // if (!data.bank) errors.bank = 'Bank Name is required'
        // if (!data.ifsc) errors.ifsc = 'IFSC Code is required'
        // if (!data.accountNo) errors.accountNo = 'Account No. is required'
        // if (!data.repeat_accountNo) errors.repeat_accountNo = 'Repeat Account No. is required'
        // if (data.accountNo && data.repeat_accountNo && data.accountNo !== data.repeat_accountNo)
        //     errors.repeat_accountNo = 'Account No. Mismatched'
        return errors
    }


    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditData(prev => {
            const updatedData = { ...prev, [name]: value };
 
            // const accountNo = name === 'accountNo' ? value : updatedData.accountNo;
            // const repeat_accountNo = name === 'repeat_accountNo' ? value : updatedData.repeat_accountNo;

            // Account No. mismatch check
            // if (accountNo && repeat_accountNo && accountNo !== repeat_accountNo) {
            //     setFormErrors(prevErrors => ({
            //         ...prevErrors,
            //         repeat_accountNo: 'Account No. Mismatched',
            //     }));
            // } else {
            //     setFormErrors(prevErrors => ({
            //         ...prevErrors,
            //         repeat_accountNo: '',
            //     }));
            // }

            // Clear individual field error
            if (formErrors[name]) {
                setFormErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: '',
                }));
            }

            return updatedData;
        });
    };

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }

        try {
            const response = await WithdrawService.putData(EditData.id, EditData);
            toast.success(response?.message)
            handleEditClose()
            getdata()
        } catch (error) {
            toast.error("Failed to update")
            console.error(error)
        }
    }

    const DeleteData = async (id) => {
        const response = await WithdrawService.deleteData(id);
        if (response.success == true) {
            toast.success(response?.message);
            getdata();
        }
    }


    // search
    const [inputValue, setInputValue] = useState('');
    const [SearchData, setSearchData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const onSearch = (e) => {
        setSearchValue({ ...searchValue, [e.target.name]: e.target.value });
    }

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


    const [vendorEvent, setVendorEvent] = useState([]);
    const getvendorEvent = async () => {
        // console.log(Adddata)
        const res = await WithdrawService.vendorEvent(EditData?.organizer);
        console.log(res, "vendorEVnt");
        setVendorEvent(res.data || []);
    }

    useEffect(() => {
        getvendorEvent();
    }, [EditData.organizer])



    return (
        <div>

            {/* show */}
            < ShowModal Showopen={Showopen} ShowData={ShowData} handleShowClose={handleShowClose} handleShowOpen={handleShowOpen} />

            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Withdraw Requests
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div className='mx-2'>

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
                                    setEditData(prev => ({
                                        ...prev,
                                        organizer: newValue._id
                                    }));
                                    setFormErrors(prev => ({ ...prev, organizer: '' }));
                                }
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    className='w-96'
                                    label="Search Organizer/Vendor"
                                    variant="outlined"
                                    placeholder="Type at least 3 characters"
                                    error={!!formErrors.organizer}
                                    helperText={formErrors.organizer}
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
                    </div>

                    <div className="mx-2 mt-4">
                        <Autocomplete
                            className="w-96"
                            options={vendorEvent}
                            getOptionLabel={(option) => option.event_title || ""}
                            value={vendorEvent.find((ev) => ev._id === EditData.eventid) || null}
                            onChange={(event, newValue) => {
                                setEditData((prev) => ({
                                    ...prev,
                                    eventid: newValue?._id || "",
                                }));
                                setFormErrors((prev) => ({ ...prev, eventid: "" }));
                            }}
                            renderInput={(params) => (
                                <CustomTextField
                                    {...params}
                                    className="w-96"
                                    label="Select Event"
                                    variant="outlined"
                                    placeholder="Choose event"
                                    error={!!formErrors.eventid}
                                    helperText={formErrors.eventid}
                                />
                            )}
                            noOptionsText={
                                EditData.organizer
                                    ? vendorEvent.length === 0
                                        ? "No events found for this vendor"
                                        : "No matching events"
                                    : "Select a vendor first"
                            }
                        />
                    </div>


                    {/* <div className='m-2'>
                        <CustomAutocomplete
                            fullWidth
                            options={getbank.filter(bank => bank.status === 'ACTIVE')}
                            id='autocomplete-custom'
                            getOptionLabel={option => option.name || ''}
                            renderInput={params => (
                                <CustomTextField
                                    placeholder='Select Bank Name'
                                    {...params}
                                    label='Bank Name'
                                />
                            )}
                            value={getbank.find(bank => bank._id === EditData.bank) || null}
                            onChange={(event, value) => {
                                setEditData({
                                    ...EditData,
                                    bank: value ? value._id : '',
                                });
                            }}
                        />

                    </div> */}




                    {/* <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='accountNo'
                            label='Account No.'
                            onChange={handleChange}
                            value={EditData.accountNo || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.accountNo}
                            helperText={formErrors.accountNo}
                        />
                    </div> */}

                    {/* <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='repeat_accountNo'
                            label='Repeat Account No.'
                            onChange={handleChange}
                            value={EditData.repeat_accountNo || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.repeat_accountNo}
                            helperText={formErrors.repeat_accountNo}
                        />


                    </div> */}
{/* 
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='ifsc'
                            label='IFSC code'
                            onChange={handleChange}
                            value={EditData.ifsc || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.ifsc}
                            helperText={formErrors.ifsc}
                        />
                    </div> */}

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='req_amount'
                            label='Request Amount'
                            onChange={handleChange}
                            value={EditData.req_amount || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.req_amount}
                            helperText={formErrors.req_amount}
                        />
                    </div>


                    {/* Withdraw ID */}
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='withdrawid'
                            label='Withdraw ID'
                            onChange={handleChange}
                            value={EditData.withdrawid || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.withdrawid}
                            helperText={formErrors.withdrawid}
                        />
                    </div>


                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData.status}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='APPROVED'>APPROVED</MenuItem>
                            <MenuItem value='PENDING'>PENDING</MenuItem>
                            <MenuItem value='REJECTED'>REJECTED</MenuItem>

                        </CustomTextField>
                    </div>


                </DialogContent>
                <DialogActions>
                    {hasPermission('event_withdraw_requests:edit') && (
                        <Button
                            onClick={handleSubmit}
                            variant='contained'
                            disabled={!!formErrors.repeat_accountNo}
                        >
                            Save changes
                        </Button>

                    )}
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Withdraw Requests</h3>
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
                        {hasPermission('event_withdraw_requests:add') && (

                            <Button variant='contained' onClick={() => {
                                handleClickOpen()
                            }}>Add </Button>
                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'categoryName'}
                                    direction={orderBy === 'categoryName' ? order : 'desc'}
                                    onClick={() => handleRequestSort('categoryName')}
                                >
                                    Withdraw ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'organizer.companyInfo.companyName'}
                                    direction={orderBy === 'organizer.companyInfo.companyName' ? order : 'desc'}
                                    onClick={() => handleRequestSort('organizer.companyInfo.companyName')}
                                >
                                    Organiser
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'total_amount'}
                                    direction={orderBy === 'total_amount' ? order : 'desc'}
                                    onClick={() => handleRequestSort('total_amount')}
                                >
                                    Total Amount
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'req_amount'}
                                    direction={orderBy === 'req_amount' ? order : 'desc'}
                                    onClick={() => handleRequestSort('req_amount')}
                                >
                                    Requests Amount
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'desc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row?._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.withdrawid}</div>
                                </TableCell>

                                <TableCell className='p-2'>{row?.organizer?.companyInfo?.companyName}</TableCell>
                                <TableCell className='p-2'>{row?.total_amount}</TableCell>
                                <TableCell className='p-2'>{row?.req_amount}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} color={statusStyle[row.status]} variant='tonal' />

                                </TableCell>
                                <TableCell className='p-2'>
                                    {hasPermission('event_withdraw_requests:edit') && (
                                        row.status !== 'APPROVED' ? (
                                            <Tooltip title="Edit Withdraw Request">

                                                <Pencil
                                                    onClick={() => handleEditOpen(row)}
                                                    className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title='Can not Edit Approved Requests'>

                                                <Pencil
                                                    className='text-gray-400 mx-2 size-5 cursor-not-allowed'
                                                    onClick={(e) => e.preventDefault()}

                                                />
                                            </Tooltip>
                                        )
                                    )}

                                    {hasPermission('event_withdraw_requests:view') &&
                                        <Eye
                                            onClick={() => handleShowOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }

                                    {hasPermission('event_withdraw_requests:delete') && (
                                        row.status !== 'APPROVED' ? (
                                            <Trash2
                                                onClick={() => DeleteData(row?._id)}
                                                className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                            />
                                        ) : (
                                            <Trash2
                                                className='text-gray-400 mx-2 size-5 cursor-not-allowed'
                                                onClick={(e) => e.preventDefault()} // optional
                                                title="Deletion disabled for active requests"
                                            />
                                        )
                                    )}

                                </TableCell>
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
            </TableContainer>
        </div>
    )
}

export default WithdrawTable
