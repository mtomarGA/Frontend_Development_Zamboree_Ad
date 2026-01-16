'use client'
import React, { useEffect, useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Pencil } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { useAuth } from '@/contexts/AuthContext'
import { useParams } from 'next/navigation'
import BookedTicket from '@/services/event/event_mgmt/BookedTicket'

const rowsPerPageOptions = [5, 10, 25, 50]



function TransactionTable({ handleClickOpen }) {
  const { id } = useParams();

  const [event_id, setevent_id] = useState('');
  const [data, setdata] = useState([]);


  const Transaction = async () => {
    const response = await BookedTicket.getbyEventid(id);
    console.log(response, "dds")
    setdata(response?.data || [])
  }

  useEffect(() => {
    if (id) {
      setevent_id(id);
      Transaction()
    }
  }, [id])



  // const [data, setdata] = useState([])
  // const data = [{
  //   categoryName: "hiii",
  //   _id: 1
  // }]


  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Edit modal State
  const [Editopen, setEditOpen] = useState(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

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

  // setdata[{ categoryname: "hey" }]
  const { hasPermission } = useAuth();
  const statusStyles = {
    PENDING: "warning",
    COMPLETED: "success"
  }

  return (

    <div>

      {/* edit modal */}

      <Dialog
        onClose={handleEditClose}
        aria-labelledby='customized-dialog-title'
        open={Editopen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Edit
          </Typography>
          <DialogCloseButton onClick={handleEditClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>

          Chupa chups jelly-o candy sweet roll wafer cake chocolate bar. Brownie sweet roll topping cake chocolate
          cake cheesecake tiramisu chocolate cake. Jujubes liquorice chocolate bar pastry. Chocolate jujubes caramels
          pastry. Ice cream marshmallow dragée bonbon croissant. Carrot cake sweet donut ice cream bonbon oat cake
          danish sugar plum. Gingerbread gummies marzipan gingerbread.
          {/* </Typography> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} variant='tonal' color='secondary'>
            Close
          </Button>
          <Button onClick={handleEditClose} variant='contained'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>





      {/* table */}
      <TableContainer className='shadow p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='mb-4'>Transaction </h3>
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
            {/* <Button variant='contained' onClick={handleClickOpen}>Add Category</Button> */}
          </div>
        </div>
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'orderid'}
                  direction={orderBy === 'orderid' ? order : 'asc'}
                  onClick={() => handleRequestSort('orderid')}
                >
                  Order ID
                </TableSortLabel>
              </TableCell>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'transactionid'}
                  direction={orderBy === 'transactionid' ? order : 'asc'}
                  onClick={() => handleRequestSort('transactionid')}
                >
                  Transaction ID
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'event_title'}
                  direction={orderBy === 'event_title' ? order : 'asc'}
                  onClick={() => handleRequestSort('event_title')}
                >
                  Event
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'image'}
                  direction={orderBy === 'image' ? order : 'asc'}
                  onClick={() => handleRequestSort('image')}
                >
                  Customer Name
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'Eventid.organizer.companyInfo.companyName'}
                  direction={orderBy === 'Eventid.organizer.companyInfo.companyName' ? order : 'asc'}
                  onClick={() => handleRequestSort('Eventid.organizer.companyInfo.companyName')}
                >
                  Organizer
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'quantity'}
                  direction={orderBy === 'quantity' ? order : 'asc'}
                  onClick={() => handleRequestSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'cust_paid'}
                  direction={orderBy === 'cust_paid' ? order : 'asc'}
                  onClick={() => handleRequestSort('cust_paid')}
                >
                  Amount Paid
                </TableSortLabel>
              </TableCell>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'paid_via'}
                  direction={orderBy === 'paid_via' ? order : 'asc'}
                  onClick={() => handleRequestSort('paid_via')}
                >
                  Payment  Method
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Payment Status
                </TableSortLabel>
              </TableCell>

              <TableCell className='p-2'>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleRequestSort('createdAt')}
                >
                  Date
                </TableSortLabel>
              </TableCell>


              <TableCell className='p-2'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row?._id} className='border-b'>
                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                  <div className='font-medium'>{row?.orderid}</div>
                </TableCell>
                <TableCell className='p-2'>{row?.transactionid}</TableCell>
                <TableCell className='p-2'>{row?.Eventid?.event_title}</TableCell>
                <TableCell className='p-2'>{row?.user?.firstName} {row?.user?.lastName}</TableCell>
                <TableCell className='p-2'>{row?.Eventid?.organizer?.companyInfo?.companyName}</TableCell>
                <TableCell className='p-2'>{row?.quantity}</TableCell>
                <TableCell className='p-2'>{row?.cust_paid}</TableCell>
                <TableCell className='p-2'>{row?.paid_via}</TableCell>
                <TableCell className='p-2'>
                  <Chip label={row?.status} color={statusStyles[row?.status]} variant='tonal' />
                </TableCell>
                <TableCell className='p-2'>{new Date(row?.createdAt).toLocaleDateString("en-GB")},{new Date(row?.createdAt).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}</TableCell>


                <TableCell className='p-2'>
                  {hasPermission('event_manageEvents:edit') && (
                    <Pencil
                      onClick={() => handleEditOpen()}
                      className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition'
                    />

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


export default TransactionTable
