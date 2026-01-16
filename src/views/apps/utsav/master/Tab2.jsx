import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from '@mui/material'
import { Pencil, Square, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import billRoute from '@/services/utsav/billing'
import { toast } from 'react-toastify'
import PaginationRounded from './pagination'
import { useAuth } from '@/contexts/AuthContext'

function Tab2({ getbill, statusStyles, billSortConfig, handleBillSort, billSearchTerm, getFilteredAndSortedBillData, fetchbill }) {


  const { hasPermission } = useAuth();


  const [billEditdata, setBillEditdata] = useState({});

  const [BillEditopen, setBillEditOpen] = useState(false)
  const handleBillEditOpen = () => setBillEditOpen(true)
  const handleBillEditClose = () => setBillEditOpen(false)



  const [formErrors1, setFormErrors1] = useState({})
  const validateFields1 = data => {
    let errors = {}

    if (!data.billingtype) errors.billingtype = 'Billing Type is required'
    if (!data.status) errors.status = 'Status is required'

    return errors
  }



  const editbillchange = (e) => {
    setBillEditdata({ ...billEditdata, [e.target.name]: e.target.value });
    console.log(billEditdata);

  }



  // show default Edit data in edit modal
  const editid = async updateid => {
    let result = await billRoute.getdatabyid(updateid)
    // console.log(updateid)
    console.log(result.data);
    setBillEditdata({
      billingtype: result.data.billingtype,

      status: result.data.status,

      id: result.data._id
    })

  }


  // edit final submit
  const EditBill = async (id) => {
    const errors = validateFields1(billEditdata)
    if (Object.keys(errors).length > 0) {
      setFormErrors1(errors)
      return
    }

    setFormErrors1({})
    let result = await billRoute.putData(id, billEditdata)
    // let response= await billRoute(billEditdata);
    console.log(result);
    fetchbill()
    handleBillEditClose()
    toast.success('Bill Type Added')
  }


  //   delete bill
  const deleteid = async id => {
    let response = await billRoute.deleteData(id);
    toast.error('Bill Deleted');
    fetchbill();
  }




  // pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // or whatever number of rows per page you want

  const paginatedData = [...getbill]
    .reverse()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  // 




  return (




    <>

      {/* bill edit modal */}

      <Dialog
        onClose={handleBillEditClose}
        aria-labelledby='customized-dialog-title'
        open={BillEditopen}
        fullWidth
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Edit Billing Type
          </Typography>
          <DialogCloseButton onClick={handleBillEditClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          {/* <Typography> */}


          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <TextField
                name='billingtype'
                label='Billing Type'
                onChange={editbillchange}
                value={billEditdata.billingtype || ''}
                fullWidth
                // multiline
                rows={1} // Increase this for more height
                variant='outlined'
                error={!!formErrors1.billingtype}
                helperText={formErrors1.billingtype}
              />
            </div>
          </div>

          <div className='m-2 mr-4'>
            <CustomTextField
              className='m-2'
              select
              fullWidth
              name='status'
              label='Status'
              id='controlled-select'
              value={billEditdata.status || ""}
              onChange={editbillchange}
              error={!!formErrors1.status}
              helperText={formErrors1.status}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>
          {/* </Typography> */}
        </DialogContent>
        <DialogActions>
          {hasPermission('utsav_master:edit') && <Button onClick={(() => {
            EditBill(billEditdata.id)
          })} variant='contained'>
            Update
          </Button>}

          <Button onClick={handleBillEditClose} variant='tonal' color='secondary'>
            Close
          </Button>


        </DialogActions>
      </Dialog>



      {/* Tab2 table */}


      <TableContainer className='p-4'>
        <Table className={tableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={billSortConfig.key === 'billingtype'}
                  direction={billSortConfig.key === 'billingtype' ? billSortConfig.direction : 'asc'}
                  onClick={() => handleBillSort('billingtype')}
                >
                  Billing Type
                </TableSortLabel>
              </TableCell>
              <TableCell className='p-2'>
                <TableSortLabel
                  active={billSortConfig.key === 'status'}
                  direction={billSortConfig.key === 'status' ? billSortConfig.direction : 'asc'}
                  onClick={() => handleBillSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell className='p-2'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getFilteredAndSortedBillData().length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className='text-center p-4'>
                  <Typography variant='body2' color='textSecondary'>
                    {billSearchTerm ? 'No results found for your search.' : 'No data available.'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              getFilteredAndSortedBillData().map((item, index) => (
                <TableRow key={index} className='border-b'>
                  <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                    <div className='font-medium'>{item.billingtype}</div>
                  </TableCell>

                  <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                    <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                  </TableCell>

                  <TableCell className='px-4 py-2 flex items-center gap-3'>
                    {/* Add your edit/delete functionality here */}
                    {hasPermission("utsav_master:edit") &&
                      <Pencil className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition'
                        onClick={() => {
                          editid(item._id), handleBillEditOpen()
                        }}
                      />
                    }
                    {hasPermission("utsav_master:delete") &&
                      <Trash2 className='text-red-500 size-5 cursor-pointer hover:scale-110 transition'
                        onClick={() => {
                          deleteid(item._id)
                        }}
                      />
                    }
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className='flex justify-between items-center m-4'>
        <Typography variant='body2' color='textSecondary'>
          Showing {getFilteredAndSortedBillData().length} results
        </Typography>
      </div>


    </>
  )
}

export default Tab2
