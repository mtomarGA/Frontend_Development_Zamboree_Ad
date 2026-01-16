'use client'

import { React, use, useEffect, useState } from 'react'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import {
  TableRow,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableSortLabel,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  TextField,
  Chip,
  Pagination,
  Avatar,
  Select,
  CircularProgress,
  FormHelperText
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import { Square, CheckSquare, Eye, Pencil, Trash2 } from 'lucide-react'
import Grid from '@mui/material/Grid2'
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import voucherRoute from '@/services/utsav/voucher'
import { toast } from 'react-toastify'
import Tab2 from './Tab2'
import PaginationRounded from './pagination'
import billRoute from '@/services/utsav/billing'
import Tab3 from './Tab3'
import categoryRoute from '@/services/utsav/category'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
// import Button from '@mui/material'



const statusStyles = {
  ACTIVE: 'success',
  INACTIVE: 'error'
}

function Tabtable({ handleClickOpen, getVoucherdata, fetchData, SetgetVoucherdata, seticonloading, iconloading }) {

  const { hasPermission } = useAuth();

  const [value, setValue] = useState('1')

  const [formErrors, setFormErrors] = useState({})
  const validateFields = data => {
    let errors = {}

    if (!data.icon) errors.icon = 'Icon is required'
    if (!data.vouchertype) errors.vouchertype = 'voucher Type is required'
    if (!data.status) errors.status = 'Status is required'

    return errors
  }


  // Search and sorting states for vouchers
  const [voucherSearchTerm, setVoucherSearchTerm] = useState('')
  const [voucherSortConfig, setVoucherSortConfig] = useState({
    key: null,
    direction: 'asc'
  })

  // Search and sorting states for billing
  const [billSearchTerm, setBillSearchTerm] = useState('')
  const [billSortConfig, setBillSortConfig] = useState({
    key: null,
    direction: 'asc'
  })

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort voucher data
  const getFilteredAndSortedVoucherData = () => {
    let filteredData = [...getVoucherdata]

    // Apply search filter
    if (voucherSearchTerm) {
      filteredData = filteredData.filter(item =>
        item.vouchertype?.toLowerCase().includes(voucherSearchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(voucherSearchTerm.toLowerCase())
      )
    }

    // Apply sorting
    if (voucherSortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[voucherSortConfig.key]?.toString().toLowerCase() || ''
        const bValue = b[voucherSortConfig.key]?.toString().toLowerCase() || ''

        if (voucherSortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    } else {
      // Default: reverse order (newest first)
      filteredData.reverse()
    }

    return filteredData
  }

  const paginatedVoucherData = getFilteredAndSortedVoucherData()
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle voucher sorting
  const handleVoucherSort = (key) => {
    let direction = 'asc'
    if (voucherSortConfig.key === key && voucherSortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setVoucherSortConfig({ key, direction })
    setCurrentPage(1) // Reset to first page when sorting
  }




  // voucher edit moadal
  const [VocuherEditopen, setvoucherEditOpen] = useState(false)

  const handleVoucherOpen = () => setvoucherEditOpen(true)

  const handleVoucherClose = () => setvoucherEditOpen(false)



  // billmodal
  const [Billopen, setBillOpen] = useState(false)
  const handleBillOpen = () => setBillOpen(true)
  const handleBillClose = () => setBillOpen(false)

  // category modal
  const [Categoryopen, setCategoryOpen] = useState(false)
  const handleCategoryOpen = () => setCategoryOpen(true)
  const handleCategoryClose = () => setCategoryOpen(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }



  //  edit Voucher 

  // const [Editvoucher,setEditVoucher]= useState([]);
  const [Editvoucher, setEditVoucher] = useState({
    vouchertype: '',
    status: '',
    id: '',
    icon: ''
  });



  const onchangeVoucher = (e) => {
    setEditVoucher({ ...Editvoucher, [e.target.name]: e.target.value });
    console.log(Editvoucher);
  }


  // show default Edit data in edit modal
  const editid = async updateid => {
    let result = await voucherRoute.getdatabyid(updateid)
    // console.log(updateid)
    console.log(result.data);
    // setEditVoucher(result.data)
    setEditVoucher({
      vouchertype: result.data.vouchertype,
      icon: result.data.icon,
      status: result.data.status,

      id: result.data._id
    })

  }


  // update

  const updatereq = async id => {
    const errors = validateFields(Editvoucher)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    let response = await voucherRoute.putData(id, Editvoucher)
    fetchData();
    handleVoucherClose();
    toast.success('Voucher Updated')
  };

  // delete voucher

  const deleteid = async id => {
    let response = await voucherRoute.deleteData(id);
    toast.error('Voucher Deleted');
    fetchData();
  }

  // search voucher
  const [searchvoucher, setsearchvoucher] = useState();



  // voucher search onchange
  const voucherSearch = (e) => {
    setsearchvoucher({ ...searchvoucher, [e.target.name]: e.target.value });
    // console.log(searchvoucher);
    // GetSearchVoucher();
  }


  const GetSearchVoucher = async () => {
    const searchValue = searchvoucher?.vouchervalue?.trim();

    try {
      let res;

      if (searchValue) {
        // Search mode
        res = await voucherRoute.getsearch(searchvoucher);
      } else {
        // Reset to full list when input is cleared
        res = await voucherRoute.getVoucher();
      }

      SetgetVoucherdata(res.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    GetSearchVoucher();
  }, [searchvoucher]);


  // Tab2
  //bill onchnge

  const [getbill, setgetbill] = useState([]);

  const [formErrors1, setFormErrors1] = useState({})
  const validateFields1 = data => {
    let errors = {}

    if (!data.billingtype) errors.billingtype = 'Billing Type is required'
    if (!data.status) errors.status = 'Status is required'

    return errors
  }



  const [Billdata, setBilldata] = useState({ status: 'INACTIVE' })
  const OnchangeBill = e => {
    setBilldata({ ...Billdata, [e.target.name]: e.target.value })
    // console.log(Billdata);
  }

  // Filter and sort bill data
  const getFilteredAndSortedBillData = () => {
    let filteredData = [...getbill]

    // Apply search filter
    if (billSearchTerm) {
      filteredData = filteredData.filter(item =>
        item.billingtype?.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(billSearchTerm.toLowerCase())
      )
    }

    // Apply sorting
    if (billSortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[billSortConfig.key]?.toString().toLowerCase() || ''
        const bValue = b[billSortConfig.key]?.toString().toLowerCase() || ''

        if (billSortConfig.direction === 'asc') {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    } else {
      // Default: reverse order (newest first)
      filteredData.reverse()
    }

    return filteredData
  }

  // Handle bill sorting
  const handleBillSort = (key) => {
    let direction = 'asc'
    if (billSortConfig.key === key && billSortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setBillSortConfig({ key, direction })
  }



  // submitbill
  const SubmitBill = async () => {
    const errors = validateFields1(Billdata);
    if (Object.keys(errors).length > 0) {
      setFormErrors1(errors);
      return;
    }

    setFormErrors1({});

    try {
      const response = await billRoute.PostBilling(Billdata);
      console.log(response);

      if (response?.statusCode === 400) {
        toast.error(response.message || "Failed to add bill type");
        return;
      }

      toast.success("Bill Type Added");
      handleBillClose();
      fetchbill();
      setBilldata({});
    } catch (error) {
      // console.error("Billing submission error:", error);
      toast.error("Something went wrong while adding the bill type");
    }
  };



  // fetch bill
  const fetchbill = async () => {
    let response = await billRoute.getbill()
    // console.log(response.data)
    setgetbill(response.data)
  }

  useEffect(() => {

    fetchbill();
  }, []);



  // bill search

  // search voucher
  const [searchbill, setsearchbill] = useState();

  // // voucher search onchange
  // const billSearch = (e) => {
  //   setsearchbill({ ...searchbill, [e.target.name]: e.target.value });
  //   console.log(searchbill);
  //   // GetSearchbill();
  // }



  // Tab 3


  // category onchange


  const [Category, setCategory] = useState({ categoryname: "", status: "" });
  const [image, setImage] = useState({
    webthumbnail: null,
    mobthumbnail: null,
    icon: null
  });



  const OnchangeCategory = (e) => {
    setCategory({ ...Category, [e.target.name]: e.target.value });
  };

  const [isloading, setIsloading] = useState({
    webthumbnail: false,
    mobthumbnail: false,
    icon: false
  })

  // onchange image
  // image upload handler
  const onchangeimage = async (e) => {
    const { name, files } = e.target;
    if (name === 'webthumbnail' || name === 'mobthumbnail') {
      setIsloading(prev => ({
        ...prev,
        [name]: true
      }))
    } else if (name === 'icon') {
      seticonloading(true)
    }

    const image = {
      image: e.target.files[0]
    }
    const result = await Image.uploadImage(image)
    // console.log(result)
    if (result.data.url) {
      if (name === 'webthumbnail' || name === 'mobthumbnail') {

        setImage(prev => ({
          ...prev,
          [name]: result.data.url,
        }));
        setIsloading(prev => ({
          ...prev,
          [name]: false
        }))
        // Clear error when file is selected
        if (formErrors[name]) {
          setFormErrors2(prev => ({ ...prev, [name]: '' }))
        }
      }
      else {
        setEditVoucher({ ...Editvoucher, [name]: result.data.url });
        seticonloading(false)
        // Clear error when file is selected
        if (formErrors[name]) {
          setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
      }
    }
  };


  // getcategory

  const [categorydata, setcategorydata] = useState([]);
  const getcategorydata = async () => {
    const response = await categoryRoute.getcategory();
    // console.log(response.data);
    setcategorydata(response.data);

  }


  useEffect(() => { getcategorydata() }, []);

  // form error
  const [formErrors2, setFormErrors2] = useState({})
  const validateFields2 = data => {
    let errors = {}

    if (!data.categoryname) errors.categoryname = 'Category name is required'
    if (!data.status) errors.status = 'Status is required'

    return errors
  }



  // addcategory

  const addcategory = async () => {
    const { categoryname, status } = Category;

    // console.log("Webthumbnail:", image.webthumbnail);
    // console.log("Mobthumbnail:", image.mobthumbnail);

    const errors = validateFields2(Category);
    if (Object.keys(errors).length > 0) {
      setFormErrors2(errors);
      return;
    }

    const formData = new FormData();
    formData.append("categoryname", categoryname);
    formData.append("status", status);

    if (image?.webthumbnail) {
      formData.append("webthumbnail", image.webthumbnail);
    }

    if (image?.mobthumbnail) {
      formData.append("mobthumbnail", image.mobthumbnail);
    }
    if (image?.icon) {
      formData.append("icon", image.icon);
    }

    setFormErrors2({});
    const response = await categoryRoute.PostCategory(formData);
    console.log(response);
    handleCategoryClose();
    getcategorydata();
    toast.success("Category Added");
    setCategory({});
    setImage({ webthumbnail: null, mobthumbnail: null });
  };


  const [currentPageCategory, setCurrentPageCategory] = useState(1);
  const [itemsPerPageCategory, setItemsPerPageCategory] = useState(5);



  useEffect(() => {
    if (Categoryopen) {
      setCategory([]);
      setImage({ webthumbnail: null, mobthumbnail: null });
    }
  }, [Categoryopen]);



  return (
    <>
      <Dialog
        onClose={handleVoucherOpen}
        aria-labelledby='customized-dialog-title'
        open={VocuherEditopen}
        fullWidth
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Edit Voucher Type
          </Typography>
          <DialogCloseButton onClick={handleVoucherClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>

          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <TextField
                name='vouchertype'
                label='Voucher Type'
                value={Editvoucher.vouchertype}
                onChange={onchangeVoucher}
                fullWidth
                // multiline
                rows={1} // Increase this for more height
                variant='outlined'
                error={!!formErrors.vouchertype}
                helperText={formErrors.vouchertype}

              />
            </div>
          </div>



          <div className='flex flex-col m-2'>
            <label htmlFor='icon' className='mx-2'>Icon</label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input type='file' name='icon' hidden onChange={onchangeimage} id='icon' accept='image/*' />
              </Button>
              {iconloading ? (
                <CircularProgress size={20} />
              ) : (
                <Avatar src={Editvoucher.icon} />
              )}
              <Typography variant="body2" className="mt-1 text-green-600 truncate inline-block w-96">
                {Editvoucher.icon ? Editvoucher.icon : "No file selected"}
              </Typography>

              {formErrors.icon && <FormHelperText error>{formErrors.icon}</FormHelperText>}

            </div>
          </div>


          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              value={Editvoucher.status}
              error={!!formErrors.status}
              helperText={formErrors.status}
              name='status'
              label='Status'
              id='controlled-select'
              slotProps={{
                select: {
                  onChange: onchangeVoucher
                }
              }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>



        </DialogContent>
        <DialogActions>
          <Button onClick={(() => {
            updatereq(Editvoucher.id)
          })} variant='contained'>
            Update
          </Button>
          <Button onClick={handleVoucherClose} variant='tonal' color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* bill modal */}
      <Dialog
        onClose={handleBillClose}
        aria-labelledby='customized-dialog-title'
        open={Billopen}
        fullWidth
        closeAfterTransition={false}
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Billing Type
          </Typography>
          <DialogCloseButton onClick={handleBillClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>



          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <CustomTextField
                name='billingtype'
                label='Billing Type'
                onChange={OnchangeBill}
                value={Billdata.billingtype || ''}
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
              value={Billdata.status || ''}
              onChange={OnchangeBill}
              error={!!formErrors1.status}
              helperText={formErrors1.status}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>

          <DialogActions>

            {hasPermission("utsav_master:add") && (<Button onClick={() => SubmitBill()} variant='contained'>
              Add Billing Type
            </Button>)}

            <Button onClick={handleBillClose} variant='tonal' color='secondary'>
              Close
            </Button>
          </DialogActions>
        </DialogContent>




      </Dialog>

      {/* categoryModal */}
      <Dialog
        onClose={handleCategoryClose}
        aria-labelledby='customized-dialog-title'
        open={Categoryopen}
        closeAfterTransition={false}
        fullWidth
        PaperProps={{ sx: { overflow: 'visible' } }}
      >
        <DialogTitle id='customized-dialog-title'>
          <Typography variant='h5' component='span'>
            Coupon Category
          </Typography>
          <DialogCloseButton onClick={handleCategoryClose} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
        </DialogTitle>
        <DialogContent>

          <div className='flex flex-col m-2'>
            <div className='m-2'>
              <TextField
                name='categoryname'
                label='Category Name'
                onChange={OnchangeCategory}
                fullWidth
                value={Category.categoryname || ''}
                // multiline
                rows={1} // Increase this for more height
                variant='outlined'
                error={!!formErrors2.categoryname}
                helperText={formErrors2.categoryname}
              />
            </div>
          </div>

          {/* Web thumbnail section */}
          <div className='flex flex-col m-2'>
            <label htmlFor='webimage' className='mx-2'>
              Web Thumbnail Image
            </label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input
                  type='file'
                  name='webthumbnail'
                  hidden
                  onChange={onchangeimage}
                  id='webimage'
                />
              </Button>
              {isloading.webthumbnail && (
                <CircularProgress className='m-2' size={20} />
              )}
              {/* ✅ Show selected file name */}
              {image.webthumbnail && (
                <Typography variant='body2' className='mt-2 text-green-700'>
                  Selected: <Avatar src={image?.webthumbnail} />
                </Typography>
              )}
            </div>
          </div>

          {/* Mobile thumbnail section */}
          <div className='flex flex-col m-2'>
            <label htmlFor='mobimage' className='mx-2'>
              Mobile Thumbnail Image
            </label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input
                  type='file'
                  name='mobthumbnail'
                  hidden
                  onChange={onchangeimage}
                  id='mobimage'
                />
              </Button>
              {isloading.mobthumbnail && (
                <CircularProgress className='m-2' size={20} />
              )}
              {/* ✅ Show selected file name */}
              {image.mobthumbnail && (
                <Typography variant='body2' className='mt-2 text-green-700'>
                  Selected: <Avatar src={image?.mobthumbnail} />
                </Typography>
              )}
            </div>
          </div>

          <div className='flex flex-col m-2'>
            <label htmlFor='icon' className='mx-2'>
              icon
            </label>
            <div className='m-2'>
              <Button variant='outlined' component='label' fullWidth>
                Upload File
                <input
                  type='file'
                  name='icon'
                  hidden
                  onChange={onchangeimage}
                  id='icon'
                />
              </Button>
              {isloading.icon && (
                <CircularProgress className='m-2' size={20} />
              )}
              {/* ✅ Show selected file name */}
              {image.icon && (
                <Typography variant='body2' className='mt-2 text-green-700'>
                  Selected: <Avatar src={image?.icon} />
                </Typography>
              )}
            </div>
          </div>


          <div className='m-4'>
            <CustomTextField
              className='my-2'
              select
              fullWidth
              name='status'
              label='Status'
              id='controlled-select'
              value={Category.status || ''}
              error={!!formErrors2.status}
              helperText={formErrors2.status}
              slotProps={{
                select: {
                  onChange: OnchangeCategory
                }
              }}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </div>

        </DialogContent>
        <DialogActions>

          {hasPermission("utsav_master:add") &&
            (image.webthumbnail || image.mobthumbnail) ?
            <Button onClick={addcategory} variant='contained'>
              Add Category
            </Button> :
            <Button onClick={undefined} variant='contained' disabled>
              Add Category
            </Button>

          }

          <Button onClick={handleCategoryClose} variant='tonal' color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* Tab1 */}
      <div className='m-auto shadow'>
        <TabContext value={value}>
          <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
            <Tab value='1' label='Coupon Type' />
            <Tab value='2' label='Billing Type' />
            <Tab value='3' label='Coupon Category' />
          </TabList>

          <TabPanel value='1'>
            {/* search */}
            <div className='flex justify-between mb-4 mx-4 '>
              <div className='flex gap-4'>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    id='voucher-search'
                    value={voucherSearchTerm}
                    onChange={(e) => {
                      setVoucherSearchTerm(e.target.value)
                      setCurrentPage(1) // Reset to first page when searching
                    }}
                    label='Search Coupon Type or Status'
                    type='search'
                    fullWidth
                    placeholder='Type to search...'
                  />
                </Grid>
              </div>

              <div className='flex justify-end m-4 '>
                <div className='mx-2'>
                  {hasPermission("utsav_master:add") &&
                    <Button
                      variant='contained'
                      className='max-sm:is-full is-auto'
                      onClick={handleClickOpen}
                      startIcon={<i className='tabler-plus' />}
                    >
                      Add Coupon Type
                    </Button>
                  }
                </div>
              </div>
            </div>

            <TableContainer className='p-4'>
              <Table className={tableStyles.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className='p-2'>
                      <TableSortLabel
                        active={voucherSortConfig.key === 'vouchertype'}
                        direction={voucherSortConfig.key === 'vouchertype' ? voucherSortConfig.direction : 'asc'}
                        onClick={() => handleVoucherSort('vouchertype')}
                      >
                        Coupon Type
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='p-2'>
                      <TableSortLabel
                        active={voucherSortConfig.key === 'icon'}
                        direction={voucherSortConfig.key === 'icon' ? voucherSortConfig.direction : 'asc'}
                        onClick={() => handleVoucherSort('vouchertype')}
                      >
                        Icon
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='p-2'>
                      <TableSortLabel
                        active={voucherSortConfig.key === 'status'}
                        direction={voucherSortConfig.key === 'status' ? voucherSortConfig.direction : 'asc'}
                        onClick={() => handleVoucherSort('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className='p-2'>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedVoucherData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className='text-center p-4'>
                        <Typography variant='body2' color='textSecondary'>
                          {voucherSearchTerm ? 'No results found for your search.' : 'No data available.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedVoucherData.map((item, index) => (
                      <TableRow key={index} className='border-b'>
                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                          <div className='font-medium'>{item.vouchertype}</div>
                        </TableCell>
                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                          <Avatar src={item.icon} />
                        </TableCell>

                        <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap '>
                          <Chip label={item.status} color={statusStyles[item.status]} variant='tonal' />
                        </TableCell>

                        <TableCell className='px-4 py-2 flex items-center gap-3'>
                          {hasPermission("utsav_master:edit") &&
                            <Pencil
                              className='text-blue-500 size-5 cursor-pointer hover:scale-110 transition'
                              onClick={() => { editid(item._id); handleVoucherOpen() }}
                            />
                          }
                          {hasPermission("utsav_master:delete") &&
                            <Trash2
                              className='text-red-500 size-5 cursor-pointer hover:scale-110 transition'
                              onClick={() => { deleteid(item._id) }}
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
                Showing {paginatedVoucherData.length} of {getFilteredAndSortedVoucherData().length} results
              </Typography>
              <PaginationRounded
                count={Math.ceil(getFilteredAndSortedVoucherData().length / itemsPerPage)}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
              />
            </div>
          </TabPanel>



          {/* billing tab */}
          <TabPanel value='2'>
            <div className='flex justify-between mb-4 mx-4 '>

              <div className='flex gap-4'>
                <Grid size={{ xs: 12, md: 4 }}>
                  <CustomTextField
                    id='bill-search'
                    value={billSearchTerm}
                    onChange={(e) => setBillSearchTerm(e.target.value)}
                    label='Search Billing Type or Status'
                    type='search'
                    fullWidth
                    placeholder='Type to search...'
                  />
                </Grid>
              </div>


              <div className='flex justify-end m-4 '>
                <div className='mx-2'>
                  {hasPermission("utsav_master:add") &&
                    <Button
                      variant='contained'
                      className='max-sm:is-full is-auto'
                      onClick={handleBillOpen}
                      startIcon={<i className='tabler-plus' />}
                    >
                      Add Billing Type
                    </Button>
                  }
                </div>
              </div>
            </div>



            <Tab2 getbill={getbill} statusStyles={statusStyles} billSortConfig={billSortConfig} handleBillSort={handleBillSort} billSearchTerm={billSearchTerm} getFilteredAndSortedBillData={getFilteredAndSortedBillData} fetchbill={fetchbill} />

          </TabPanel>

          {/* category tab */}
          <TabPanel value='3'>
            <div className='flex justify-between mb-4 mx-4 '>
              <div></div>

              <div className='flex justify-end m-2 '>


                {/* Rows per page */}
                <div className="flex items-center justify-between">
                  <div>
                    <span>Rows per page: </span>
                    <Select
                      className='mx-2'
                      value={itemsPerPageCategory}
                      onChange={(e) => { setItemsPerPageCategory(parseInt(e.target.value)); setCurrentPageCategory(1); }}
                      size="small"
                    >
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={25}>25</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                    </Select>
                  </div>

                  <div>
                    {hasPermission("utsav_master:add") &&
                      <Button
                        variant='contained'
                        className='max-sm:is-full is-auto'
                        onClick={handleCategoryOpen}
                        startIcon={<i className='tabler-plus' />}
                      >
                        Add Coupon Category
                      </Button>
                    }
                  </div>
                </div>


              </div>
            </div>


            <Tab3 categorydata={categorydata} getcategorydata={getcategorydata} statusStyles={statusStyles} itemsPerPage={itemsPerPageCategory} currentPage={currentPageCategory} setCurrentPage={setCurrentPageCategory} setItemsPerPage={setItemsPerPageCategory} />

          </TabPanel>
        </TabContext>
      </div>
    </>
  )
}

export default Tabtable
