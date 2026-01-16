'use client'
import { useEffect, useState } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Button from '@mui/material/Button'
import tableStyles from '@core/styles/table.module.css'
import Grid from '@mui/material/Grid'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import AnnounceService from '@/services/announce/services'

import Box from '@mui/material/Box'

import PaginationRounded from './pagination'
import Show from './show'
import MenuItem from '@mui/material/MenuItem'
// datepicker
import { addDays, subDays, setHours, setMinutes } from 'date-fns'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { Chip, TextField, FormControl, InputLabel, Select } from '@mui/material'
import AnnouncementTable from './Announcetable'
import BranchService from '@/services/employee/Master/BranchService'
import DepartmentService from '@/services/employee/Master/DepartmentService'
import DesignationService from '@/services/employee/Master/DesignationService'
import { useAuth } from '@/contexts/AuthContext'


const statusStyles = {
  ACTIVE: 'success',
  INACTIVE: 'error'
}

export default function AnnouceMain() {
  // red color error
  const [formErrors, setFormErrors] = useState({})
  const validateFields = data => {
    let errors = {}

    if (!data.title) errors.title = 'Title is required'
    if (!data.message) errors.message = 'Message is required'
    if (!data.expiryDatetime) errors.expiryDatetime = 'Expiry date & time is required'
    if (!data.status) errors.status = 'Status is required'
    if (!data.branch) errors.branch = 'Branch is required'
    if (!data.department) errors.department = 'Department is required'
    if (!data.designation) errors.designation = 'Designation is required'

    return errors
  }


  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);




  const { hasPermission } = useAuth();
  // announcement from modal
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // add announcement
  const [Alldata, setAlldata] = useState({ status: 'INACTIVE' })
  const [GetData, SetGetData] = useState([])

  //  let [editvalue,setEditValue]= useState({})
  let [EditData, setEditData] = useState({
    title: '',
    message: '',
    status: 'INACTIVE',
    expiryDatetime: '',
    branch: '',
    department: '',
    designation: [],

  })

  // edit from modal
  const [Editopen, setEditOpen] = useState(false)
  const handleEditOpen = () => setEditOpen(true)
  const handleEditClose = () => setEditOpen(false)

  // search
  // const [Searchdata, setSearchdata] = useState()
  // const Onsearch = e => {
  //   setSearchdata({ ...Searchdata, [e.target.name]: e.target.value })
  //   // console.log(Searchdata)
  //   GetSearch(e.target.value)
  // }

  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (!value) {
      setFilteredData(GetData); // If search cleared, show all
      return;
    }

    const lowercasedValue = value.toLowerCase();

    const filtered = GetData.filter(item =>
      item.title?.toLowerCase().includes(lowercasedValue) ||
      item.message?.toLowerCase().includes(lowercasedValue) ||
      item.status?.toLowerCase().includes(lowercasedValue)
    );

    setFilteredData(filtered);
  };


  // useEffect(() => {
  //   GetSearch()
  // }, [Searchdata]);

  // itemsperpage
  const [itemsPerPage, setItemsPerPage] = useState(10); // Or default 10

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  //pagination
  const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 10 // Change as needed

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  // const currentItems = GetData?.slice(indexOfFirstItem, indexOfLastItem)
  const currentItems = Array.isArray(filteredData)
    ? filteredData.slice(indexOfFirstItem, indexOfLastItem)
    : [];



  // getdata

  const getinput = e => {
    setAlldata({ ...Alldata, [e.target.name]: e.target.value })
    // console.log(Alldata)
  }

  // edit onchange
  const getedit = e => {
    setEditData({ ...EditData, [e.target.name]: e.target.value })
    // console.log(EditData)
  }

  // delete

  const deleteAnnounce = async id => {
    let response = await AnnounceService.deleteData(id)
    // console.log(response);
    toast.error('Announcement Deleted')
    fetchData()
  }

  // show
  const [ModalShowdata, setModalShowdata] = useState([])

  const [ShowOpen, setShowOpen] = useState(false)
  // showdata function
  const handleShowOpen = async showid => {
    setShowOpen(true)
    let result = await AnnounceService.getdatabyid(showid)
    console.log(result.data)
    setModalShowdata(result.data)

  }
  const handleShowClose = () => setShowOpen(false)



  // const addSubmit = async () => {
  //   const { title, expiryDatetime, message, status, designation, branch, department } = Alldata
  //   if (!title || !expiryDatetime || !message || !status) {
  //     return alert('Please fill all fields')
  //   } else {
  //     let result = await AnnounceService.PostAnnouce(Alldata)
  //     console.log(result)
  //     handleClose()
  //     fetchData()
  //   }
  // }

  // addsubmit
  const addSubmit = async () => {
    const errors = validateFields(Alldata)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    let result = await AnnounceService.PostAnnouce(Alldata)
    handleClose()
    fetchData()
    toast.success('Announcement Added')
  }

  // show default Edit data in edit modal
  const editid = async updateid => {
    let result = await AnnounceService.getdatabyid(updateid)
    console.log(result.data)
    // setEditValue(result.data)
    setEditData({
      title: result.data.title,
      message: result.data.message,
      status: result.data.status,
      expiryDatetime: result.data.expiryDatetime,
      branch: result.data.branch,
      department: result.data.department,
      designation: result.data.designation,
      id: result.data._id
    })
    // console.log(result)
  }

  console.log(EditData, "dddddddddddd")

  // updatereq
  const updatereq = async id => {
    const errors = validateFields(EditData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    let response = await AnnounceService.putData(id, EditData)
    fetchData()
    handleEditClose()
    toast.success('Announcement Updated')
  }

  // fetch data

  const fetchData = async () => {
    let response = await AnnounceService.getAnnounce()
    // console.log(response.data.data, "heyy")
    SetGetData(response?.data?.data)
    setFilteredData(response?.data?.data);
  }

  // console.log(date)

  useEffect(() => {
    fetchData()
  }, [])



  const GetSearch = async (value) => {
    // SetGetData([]);



    let res = await AnnounceService.getsearch({ searchvalue: value })
    // console.log(res.data)
    SetGetData(res.data)
  }


  const [branch, setBranch] = useState([]);
  const [department, setDepartment] = useState([]);
  const [designation, setDesignation] = useState([]);


  const departmentFun = async () => {
    const res = await DepartmentService.get();
    setDepartment(res.data);
  }
  const designationFun = async () => {
    const res = await DesignationService.get();
    setDesignation(res.data);
  }



  const branchFun = async () => {
    let res = await BranchService.get();
    // console.log(res.data, "branch")
    setBranch(res.data);

  };

  useEffect(() => {
    branchFun();
    departmentFun();
    designationFun();
  }, [open, Editopen]);


  console.log(Alldata, "ddjjd")

  return (
    <div className='p-6 shadow '>
      {/* modal */}

      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Add Announcement
          </Typography>
          <DialogCloseButton onClick={handleClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>
          {/* <Typography> */}
          {/* title */}
          <div className='m-4'>
            <Box component='form' noValidate autoComplete='off' className='flex gap-6 flex-wrap'>
              <CustomTextField
                label='Title'
                name='title'
                error={!!formErrors.title}
                helperText={formErrors.title}
                className='w-full'
                onChange={getinput}
                id='controlled-text-field'
              />
            </Box>
          </div>

          {/* message */}
          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <TextField
                name='message'
                label='Message'
                onChange={getinput}
                fullWidth
                multiline
                rows={4} // Increase this for more height
                variant='outlined'
                error={!!formErrors.message}
                helperText={formErrors.message}
              />
            </div>
          </div>

          {/* expiry time */}
          {/* <div className='m-2'>
              <label htmlFor='extime'>Expiry Date & Time</label>
              <input
                type='date'
                
                onChange={getinput}
                id='extime'
                name='expiryDatetime'
                placeholder='Expiry Date & Time'
                className='w-full border px-3 py-2 rounded'
              />

            </div> */}

          {/* expiryDatetime */}
          <div className='m-2 mx-4'>
            <Grid item xs={12} lg={6}>

              {isClient && (
                <AppReactDatepicker
                  selected={Alldata.expiryDatetime ? new Date(Alldata.expiryDatetime) : null}
                  id='basic-input'
                  onChange={date => setAlldata(prev => ({ ...prev, expiryDatetime: date }))}
                  placeholderText='Click to select a date'
                  dateFormat='dd-MM-yyyy'
                  customInput={
                    <CustomTextField
                      label='Expiry Date'
                      fullWidth
                      error={!!formErrors.expiryDatetime}
                      helperText={formErrors.expiryDatetime}
                    />
                  }
                  minDate={new Date()}
                />
              )}

            </Grid>
          </div>

          <div className='flex flex-row'>
            {/* branch */}

            <div className='m-4'>

              <CustomTextField
                className='my-2 w-52'
                select
                name='branch'
                label='Branch'
                id='controlled-select'
                value={Alldata.branch?._id || Alldata.branch || ''}
                onChange={e => setAlldata({ ...Alldata, branch: e.target.value })}
                error={!!formErrors.branch}
                helperText={formErrors.branch}
              >
                {[...new Map(branch.map(item => [item.name, item])).values()]
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
              </CustomTextField>

            </div>

            {/* department */}

            <div className='m-4'>
              <CustomTextField
                className='my-2 w-52'
                select
                name='department'
                label='Department'
                id='controlled-select'
                value={Alldata.department?._id || Alldata.department || ''}
                onChange={e => setAlldata({ ...Alldata, department: e.target.value })}
                error={!!formErrors.department}
                helperText={formErrors.department}
              >
                {[...new Map(department.map(item => [item.name, item])).values()]
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type?.name}
                    </MenuItem>
                  ))}
              </CustomTextField>
            </div>
          </div>

          {/* designation */}
          <div className='mx-4'>
            <CustomTextField
              fullWidth
              select
              multiple
              name='designation'
              label='Designation'
              id='controlled-multiselect'
              value={Array.isArray(Alldata.designation) ? Alldata.designation : []}
              onChange={e => {
                const selected = e.target.value;
                setAlldata({ ...Alldata, designation: selected });
              }}
              error={!!formErrors.designation}
              helperText={formErrors.designation}
              SelectProps={{
                multiple: true,
                renderValue: selected => {
                  // You can format display text here (e.g., names instead of IDs)
                  const selectedNames = designation
                    .filter(d => selected.includes(d._id))
                    .map(d => d.name)
                    .join(', ');
                  return selectedNames;
                }
              }}
            >
              {[...new Map(designation.map(item => [item.name, item])).values()]
                .filter(type => type.status === 'ACTIVE')
                .map(type => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
            </CustomTextField>
          </div>
          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              value={Alldata.status || ''}
              name='status'
              label='Status'
              id='controlled-select'
              slotProps={{
                select: {
                  onChange: getinput
                }
              }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>
          {/* </Typography> */}
        </DialogContent>
        <DialogActions>
          {hasPermission('announce:add') &&
            <Button onClick={addSubmit} variant='contained'>
              Add Announcement
            </Button>
          }
          <Button onClick={handleClose} variant='tonal' color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* show */}

      <Show
        handleShowClose={handleShowClose}
        ShowOpen={ShowOpen}
        handleShowOpen={handleShowOpen}
        ModalShowdata={ModalShowdata}
      />



      {/* editModal */}

      <Dialog
        onClose={handleEditClose}
        aria-labelledby='customized-dialog-title'
        open={Editopen}
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Edit Announcement
          </Typography>
          <DialogCloseButton onClick={handleEditClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>

          {/* title */}
          <div className='m-4'>
            <Box component='form' noValidate autoComplete='off' className='flex gap-6 flex-wrap'>
              <CustomTextField
                label='Title'
                name='title'
                value={EditData.title}
                error={!!formErrors.title}
                helperText={formErrors.title}
                className='w-full'
                onChange={getedit}
                id='controlled-text-field'
              />
            </Box>
          </div>

          {/* Rest of the form elements */}
          {/* message */}

          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <TextField
                name='message'
                value={EditData.message}
                label='Message'
                onChange={getedit}
                fullWidth
                multiline
                rows={4} // Increase this for more height
                variant='outlined'
                error={!!formErrors.message}
                helperText={formErrors.message}

              />
            </div>
          </div>



          <div className='m-2 mx-4'>
            <Grid item xs={12} lg={6}>

              <AppReactDatepicker
                selected={EditData.expiryDatetime ? new Date(EditData.expiryDatetime) : null}
                id='basic-input'
                onChange={date => setEditData(prev => ({ ...prev, expiryDatetime: date }))}
                placeholderText='Click to select a date'
                dateFormat='dd-MM-yyyy'
                customInput={
                  <CustomTextField
                    label='Expiry Date'
                    fullWidth
                    error={!!formErrors.expiryDatetime}
                    helperText={formErrors.expiryDatetime}
                  />
                }
                minDate={new Date()}
              />

            </Grid>
          </div>

          <div className='flex flex-row'>
            {/* branch */}

            <div className='m-4'>

              <CustomTextField
                className='my-2 w-52'
                select
                name='branch'
                label='Branch'
                id='controlled-select'
                value={EditData.branch?._id || EditData.branch || ''}
                onChange={e => setEditData({ ...EditData, branch: e.target.value })}
                error={!!formErrors.branch}
                helperText={formErrors.branch}
              >
                {[...new Map(branch.map(item => [item.name, item])).values()]
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
              </CustomTextField>


            </div>

            {/* department */}

            <div className='m-4'>
              <CustomTextField
                className='my-2 w-52'
                select
                name='department'
                label='Department'
                id='controlled-select'
                value={EditData.department?._id || EditData.department || ''}
                onChange={e => setEditData({ ...EditData, department: e.target.value })}
                error={!!formErrors.department}
                helperText={formErrors.department}
              >
                {[...new Map(department.map(item => [item.name, item])).values()]
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.name}
                    </MenuItem>
                  ))}
              </CustomTextField>

            </div>
          </div>

          {/* designation */}
          <div className='mx-4'>
            <CustomTextField
              fullWidth
              select
              multiple
              name='designation'
              label='Designation'
              id='controlled-multiselect'
              value={
                Array.isArray(EditData?.designation)
                  ? EditData.designation.map(d => typeof d === 'object' ? d._id : d)
                  : []
              }
              onChange={e => {
                const selected = e.target.value; // Array of IDs
                setEditData({ ...EditData, designation: selected });
              }}
              error={!!formErrors.designation}
              helperText={formErrors.designation}
              SelectProps={{
                multiple: true,
                renderValue: selected => {
                  const selectedNames = designation
                    .filter(d => selected.includes(d._id))
                    .map(d => d.name)
                    .join(', ');
                  return selectedNames;
                }
              }}
            >
              {[...new Map(designation.map(item => [item.name, item])).values()]
                .filter(type => type.status === 'ACTIVE')
                .map(type => (
                  <MenuItem key={type._id} value={type._id}>
                    {type.name}
                  </MenuItem>
                ))}
            </CustomTextField>
          </div>




          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              value={EditData.status || ''}
              name='status'
              label='Status'
              id='controlled-select'

              slotProps={{
                select: {
                  onChange: getedit
                }
              }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>

          {/* designation */}

        </DialogContent>
        <DialogActions>
          {hasPermission('announce:edit') &&
            <Button
              onClick={() => {
                updatereq(EditData.id)

              }}
              variant='contained'
            >
              Update
            </Button>
          }
          <Button onClick={handleEditClose} variant='tonal' color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* edit modal over */}




      {/* Header */}

      <div className='flex justify-between mb-4 '>
        <div className='flex gap-4'>
          <Grid size={{ xs: 12, md: 2 }}>
            <CustomTextField
              id='form-props-search'
              onChange={handleSearch}
              name='searchvalue'
              placeholder='Search by Title, Message, or Status'
              label='Search field'
              type='search'
              value={searchValue}
            />
          </Grid>
        </div>



        <div className='flex justify-end items-center mb-2'>
          <div>


            <FormControl size='small' className='w-18'>
              <InputLabel id="items-per-page-label">Rows</InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                label="Rows"
                onChange={handleItemsPerPageChange}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className='mx-2'>

            {hasPermission('announce:add') && (

              <Button
                variant='contained'
                className='max-sm:is-full is-auto'
                onClick={handleClickOpen}
                startIcon={<i className='tabler-plus' />}
              >
                Add Announcement
              </Button>
            )}

          </div>
        </div>
      </div>
      {/* table */}



      <AnnouncementTable
        currentItems={currentItems}
        GetData={GetData}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage} // <-- NEW
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleShowOpen={handleShowOpen}
        handleEditOpen={handleEditOpen}
        editid={editid}
        deleteAnnounce={deleteAnnounce}
        statusStyles={statusStyles}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />


    </div>

  )
}
