'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, FormLabel, RadioGroup, Radio, FormControlLabel, FormHelperText, IconButton } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import TicketService from '@/services/event/event_mgmt/ticketService'
import LanguageService from '@/services/event/masters/languageService'

const rowsPerPageOptions = [5, 10, 25, 50]

function TicketTable({ handleClickOpen, quizType, getdata, Eventid }) {
    const { hasPermission } = useAuth();

    const [EditData, setEditData] = useState({
        // Eventid: Eventid,
        price: '',
        ticket_type: '',
        ticket_name: '',
        description: '',
        avail_ticket: 'Unlimited',
        limited_ticket: '',
        without_variation_price: '',

    });



    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [Editopen, setEditOpen] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    // Sorting state
    const [orderBy, setOrderBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedData = [...quizType].sort((a, b) => {
        if (orderBy === 'createdAt') {
            if (order === 'desc') {
                return new Date(b[orderBy]) - new Date(a[orderBy]);
            } else {
                return new Date(a[orderBy]) - new Date(b[orderBy]);
            }
        }

        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleEditOpen = (row) => {
        setEditData({
            id: row._id,
            price: row.price,
            ticket_name: row.ticket_name,
            ticket_type: row.ticket_type || '',
            description: row.description,
            avail_ticket: row?.avail_ticket || '',
            limited_ticket: row?.limited_ticket || '',
            without_variation_price: row.without_variation_price || '',
        });
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setFormErrors({});
        setEditData({

            ticket_name: '',
            description: '',
            avail_ticket: 'Unlimited',
            limited_ticket: '',
            without_variation_price: '',

        });
    };

    const validateFields = (data) => {
        const errors = {};

        if (!data.ticket_name.trim()) {
            errors.ticket_name = 'Ticket name is required';
        }

        if (!data.description.trim()) {
            errors.description = 'Description is required';
        }

        if (data.ticket_type === 'PAID' && !data.without_variation_price) {
            errors.without_variation_price = 'Price is required';
        } else if (data.ticket_type === 'PAID' && isNaN(data.without_variation_price)) {
            errors.without_variation_price = 'Price must be a number';
        }

        if (data.avail_ticket === 'LIMITED') {
            if (!data.limited_ticket) {
                errors.limited_ticket = 'Ticket quantity is required';
            } else if (isNaN(data.limited_ticket)) {
                errors.limited_ticket = 'Ticket quantity must be a number';
            }
        }

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };





    const handleSubmit = async () => {
        const errors = validateFields({ ...EditData });
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await TicketService.putData(EditData.id, EditData);
            if (response.success === true) {
                toast.success(response.message);
                getdata();
                handleEditClose();
            }
        } catch (error) {
            toast.error("Failed to update ticket");
            console.error(error);
        }
    };


    const deleteId = async (id) => {
        const response = await TicketService.deleteData(id);
        toast.success(response?.message);
        getdata();
    };


    useEffect(() => {
        if (EditData.avail_ticket === "Free") {
            setEditData(prev => ({
                ...prev,
                limited_ticket: '',
                without_variation_price: ''
            }));
        }
    }, [EditData.avail_ticket]);
    return (
        <div>
            <Dialog
                open={Editopen}
                onClose={handleEditClose}
                fullWidth
                maxWidth='md'
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle>
                    <div>Edit Ticket</div>
                    <DialogCloseButton onClick={handleEditClose} />
                </DialogTitle>
                <DialogContent>
                    <div className='flex flex-col gap-4 p-2'>
                        <CustomTextField
                            fullWidth
                            name='ticket_name'
                            label='Ticket Name'
                            value={EditData.ticket_name}
                            onChange={handleChange}
                            error={!!formErrors.ticket_name}
                            helperText={formErrors.ticket_name}
                            required
                        />

                        <CustomTextField
                            fullWidth
                            name='description'
                            label='Description'
                            multiline
                            rows={4}
                            value={EditData.description}
                            onChange={handleChange}
                            error={!!formErrors.description}
                            helperText={formErrors.description}
                            required
                        />

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Ticket Type</FormLabel>
                            <RadioGroup
                                row
                                name='ticket_type'
                                value={EditData.ticket_type}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="FREE" control={<Radio />} label="Free" />
                                <FormControlLabel value="PAID" control={<Radio />} label="Paid" />
                            </RadioGroup>
                        </FormControl>

                        {EditData.ticket_type === 'PAID' && (
                            <CustomTextField
                                fullWidth
                                name='without_variation_price'
                                label='Ticket Price (with taxes)'
                                type='number'
                                value={EditData.without_variation_price || ''}
                                onChange={handleChange}
                                error={!!formErrors.without_variation_price}
                                helperText={formErrors.without_variation_price}
                                required={EditData.ticket_type === 'PAID'}
                            />
                        )}

                        <FormControl component="fieldset" error={!!formErrors.avail_ticket}>
                            <FormLabel component="legend">Ticket Availability</FormLabel>
                            <RadioGroup
                                row
                                name='avail_ticket'
                                value={EditData.avail_ticket || ''}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="UNLIMITED" control={<Radio />} label="Unlimited" />
                                <FormControlLabel value="LIMITED" control={<Radio />} label="Limited" />
                            </RadioGroup>
                        </FormControl>

                        {EditData.avail_ticket === 'LIMITED' && (
                            <CustomTextField
                                fullWidth
                                name='limited_ticket'
                                label='Ticket Quantity'
                                type='number'
                                value={EditData.limited_ticket}
                                onChange={handleChange}
                                error={!!formErrors.limited_ticket}
                                helperText={formErrors.limited_ticket}
                                required={EditData.avail_ticket === 'LIMITED'}
                            />
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant='contained'

                    >
                        Edit Ticket
                    </Button>
                </DialogActions>
            </Dialog>
            {/* table */}
            < TableContainer className='shadow p-6' >
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Ticket Pricing</h3>
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
                        {hasPermission('event_manageEvents:add') && (

                            <Button variant='contained' onClick={handleClickOpen}>Add Ticket</Button>
                        )}
                    </div>
                </div>
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'ticket_name'}
                                    direction={orderBy === 'ticket_name' ? order : 'desc'}
                                    onClick={() => handleRequestSort('ticket_name')}
                                >
                                    Title
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'price'}
                                    direction={orderBy === 'price' ? order : 'desc'}
                                    onClick={() => handleRequestSort('price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'avail_ticket'}
                                    direction={orderBy === 'avail_ticket' ? order : 'desc'}
                                    onClick={() => handleRequestSort('avail_ticket')}
                                >
                                    Tickets Available
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row?.ticket_name}</TableCell>

                                <TableCell className='p-2'>
                                    {[row?.variation_price, row?.without_variation_price, row?.price]
                                        .filter(val => val && val.toString().trim() !== "")
                                        .join(", ")}
                                </TableCell>

                                <TableCell className='p-2'>
                                    {[
                                        ...(Array.isArray(row?.variation_ticket) ? row.variation_ticket : [row?.variation_ticket]),
                                        row?.variation_ticket_type,
                                        row?.limited_ticket,
                                        row?.avail_ticket
                                    ]
                                        .filter(val => val?.toString().trim())
                                        .join(", ")}
                                </TableCell>

                                <TableCell className='p-2'>
                                    {hasPermission('event_manageEvents:edit') &&
                                        <Pencil
                                            onClick={() => handleEditOpen(row)}
                                            className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }

                                    {hasPermission('event_manageEvents:delete') &&
                                        <Trash2
                                            onClick={() => deleteId(row._id)}
                                            className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                                        />
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, quizType.length)} of {quizType.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(quizType.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer >
        </div >
    )
}

export default TicketTable
