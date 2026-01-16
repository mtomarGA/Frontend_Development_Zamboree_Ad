'use client'
// React Imports
import { useEffect, useState } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { startOfToday } from 'date-fns'

// MUI Imports
import Button from '@mui/material/Button'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { Autocomplete, Avatar, Card, Checkbox, CircularProgress, createFilterOptions, FormControl, FormGroup, FormLabel, InputAdornment, MenuItem, TextField, Typography } from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import Grid from '@mui/material/Grid'
import { IconButton, Box } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import voucherRoute from '@/services/utsav/voucher'
import categoryRoute from '@/services/utsav/category'
import CouponRoute from '@/services/utsav/managecoupon/manage'


// Third-party imports


import { toast } from 'react-toastify'
import { redirect } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ImageService from '@/services/imageService'

const AddcouponModal = () => {
  const { hasPermission } = useAuth();
  // const [number, setnumber] = useState({});
  const [BusinessData, setBusinessData] = useState([]);
  const [voucherTypes, setVoucherTypes] = useState([])
  const [categoryTypes, setcategoryTypes] = useState([])
  const [addcoupondata, setaddcoupondata] = useState({
    BusinessId: '',
    vouchertype: '',
    description: [
      { title: '', desc: [''] }
    ],
    images: [],
    category: '',
    status: "PENDING",
    // discountType: '',
    // fixedvalue: '',
    // percentage: '',
    how_to_redeem: [],
    country: '',
    state: '',
    city: '',
    area: '',
  })
  const [fields, setFields] = useState([''])
  const [termsfields, settermFields] = useState([''])

  // handle fields
  const handleAddField = () => {
    setFields([...fields, ''])
  }

  const handleRemoveField = index => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }

  const handleChange = (index, event) => {
    const newFields = [...fields]
    newFields[index] = event.target.value
    setFields(newFields)
    setaddcoupondata(prev => ({
      ...prev,
      how_to_redeem: newFields
    }))
  }

  // handle fields
  const handleTermAddField = () => {
    settermFields([...termsfields, ''])
  }

  const handleTermsRemoveField = index => {
    const newFields = [...termsfields]
    console.log(index, "indx")
    // newFields.pop(index)
    newFields.splice(index, 1)
    settermFields(newFields)
  }

  const handleTermChange = (index, event) => {
    const newFields = [...termsfields]
    newFields[index] = event.target.value
    settermFields(newFields)
    setaddcoupondata(prev => ({
      ...prev,
      terms: newFields
    }))
  }

  // description 
  // 🟢 Handle Title Change
  const handleDescriptionTitleChange = (blockIndex, e) => {
    const updated = [...addcoupondata.description]
    updated[blockIndex].title = e.target.value
    setaddcoupondata(prev => ({ ...prev, description: updated }))
  }

  // 🔵 Handle Desc Line Change
  const handleDescriptionDescChange = (blockIndex, descIndex, e) => {
    const updated = [...addcoupondata.description]
    updated[blockIndex].desc[descIndex] = e.target.value
    setaddcoupondata(prev => ({ ...prev, description: updated }))
  }

  // ➕ Add New Desc Line
  const handleAddDescLine = (blockIndex) => {
    const updated = [...addcoupondata.description]
    updated[blockIndex].desc.push('')
    setaddcoupondata(prev => ({ ...prev, description: updated }))
  }

  // ❌ Remove Desc Line
  const handleRemoveDescLine = (blockIndex, descIndex) => {
    const updated = [...addcoupondata.description]
    updated[blockIndex].desc.splice(descIndex, 1)
    setaddcoupondata(prev => ({ ...prev, description: updated }))
  }

  // ➕ Add Entire Description Block
  const handleAddDescriptionBlock = () => {
    setaddcoupondata(prev => ({
      ...prev,
      description: [...prev.description, { title: '', desc: [''] }]
    }))
  }

  // ❌ Remove Entire Description Block
  const handleRemoveDescriptionBlock = (blockIndex) => {
    const updated = [...addcoupondata.description]
    updated.splice(blockIndex, 1)
    setaddcoupondata(prev => ({ ...prev, description: updated }))
  }









  // discount
  const [discountType, setDiscountType] = useState('')
  const [date, setDate] = useState(new Date())

  // onchange
  const onAddcoupon = e => {
    const { name, value } = e.target
    setaddcoupondata(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // fetch voucher
  const fetchData = async () => {
    try {
      let response = await voucherRoute.getVoucher()
      setVoucherTypes(response.data || [])
    } catch (error) {
      console.error("Error fetching voucher types:", error)
      setVoucherTypes([])
    }
  }

  // fetch category
  const getcategorydata = async () => {
    try {
      const response = await categoryRoute.getcategory()
      setcategoryTypes(response.data || [])
    } catch (error) {
      console.error("Error fetching categories:", error)
      setcategoryTypes([])
    }
  }



  useEffect(() => {
    fetchData()
    getcategorydata()
  }, [])



  // form validation
  const [formErrors, setFormErrors] = useState({})
  const validateFields = data => {
    let errors = {}

    // if (data.discountType === 'fixed' && !data.fixedvalue) {
    //   errors.fixedvalue = 'Fixed value is required'
    // } else if (data.discountType === 'percentage' && !data.percentage) {
    //   errors.percentage = 'Percentage is required'
    // }

    if (!data.vouchertype) errors.vouchertype = 'Voucher Type is required'
    if (!data.status) errors.status = 'Status is required'
    if (!data.description) errors.description = 'Deal Description is required'
    if (!data.title) errors.title = 'Title is required'
    // if (!data.category) errors.category = 'Category is required'
    if (!data.expiryDate) errors.expiryDate = 'Expiry Date is required'
    if (!data.redeemdays) errors.redeemdays = 'Redeem Days is required'
    if (!data.totaluserAvail) errors.totaluserAvail = 'Total Number of users who can avail this coupon is required'
    if (!data.user_assigned) errors.user_assigned = 'How many coupons per user is required'
    // if (!data.redeem_on_single_bill) errors.redeem_on_single_bill = 'Voucher redeem on single bill is required'
    if (!data.how_to_redeem[0]) errors.how_to_redeem = 'How to redeem is required'
    if (!data.subtitle) errors.subtitle = 'Subtitle is required'
    if (!data.images || data.images.length === 0) {
      errors.images = 'At least one image is required'
    }
    if (!data.terms) errors.terms = 'Terms & Conditions are required'
    if (isNaN(data.original_price) || data.original_price === '') {
      errors.original_price = 'Actual Price of Voucher is required and must be a number'

    }

    return errors
  }

  // add coupon
  const SubmitCoupon = async () => {
    const errors = validateFields(addcoupondata)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fill all required fields correctly')
      return
    }

    try {
      const response = await CouponRoute.PostCoupon(addcoupondata)
      if (response.success) {
        toast.success('Coupon Added Successfully')
        // Use window.location or Next.js router for navigation
        window.location.href = '/en/apps/utsav/managecoupon'
      } else {
        toast.error(response.message || 'Failed to add coupon')
      }
    } catch (error) {
      console.error('Error adding coupon:', error)
      toast.error(error.response?.data?.message || 'Error adding coupon')
    }
  }

  // img
  const [imageloading, setImageLoading] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageLoading(true);

    try {
      const uploadPromises = files.map(file => ImageService.uploadImage({ image: file }));
      const results = await Promise.all(uploadPromises);
      const uploadedUrls = results.map(result => result.data.url).filter(url => url);

      if (uploadedUrls.length > 0) {
        setaddcoupondata(prev => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls]
        }));

        if (formErrors.images) {
          setFormErrors(prev => ({ ...prev, images: '' }));
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setaddcoupondata(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  // search
  const [SearchData, setSearchData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleSearch = async (searchValue) => {
    if (searchValue?.length >= 3) {
      try {
        const response = await CouponRoute.getSearchBusiness({ search: searchValue })
        setSearchData(response.data || [])
      } catch (error) {
        setSearchData([])
      }
    } else {
      setSearchData([])
    }
  }

  useEffect(() => {
    if (inputValue.length >= 3) {
      handleSearch(inputValue)
    }
  }, [inputValue])

  const filter = createFilterOptions()
  console.log(addcoupondata);


  return (
    <div className='overflow-auto'>
      {/* coupon details */}
      <div className='text-center'>
        <h3>Add Utsav</h3>
      </div>

      <div className="m-2 p-6 shadow  w-full">
        {/* Top row: Search & Info */}
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          {/* Left form */}
          <div className="flex-1 space-y-4">
            {/* Search Field */}
            <div>
              <Autocomplete
                className="w-full"
                freeSolo
                options={SearchData}
                filterOptions={(options, state) => {
                  const input = state.inputValue.toLowerCase()
                  return options.filter(option => {
                    const companyName = option.companyInfo?.companyName?.toLowerCase() || ''
                    const vendorId = option.vendorId?.toLowerCase() || ''
                    const phoneNo = option.contactInfo?.phoneNo?.toLowerCase() || ''
                    return (
                      companyName.includes(input) ||
                      vendorId.includes(input) ||
                      phoneNo.includes(input)
                    )
                  })
                }}
                getOptionLabel={option =>
                  option.companyInfo?.companyName ||
                  option.vendorId ||
                  option.contactInfo?.phoneNo ||
                  ''
                }
                onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                onChange={(event, newValue) => {
                  if (newValue && newValue._id) {
                    setaddcoupondata(prev => ({
                      ...prev,
                      BusinessId: newValue._id,
                      BusinessName: newValue.companyInfo?.companyName
                    }))
                    setBusinessData(newValue)
                    setFormErrors(prev => ({ ...prev, BusinessId: '' }))
                  }
                }}
                renderInput={params => (
                  <CustomTextField
                    {...params}
                    label="Search By Name, Mobile Number or ID"
                    variant="outlined"
                    placeholder="Type at least 3 characters"
                    error={!!formErrors.BusinessId}
                    helperText={formErrors.BusinessId}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.companyInfo?.companyName} - {option.vendorId} - {option.contactInfo?.phoneNo}
                  </li>
                )}
                noOptionsText={
                  inputValue.length < 3
                    ? 'Type at least 3 characters to search'
                    : 'No businesses found'
                }
              />
            </div>

            {/* Grid of input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Voucher Type */}
              <CustomTextField
                select
                name="vouchertype"
                label="Voucher Type"
                value={addcoupondata.vouchertype || ''}
                onChange={e => setaddcoupondata({ ...addcoupondata, vouchertype: e.target.value })}
                error={!!formErrors.vouchertype}
                helperText={formErrors.vouchertype}
              >
                <MenuItem value="" disabled>Select Voucher Type</MenuItem>
                {voucherTypes
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.vouchertype}
                    </MenuItem>
                  ))}
              </CustomTextField>

              {/* Category */}
              {/* <CustomTextField
                select
                name="category"
                label="Utsav Category"
                value={addcoupondata.category || ''}
                onChange={e => setaddcoupondata({ ...addcoupondata, category: e.target.value })}
                error={!!formErrors.category}
                helperText={formErrors.category}
              >
                <MenuItem value="" disabled>Select Category</MenuItem>
                {categoryTypes
                  .filter(type => type.status === 'ACTIVE')
                  .map(type => (
                    <MenuItem key={type._id} value={type._id}>
                      {type.categoryname}
                    </MenuItem>
                  ))}
              </CustomTextField> */}

              {/* Voucher Name */}
              <CustomTextField
                name="title"
                label="Utsav Voucher Name"
                onChange={onAddcoupon}
                value={addcoupondata.title || ''}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />

              {/* Subtitle */}
              <CustomTextField
                name="subtitle"
                label="Utsav Voucher Subtitle"
                onChange={onAddcoupon}
                value={addcoupondata.subtitle || ''}
                error={!!formErrors.subtitle}
                helperText={formErrors.subtitle}
              />

              {/* Actual Price */}
              <CustomTextField
                name="original_price"
                label="Actual Price of Voucher"
                onChange={onAddcoupon}
                value={addcoupondata.original_price || ''}
                error={!!formErrors.original_price}
                helperText={formErrors.original_price}
              />
            </div>
          </div>

          {/* Right side Display Info */}
          <div className="w-full lg:w-[30%]">
            <h4 className="text-center mt-2 font-semibold">Display Info</h4>
            <div className="border-2 rounded shadow border-gray-600 p-4 space-y-1 text-sm">
              <div><strong>Parent ID:</strong> {BusinessData?.vendorId || 'N/A'}</div>
              <div><strong>Business Name:</strong> {BusinessData?.companyInfo?.companyName || 'N/A'}</div>
              <div><strong>Country:</strong> {BusinessData?.locationInfo?.country || 'N/A'}</div>
              <div><strong>State:</strong> {BusinessData?.locationInfo?.state || 'N/A'}</div>
              <div><strong>City:</strong> {BusinessData?.locationInfo?.city || 'N/A'}</div>
              <div><strong>Area:</strong> {BusinessData?.locationInfo?.area || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* File Uploads Section */}
        <div className="mt-6">
          <label className="font-medium block mb-2">Images</label>
          <div className="border-2 p-3 rounded">
            <div className="flex items-center gap-3 mb-3">
              <input
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {imageloading && <CircularProgress size={24} />}
            </div>
            {formErrors.images && (
              <p className="text-red-500 text-sm mt-1 mb-2">{formErrors.images}</p>
            )}
            {/* Display selected images */}
            {addcoupondata?.images && addcoupondata.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {addcoupondata.images.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <Avatar
                      src={imageUrl}
                      alt={`image-${index}`}
                      sx={{ width: 100, height: 100 }}
                      variant="rounded"
                    />
                    <IconButton
                      onClick={() => handleRemoveImage(index)}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'white',
                        '&:hover': {
                          backgroundColor: 'error.light'
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* description blocks */}

      <div className='my-4 mx-2 flex-col '>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {addcoupondata.description.map((block, blockIndex) => (
            <Card key={blockIndex} variant='outlined' sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                <Typography variant='h6'>
                  Heading  {blockIndex + 1}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveDescriptionBlock(blockIndex)}
                  color='error'
                  disabled={addcoupondata.description.length === 1}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>

              {/* 🟢 Title */}
              <TextField
                fullWidth
                label='Title'
                value={block.title}
                onChange={e => handleDescriptionTitleChange(blockIndex, e)}
                sx={{ mt: 2, mx: 2, padding: 1 }}
                error={!!formErrors?.[`description_${blockIndex}_title`]}
                helperText={formErrors?.[`description_${blockIndex}_title`]}
              />

              {/* 🔵 Desc Lines */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {block.desc.map((line, descIndex) => (
                  <Box key={descIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1, padding: 1, mx: 2 }}>
                    <TextField
                      fullWidth
                      label={`Heading ${descIndex + 1}`}
                      value={line}
                      onChange={e => handleDescriptionDescChange(blockIndex, descIndex, e)}
                      error={!!formErrors?.[`description_${blockIndex}_desc_${descIndex}`]}
                      helperText={formErrors?.[`description_${blockIndex}_desc_${descIndex}`]}
                    />
                    <IconButton
                      onClick={() => handleRemoveDescLine(blockIndex, descIndex)}
                      color='error'
                      disabled={block.desc.length === 1}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Box>
                ))}
                <IconButton
                  onClick={() => handleAddDescLine(blockIndex)}
                  color='primary'
                  sx={{ alignSelf: 'flex-start' }}
                >
                  <Plus size={20} />
                </IconButton>
              </Box>
            </Card>
          ))}

          {/* ➕ Add New Description Block */}
          <Button
            variant='outlined'
            color='primary'
            startIcon={<Plus />}
            onClick={handleAddDescriptionBlock}
            sx={{ alignSelf: 'flex-start' }}
          >
            Add Heading Block
          </Button>
        </Box>
      </div>




      {/* validity */}
      <div className='shadow p-6 m-2'>
        <h2 className='m-4'>Validity</h2>

        <div className='flex flex-wrap justify-between sm:w-[80%]'>
          <div className='m-4'>
            <Grid item xs={12} md={4}>
              <AppReactDatepicker
                selected={date}
                className='w-full sm:w-[50%] lg:w-[50%]'
                id='basic-input'
                name='expiryDate'
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                dateFormat="dd-MM-yyyy"
                onChange={date => {
                  setDate(date)
                  setaddcoupondata(prev => ({
                    ...prev,
                    expiryDate: date
                  }))
                }}
                placeholderText='Click to select a date'
                customInput={<CustomTextField label='Expiry Date' error={!!formErrors.expiryDate}
                  helperText={formErrors.expiryDate} fullWidth />}
              />
            </Grid>
          </div>

          <div className='m-4'>
            <label htmlFor='redeemdays'>Redeem Days</label>
            <FormGroup row>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      size='small'
                      checked={addcoupondata.redeemdays?.includes(day) || false}
                      onChange={e => {
                        const updatedDays = addcoupondata.redeemdays || []
                        const newDays = e.target.checked ? [...updatedDays, day] : updatedDays.filter(d => d !== day)
                        setaddcoupondata({ ...addcoupondata, redeemdays: newDays })
                      }}
                    />
                  }
                  label={day.slice(0, 1).toUpperCase()}
                />
              ))}
            </FormGroup>
          </div>
        </div>

        <h2 className='my-2 mx-4'>Uses Limit</h2>
        <div className='flex flex-col sm:flex-row justify-between'>
          <div className='flex flex-col m-2 sm:w-screen'>
            {/* <div > */}
            <CustomTextField
              name='totaluserAvail'
              value={addcoupondata.totaluserAvail || ''}
              type='number'
              className='w-full sm:w-[50%]'
              label='Total Issue Utsav Voucher'
              onChange={onAddcoupon}
              inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
              error={!!formErrors.totaluserAvail}
              helperText={formErrors.totaluserAvail}
              onKeyDown={e => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault()
                }
              }}
              variant='outlined'
            />
          </div>
          {/* </div> */}

          <div className='flex flex-col mx-2 sm:w-screen'>
            <div className='m-2'>
              <CustomTextField
                name='user_assigned'
                value={addcoupondata.user_assigned || ''}
                type='number'
                className='w-full sm:w-[50%]'
                label='How Many Utsav Voucher Per User Assigned'
                onChange={onAddcoupon}
                inputProps={{ min: 0, inputMode: 'numeric', pattern: '[0-9]*' }}
                error={!!formErrors.user_assigned}
                helperText={formErrors.user_assigned}
                onKeyDown={e => {
                  if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                    e.preventDefault()
                  }
                }}
                variant='outlined'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Redeem */}
      <div className='shadow p-6 m-2'>
        <div>
          <h2 className='m-4'>How To Redeem</h2>
        </div>

        {/* <div className="m-4 w-full sm:w-[48%] lg:w-[32%]">
          <CustomTextField
            select
            fullWidth
            name="redeem_on_single_bill"
            label="Voucher can redeem on single bill"
            value={addcoupondata.redeem_on_single_bill || ''}
            onChange={onAddcoupon}
            error={!!formErrors.redeem_on_single_bill}
            helperText={formErrors.redeem_on_single_bill}
            SelectProps={{
              MenuProps: {
                disablePortal: true,
              },
            }}
          >
            <MenuItem value="" disabled>Select Option</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </CustomTextField>

        </div> */}


        <div className='m-4 flex-col'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((value, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label={`How to Redeem ${index + 1}`}
                  value={value}
                  onChange={e => handleChange(index, e)}
                  error={!!formErrors.how_to_redeem}
                  helperText={formErrors.how_to_redeem}
                />
                <IconButton
                  onClick={() => handleRemoveField(index)}
                  aria-label='delete'
                  color='error'
                  disabled={fields.length === 1}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>
            ))}
            <IconButton onClick={handleAddField} aria-label='add' color='primary' sx={{ alignSelf: 'flex-start' }}>
              <Plus size={20} />
            </IconButton>
          </Box>
        </div>

        <h2 className='m-3'>Terms and Condition</h2>
        <div className='m-4 flex-col'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {termsfields.map((value, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label={`Terms And Conditions ${index + 1}`}
                  value={value}
                  onChange={e => handleTermChange(index, e)}
                  error={!!formErrors.terms}
                  helperText={formErrors.terms}
                />
                <IconButton
                  onClick={() => handleTermsRemoveField(index)}
                  aria-label='delete'
                  color='error'
                  disabled={termsfields.length === 1}
                >
                  <Trash2 size={20} />
                </IconButton>
              </Box>
            ))}
            <IconButton onClick={handleTermAddField} aria-label='add' color='primary' sx={{ alignSelf: 'flex-start' }}>
              <Plus size={20} />
            </IconButton>
          </Box>
        </div>

        {/* <div className='flex flex-col m-2'>
          <div className='m-2'>
            <TextField
              fullWidth
              name='terms'
              value={addcoupondata.terms || ''}
              label='Terms and conditions of this Utsav Voucher'
              onChange={onAddcoupon}
              multiline
              rows={5}
              variant='outlined'
              error={!!formErrors.terms}
              helperText={formErrors.terms}
            />
          </div>
        </div> */}
      </div>

      {/* Discount Information */}

      {/* <div className='shadow p-6 m-2'>
        <div className='m-4'>
          <h2>Discount Information</h2>
        </div>

        <FormControl component='fieldset' fullWidth>
          <RadioGroup
            row
            value={discountType}
            onChange={e => {
              const selectedType = e.target.value
              setDiscountType(selectedType)
              setaddcoupondata(prev => ({
                ...prev,
                discountType: selectedType,
                fixedvalue: selectedType === 'fixed' ? prev.fixedvalue : '',
                percentage: selectedType === 'percentage' ? prev.percentage : ''
              }))
            }}
          >
            <FormControlLabel value='fixed' control={<Radio />} label='Fixed Value Discount' />
            <FormControlLabel value='percentage' control={<Radio />} label='Percentage Discount' />
          </RadioGroup>

          <Grid container spacing={2} mt={1}>
            <Grid item >
              <TextField
                fullWidth
                className='m-2 w-52 '
                type='number'
                label='Enter Fixed Value'
                variant='outlined'
                name='fixedvalue'
                error={!!formErrors.fixedvalue}
                helperText={formErrors.fixedvalue}
                value={addcoupondata.fixedvalue || ''}
                onChange={e =>
                  setaddcoupondata(prev => ({
                    ...prev,
                    fixedvalue: e.target.value
                  }))
                }
                disabled={discountType !== 'fixed'}
                onKeyDown={e => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      ₹&nbsp;
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                className='m-2 w-52'
                type='number'
                label='Enter Percentage'
                variant='outlined'
                name='percentage'
                error={!!formErrors.percentage}
                helperText={formErrors.percentage}
                value={addcoupondata.percentage || ''}
                onChange={e =>
                  setaddcoupondata(prev => ({
                    ...prev,
                    percentage: e.target.value
                  }))
                }
                disabled={discountType !== 'percentage'}
                onKeyDown={e => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault()
                  }
                }}
                inputProps={{ min: 0 }}
                InputProps={{
                  endAdornment: '%'
                }}
              />
            </Grid>
          </Grid>
        </FormControl>
      </div> */}

      {/* location */}
      <div className='shadow p-6 m-2'>
        {/* <div>
          <h2 className='m-4'>Location</h2>
        </div>

        <div className='flex justify-between m-4'>
          <Grid item xs={3}>
            <CustomTextField
              select
              className='w-96'
              label="Country"
              value={addcoupondata.country || ''}
              onChange={e => {
                const selectedCountryId = e.target.value
                setaddcoupondata({ ...addcoupondata, country: selectedCountryId, state: '', city: '', area: '' })
                states(selectedCountryId)
              }}
              error={!!formErrors.country}
              helperText={formErrors.country}
            >
              <MenuItem value="" disabled>Select Country</MenuItem>
              {country.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={3}>
            <CustomTextField
              select
              className='w-96'
              label="State"
              value={addcoupondata.state || ''}
              onChange={e => {
                const selectedStateId = e.target.value
                setaddcoupondata({ ...addcoupondata, state: selectedStateId, city: '', area: '' })
                citys(selectedStateId)
              }}
              error={!!formErrors.state}
              helperText={formErrors.state}
              disabled={!addcoupondata.country}
            >
              <MenuItem value="" disabled>Select State</MenuItem>
              {state.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </div>

        <div className='flex justify-between m-4'>
          <Grid item xs={3}>
            <CustomTextField
              select
              className='w-96'
              label="City"
              value={addcoupondata.city || ''}
              onChange={e => {
                const selectedCityId = e.target.value
                setaddcoupondata({ ...addcoupondata, city: selectedCityId, area: '' })
                area(selectedCityId)
              }}
              error={!!formErrors.city}
              helperText={formErrors.city}
              disabled={!addcoupondata.state}
            >
              <MenuItem value="" disabled>Select City</MenuItem>
              {allCitys.map((city) => (
                <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={3}>
            <CustomTextField
              select
              className='w-96'
              label='Area'
              value={addcoupondata.area || ''}
              onChange={e => setaddcoupondata({ ...addcoupondata, area: e.target.value })}
              error={!!formErrors.area}
              helperText={formErrors.area}
              disabled={!addcoupondata.city}
            >
              <MenuItem value="" disabled>Select Area</MenuItem>
              {allArea.map((area) => (
                <MenuItem key={area._id} value={area._id}>{area.name}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </div> */}

        <div className='m-2 mr-4'>
          <CustomTextField
            className='m-2 w-full sm:w-[33%]'
            select
            name='status'
            label='Status'
            value={addcoupondata.status || 'PENDING'}
            onChange={onAddcoupon}
            error={!!formErrors.status}
            helperText={formErrors.status}
            disabled
          >
            <MenuItem value='PENDING'>PENDING</MenuItem>
          </CustomTextField>
        </div>
      </div>

      {/* button */}
      <div className='flex justify-end'>
        <div>
          {hasPermission("utsav_manage_utsav:add") &&
            <Button onClick={SubmitCoupon} className='m-2' variant='contained'>
              Add Coupon
            </Button>
          }
          <Button onClick={() => redirect('/apps/utsav/managecoupon')} className='m-2' variant='tonal' color='secondary'>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AddcouponModal
