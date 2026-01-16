'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip, Avatar } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import Image from '@/services/imageService'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
const rowsPerPageOptions = [5, 10, 25, 50]
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { Grid } from '@mui/material'

import contestRoute from '@/services/quiz/quiz-contest/contestService'
import Link from '@/components/Link'
import OptionMenu from '@/@core/components/option-menu'
import { useAuth } from '@/contexts/AuthContext'
const statusSytles = {
    DISTRIBUTED: 'success',
    NOT_DISTRIBUTED: 'error',

}

function getOrdinal(n) {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function ContestTable({ handleClickOpen, contestdata, getdata }) {

    const { hasPermission } = useAuth();
    const [EditData, setEditData] = useState({
        sort_id: '',
        categoryName: '',
        slug: '',
        status: 'ACTIVE',
        numWinners: 0,
        winnerPrizes: []
    });
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Edit modal State
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditOpen(true)
        // console.log(row, "roeddmd")
    }
    const handleEditClose = () => {
        setEditOpen(false)
        setFormErrors({})
        setImage({ icon: null })
    }

    // Sorting state
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const [data, setData] = useState(contestdata)

    React.useEffect(() => {
        setData(contestdata)
    }, [contestdata])

    const sortedData = [...data].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // form error and submit
    const [formErrors, setFormErrors] = useState({})
    const [image, setImage] = useState({ icon: null })

    const validateFields = (data) => {
        let errors = {}
        if (!data.sortingNo) errors.sortingNo = 'Sorting No. is required'
        if (!data.name) errors.name = 'Name is required'
        if (!data.icon) errors.icon = 'Icon is required'
        if (!data.startDate) errors.startDate = 'Start Date is required'
        if (!data.endDate) errors.endDate = 'End Date is required'
        if (!data.entryFee) errors.entryFee = 'Entry Fee is required'
        if (!data.numWinners) errors.numWinners = 'Number of Winners is required'
        if (!data.winnerPrizes) errors.winnerPrizes = 'Winner Prizes are required'
        if (!data.status) errors.status = 'Status is required'
        if (!data.terms) errors.terms = 'Terms and Conditions are required'
        return errors
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }



    const onchangeimage = async (e) => {
        const { name, files } = e.target
        const result = await Image.uploadImage({ image: files[0] })
        if (result.data.url) {
            setEditData(prev => ({
                ...prev,
                [name]: result.data.url
            }))
            if (formErrors[name]) {
                setFormErrors(prev => ({ ...prev, [name]: '' }))
            }
        }
    }

    const handleSubmit = async () => {
        const errors = validateFields(EditData)
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            toast.error('Please fill all required fields')
            return
        }


        try {
            // Replace with your actual API call
            const response = await contestRoute.putData(EditData._id, EditData)
            if (response.success === true) {
                toast.success(response.message)
                getdata()
                handleEditClose()
            }

            // handleEditClose()
        } catch (error) {
            toast.error("Failed to add category")
            console.error(error)
        }
    }

    // format date
    const expiryDateFun = (ExpiryDate) => {
        const date = new Date(ExpiryDate);
        const formattedDate = date.toLocaleDateString('en-GB');
        return formattedDate
    }



    // Drag and drop handler
    const handleDragEnd = async (result) => {
        if (!result.destination) return
        const oldIndex = result.source.index
        const newIndex = result.destination.index
        if (oldIndex === newIndex) return

        // Update only the current page's order
        const updatedPage = Array.from(paginatedData)
        const [removed] = updatedPage.splice(oldIndex, 1)
        updatedPage.splice(newIndex, 0, removed)

        // Update sortingNo for the updatedPage
        updatedPage.forEach((item, idx) => {
            item.sortingNo = (currentPage - 1) * rowsPerPage + idx + 1
        })

        // Merge back into the full data array
        const start = (currentPage - 1) * rowsPerPage
        const newData = [...data]
        for (let i = 0; i < updatedPage.length; i++) {
            newData[start + i] = updatedPage[i]
        }

        // Sort the newData by sortingNo
        newData.sort((a, b) => a.sortingNo - b.sortingNo)

        setData(newData)

        const response = await contestRoute.updateOrder(newData);
        if (response.success === true) {
            toast.success(response.message)
            getdata()
        }
    }

    const getEditData = (row) => {
        setEditData({
            _id: row?._id,
            sortingNo: row?.sortingNo,
            name: row?.name,
            icon: row?.icon,
            startDate: row?.startDate,
            endDate: row?.endDate,
            entryFee: row?.entryFee,
            numWinners: row?.numWinners,
            winnerPrizes: row?.winnerPrizes,
            status: row?.status,
            terms: row?.terms,
        })
        // setEditOpen(true)
    }

    const handleDelete = async (id) => {
        const response = await contestRoute.deleteData(id)
        if (response.success === true) {
            toast.success(response.message)
            getdata()
        }
    }

    // Add this state for today's date to avoid hydration errors
    const [today, setToday] = useState(null)

    useEffect(() => {
        setToday(new Date())
    }, [])




    return (
        <div>
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Edit Contest
                    </Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>

                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='sortingNo'
                            label='Sorting No.'
                            onChange={handleChange}
                            value={EditData?.sortingNo || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.sortingNo}
                            helperText={formErrors.sortingNo}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='name'
                            label='Name'
                            onChange={handleChange}
                            value={EditData?.name || ''}
                            multiline
                            rows={1}
                            variant='outlined'
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />
                    </div>
                    <div className='m-2'>
                        <label htmlFor='icon' className='text-sm'>
                            Image
                        </label>
                        <div>
                            <Button
                                variant='outlined'
                                component='label'
                                className='w-96'
                            >
                                Upload File
                                <input
                                    type='file'
                                    hidden
                                    name='icon'
                                    onChange={onchangeimage}
                                    key={EditData?.icon ? 'file-selected' : 'file-empty'}
                                />
                            </Button>

                            {EditData.icon && (
                                <Typography variant='body2' className='mt-2 text-green-700 truncate w-96 align-bottom'>
                                    Selected: {EditData?.icon}
                                    <Avatar src={EditData?.icon} />
                                </Typography>
                            )}
                            {formErrors.icon && (
                                <Typography variant='body2' color="error">
                                    {formErrors.icon}
                                </Typography>
                            )}
                        </div>
                    </div>
                    <div>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <AppReactDatepicker
                                selected={EditData?.startDate ? new Date(EditData?.startDate) : null}
                                id='basic-input'
                                className='w-96 mx-2'
                                minDate={today}
                                onChange={date => setEditData({ ...EditData, startDate: date })}
                                placeholderText='Click to select a date'
                                customInput={<CustomTextField label='Start Date' error={!!formErrors.startDate} helperText={formErrors.startDate} fullWidth />}
                            />
                        </Grid>

                    </div>
                    <div className='my-2'>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <AppReactDatepicker
                                selected={EditData?.endDate ? new Date(EditData?.endDate) : null}
                                id='basic-input'
                                className='w-96 mx-2'
                                minDate={today}
                                onChange={date => setEditData({ ...EditData, endDate: date })}
                                placeholderText='Click to select a date'
                                customInput={<CustomTextField label='End Date' error={!!formErrors.endDate} helperText={formErrors.endDate} fullWidth />}
                            />
                        </Grid>
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='entryFee'
                            label='Entry Fee Points'
                            type='number'
                            onWheel={e => e.target.blur()}
                            onChange={handleChange}
                            value={EditData?.entryFee || ''}
                            variant='outlined'
                            error={!!formErrors.entryFee}
                            helperText={formErrors.entryFee}
                        />
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='numWinners'
                            label='Distribute Prize To Top Users'
                            type='number'
                            value={EditData?.numWinners}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10) || 0;
                                setEditData(prev => ({
                                    ...prev,
                                    numWinners: value,
                                    winnerPrizes: Array.from({ length: value }, (_, i) => prev.winnerPrizes[i] || '')
                                }));
                            }}
                            onWheel={e => e.target.blur()}
                            variant='outlined'
                        />
                    </div>
                    {Array.from({ length: EditData?.numWinners }).map((_, idx) => (
                        <div className='m-2' key={idx}>
                            <CustomTextField
                                className='w-96'
                                label={`${idx + 1}${getOrdinal(idx + 1)} Winner Prize`}
                                value={EditData?.winnerPrizes[idx] || ''}
                                onChange={e => {
                                    const newPrizes = [...EditData.winnerPrizes];
                                    newPrizes[idx] = e.target.value;
                                    setEditData(prev => ({
                                        ...prev,
                                        winnerPrizes: newPrizes
                                    }));
                                }}
                                variant='outlined'
                            />
                        </div>
                    ))}
                    <div className='m-2'>
                        <CustomTextField
                            select
                            className='w-96'
                            name='status'
                            label='Status'
                            value={EditData?.status}
                            onChange={handleChange}
                            error={!!formErrors.status}
                            helperText={formErrors.status}
                        >
                            <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                            <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                        </CustomTextField>
                    </div>
                    <div className='m-2'>
                        <CustomTextField
                            className='w-96'
                            name='terms'
                            label='Terms and Condition'
                            onChange={handleChange}
                            value={EditData?.terms || ''}
                            multiline
                            rows={4}
                            variant='outlined'
                            error={!!formErrors.terms}
                            helperText={formErrors.terms}
                        />
                    </div>

                </DialogContent>
                <DialogActions>
                    {hasPermission('quiz_contest:edit') &&
                        <Button onClick={handleSubmit} variant='contained'>
                            Edit Contest
                        </Button>
                    }
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>



            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Contest</h3>
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
                        {hasPermission('quiz_contest:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Contest</Button>
                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'></TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'id'}
                                    direction={orderBy === 'id' ? order : 'asc'}
                                    onClick={() => handleRequestSort('id')}
                                >
                                    ID
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'name'}
                                    direction={orderBy === 'name' ? order : 'asc'}
                                    onClick={() => handleRequestSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'startDate'}
                                    direction={orderBy === 'startDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('startDate')}
                                >
                                    Start Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'endDate'}
                                    direction={orderBy === 'endDate' ? order : 'asc'}
                                    onClick={() => handleRequestSort('endDate')}
                                >
                                    End Date
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'image'}
                                    direction={orderBy === 'image' ? order : 'asc'}
                                    onClick={() => handleRequestSort('image')}
                                >
                                    Image
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'entry'}
                                    direction={orderBy === 'entry' ? order : 'asc'}
                                    onClick={() => handleRequestSort('entry')}
                                >
                                    Entry
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'participants'}
                                    direction={orderBy === 'participants' ? order : 'asc'}
                                    onClick={() => handleRequestSort('participants')}
                                >
                                    Participants
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'question'}
                                    direction={orderBy === 'question' ? order : 'asc'}
                                    onClick={() => handleRequestSort('question')}
                                >
                                    Total Question
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'prize_status'}
                                    direction={orderBy === 'prize_status' ? order : 'asc'}
                                    onClick={() => handleRequestSort('prize_status')}
                                >
                                    Prize Status
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="contest-table-body">
                            {(provided) => (
                                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                    {paginatedData.map((row, index) => (
                                        <Draggable key={row._id} draggableId={row._id} index={index}>
                                            {(provided, snapshot) => (
                                                <TableRow
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className='border-b'
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? 0.5 : 1,
                                                        cursor: 'move',
                                                        backgroundColor: snapshot.isDragging ? 'rgba(0,0,0,0.05)' : 'inherit',
                                                    }}
                                                >
                                                    <TableCell className='p-2 cursor-grab' {...provided.dragHandleProps}>
                                                        <i className='tabler-grip-vertical text-gray-400 text-xl' />
                                                    </TableCell>
                                                    <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                                        <div className='font-medium'>{row.sortingNo}</div>
                                                    </TableCell>
                                                    <TableCell className='p-2'>
                                                        <Chip label={row.status} variant='tonal' color={`${statusSytles[row.status]}`} />
                                                    </TableCell>
                                                    <TableCell className='p-2'>{row?.name}</TableCell>
                                                    <TableCell className='p-2'>{expiryDateFun(row.startDate)}</TableCell>
                                                    <TableCell className='p-2'>{expiryDateFun(row.endDate)}</TableCell>
                                                    <TableCell className='p-2'>
                                                        <Avatar src={row.icon} />
                                                    </TableCell>
                                                    <TableCell className='p-2'>{row?.entryFee}</TableCell>
                                                    <TableCell className='p-2'>{row?.participants}</TableCell>
                                                    <TableCell className='p-2'>{row?.totalQuestions}</TableCell>
                                                    <TableCell className='p-2'>
                                                        <Chip label={row?.prize_status} variant='tonal' size='small' color={`${statusSytles[row.prize_status]}`} />
                                                    </TableCell>
                                                    <TableCell className='p-2 flex items-center'>
                                                        <OptionMenu
                                                            iconClassName='text-xl text-gray-500'
                                                            options={[

                                                                {
                                                                    text: 'Edit',
                                                                    icon: <Pencil className='text-blue-500 size-5' />,
                                                                    menuItemProps: {
                                                                        onClick: () => { handleEditOpen(row); getEditData(row); }
                                                                    }
                                                                },
                                                                {
                                                                    text: 'Delete',
                                                                    icon: <Trash2 className='text-red-500 size-5' />,
                                                                    menuItemProps: {
                                                                        onClick: () => handleDelete(row._id)
                                                                    }
                                                                },
                                                                {
                                                                    divider: true
                                                                },
                                                                {
                                                                    text: 'Levels',
                                                                    icon: <i className='tabler-layers-difference text-primary size-5' />,
                                                                    href: `/en/apps/quiz/contest/level/${row._id}`
                                                                },
                                                                {
                                                                    text: 'Leaderboard',
                                                                    icon: <i className='tabler-layers-difference text-primary size-5' />,
                                                                    href: `/en/apps/quiz/contest/leaderboard/${row._id}`
                                                                },
                                                                {
                                                                    text: 'Distribute Prize',
                                                                    icon: <i className='tabler-layers-difference text-primary size-5' />,
                                                                    href: `/en/apps/quiz/contest/distrubute-prize/${row._id}`
                                                                }
                                                            ]}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </TableBody>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, contestdata.length)} of {contestdata.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(contestdata.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default ContestTable
