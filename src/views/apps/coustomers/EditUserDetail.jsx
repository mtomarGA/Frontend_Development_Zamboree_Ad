'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import { useParams } from 'next/navigation'
import classnames from 'classnames'
import styles from '@/libs/styles/inputOtp.module.css'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'



import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
// Third-party Imports
import { toast } from 'react-toastify'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import MobileOtp from '@/components/coustomer/sendOtp/MobileOtp'
import EmailOtp from '@/components/coustomer/sendOtp/EmailOtp'

// import seervices
import maritalStatus from '@/services/customers/maritalstatus'
import interest from '@/services/customers/interestService'
import occupation from '@/services/customers/occupation'
import updateUsers from '@/services/customers/createService'
import Gender from '@/services/customers/gender'
import Image from '@/services/imageService'
import { CircularProgress, DialogTitle, FormHelperText, FormLabel } from '@mui/material'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import SMS from '@/services/otp/SendOtp'
import EmailOtpService from '@/services/otp/EmailOtp'

const EditUser = ({ EditSelectedUser, onSuccess, setEditModalOpen }) => {
  const userId = EditSelectedUser?._id
  useEffect(() => {
    getMaritalStatus()
  }, [])

  const getMaritalStatus = async () => {
    const res = await maritalStatus.getMaritalStatus()
    setMaritalList(res.data)
  }

  const [maritalList, setMaritalList] = useState([])
  const [interests, setinterest] = useState([])
  const [occupations, setoccupation] = useState([])
  const [genders, setgenders] = useState([])

  const getinterest = async () => {
    const res = await interest.getInterest()
    setinterest(res.data)
  }



  const getoccupation = async () => {
    const res = await occupation.getOccupation()
    setoccupation(res.data)
  }

  const Genders = async () => {
    const response = await Gender.getGender()
    setgenders(response.data)
  }

  useEffect(() => {
    getinterest()
    getoccupation()
    Genders()
  }, [])

  const [formData, setFormData] = useState({
    email: EditSelectedUser?.email,
    emailVarified: EditSelectedUser?.emailVerified || false,
    phone: EditSelectedUser?.phone,
    numberVarified: EditSelectedUser?.phoneVerified || false,
    password: '',
    confirmPassword: '',
    isPasswordShown: false,
    isConfirmPasswordShown: false,
    firstName: EditSelectedUser?.firstName,
    lastName: EditSelectedUser?.lastName,
    occupation: EditSelectedUser?.occupation?._id,
    MaritalStatus: EditSelectedUser.maritalStatus?._id,
    interest: EditSelectedUser.interest?.map(item => item?._id) || [],
    gender: EditSelectedUser?.gender?._id,
    dateOfBirth: EditSelectedUser?.dateOfBirth ? new Date(EditSelectedUser?.dateOfBirth) : null,
    imgSrc: EditSelectedUser?.image,
    image: null,
    religion: EditSelectedUser?.Religionpreference,
    status: EditSelectedUser?.status
  })

  // console.log('formData', formData)

  const [isEmailOtpModalOpen, setEmailOtpModalOpen] = useState(false)
  const [imageLoader, setimageLoader] = useState(false)
  const [MobileOtpModalOpen, setMobileOtpModalOpen] = useState(false)

  const handleEmailOpenOtpModal = async () => {
    const data = {
      email: formData.email,
      name: formData.firstName
    }
    const response = await EmailOtpService.sendOtp(data)


    toast.success(response.message)
    setEmailOtpModalOpen(true)
  }
  const handleEmailCloseOtpModal = () => {
    setEmailOtpModalOpen(false)
  }
  const getEmailOtp = async (data) => {
    setFormData(prev => ({ ...prev, emailVarified: data }))
  }
  const handleMobileOpenOtpModal = async () => {
    console.log(formData?.phone, "addadad");

    const result = await SMS.sendOtp(formData.phone)
    toast.success(result.message)
    setMobileOtpModalOpen(true)
  }
  const handleMobileCloseOtpModal = () => {
    setMobileOtpModalOpen(false)
  }

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    MaritalStatus: '',
    interest: '',
    occupation: '',
    state: '',
    city: '',
    area: '',
    gender: '',
    dateOfBirth: '',
    status: ''
  })

  const handleClickShowPassword = () =>
    setFormData(prev => ({ ...prev, isPasswordShown: !prev.isPasswordShown }))

  const handleClickShowConfirmPassword = () =>
    setFormData(prev => ({ ...prev, isConfirmPasswordShown: !prev.isConfirmPasswordShown }))

  const handleFileChange = async (e) => {
    try {
      setimageLoader(true)
      const file = e.target.files?.[0]
      const formData = new FormData()
      formData.append('image', file);
      const imageUrls = await Image.uploadImage(formData)
      setFormData(prev => ({ ...prev, imgSrc: imageUrls?.data?.url, image: imageUrls?.data?.url }))
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
    } finally {
      setimageLoader(false)
    }
  }


  const handleResetImage = () => {
    setFormData(prev => ({ ...prev, imgSrc: '/images/avatars/1.png', image: null }))
  }

  const validateForm = () => {
    const newErrors = {}
    const { email, phone, password, confirmPassword, firstName, lastName, MaritalStatus, interest, occupation, gender, dateOfBirth } = formData
    if (!firstName) newErrors.firstName = 'First Name is required'
    if (!lastName) newErrors.lastName = 'Last Name is required'
    if (!email) newErrors.email = 'Email is required'
    if (!phone) newErrors.phone = 'Number is required'
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!MaritalStatus) newErrors.MaritalStatus = 'Marital Status is required'
    if (!interest.length) newErrors.interest = 'Interest is required'
    if (!occupation) newErrors.occupation = 'Occupation is required'
    if (!gender) newErrors.gender = 'Gender is required'
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (validateForm()) {
      const response = await updateUsers.updateUser(formData, userId)
      onSuccess()
      setEditModalOpen(false)
      toast.success(response.message)
    } else {
      toast.error('Please fix the errors.')
    }
  }

  return (
    <Card className='shadow-none '>
      <CardContent>
        <Typography className='text-xl' variant='h6' sx={{ mb: 4 }}>
          Edit User
        </Typography>
        <Grid container spacing={8}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              label='First Name'
              placeholder="Enter Name"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              error={!!errors.firstName}
              helperText={errors.firstName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              fullWidth
              label='Last Name'
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              error={!!errors.lastName}
              helperText={errors.lastName}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} className='flex  item-center justify-center gap-4'>
            <CustomTextField
              fullWidth
              type='email'
              label='Email'
              placeholder="Enter Email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} className='h-10  flex gap-10 item-center '>
            <Button className='bg-[#7367E9] text-white w-55 h-10 mt-4' onClick={() => handleEmailOpenOtpModal()}>
              Send OTP
            </Button>
            <Typography className={`${formData?.emailVarified ? "text-green-600" : "text-red-600"} mt-5`}>
              {formData?.emailVarified ? '✅ Verified' : '❌ Not verified'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} className='flex  item-center justify-center gap-4'>
            <CustomTextField
              fullWidth
              type='text'
              placeholder='Enter Number'
              label='Mobile Number'
              value={formData.phone}

              onChange={e => {
                let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                if (value.length <= 10) {
                  setFormData(prev => ({ ...prev, price: value }));
                }
                setFormData({ ...formData, phone: e.target.value })
              }}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }} className='h-10  flex gap-10 item-center ' >
            <Button className='bg-[#7367E9] text-white w-55 h-10 mt-4' onClick={() => handleMobileOpenOtpModal()}>Send OTP</Button>
            <Typography className={`${formData?.numberVarified ? "text-green-600" : "text-red-600"} mt-5`}>
              {formData?.numberVarified ? '✅ Verified' : '❌ Not verified'}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Marital Status"
              placeholder="Select Marital Status"
              className='text-start'
              value={formData.MaritalStatus}
              onChange={e => setFormData({ ...formData, MaritalStatus: e.target.value })}
              error={!!errors?.MaritalStatus}
              helperText={errors?.MaritalStatus}
            >
              <MenuItem value='' disabled>
                Select
              </MenuItem>
              {maritalList?.map(item => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>


          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Interest'
              value={formData.interest}
              className='text-start'
              SelectProps={{
                multiple: true,
                onChange: e => setFormData({ ...formData, interest: e.target.value })
              }}
              error={!!errors.interest}
              helperText={errors.interest}
            >
              {interests && interests.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>


          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Occupation Status'
              placeholder="Enter  Status"
              value={formData.occupation}
              className='text-start'
              onChange={e => setFormData({ ...formData, occupation: e.target.value })}
              error={!!errors?.occupation}
              helperText={errors?.occupation}
            >
              <MenuItem value='' disabled>Select occupation</MenuItem>
              {
                occupations && occupations?.map((item) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))
              }


            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel component="legend" className="text-start">
              Religion Preference
            </FormLabel>
            <RadioGroup
              row
              aria-label="religion"
              name="religion"
              value={formData.religion || ''}
              onChange={(e) => {
                const selectedReligion = e.target.value
                setFormData((prev) => ({
                  ...prev,
                  religion: selectedReligion,
                }))
              }}
            >
              {['HINDUISM', 'ISLAM', 'CHRISTIANITY', 'BUDDHISM', 'JAINISM', 'SIKHISM'].map((religion) => (
                <FormControlLabel
                  key={religion}
                  value={religion}
                  control={<Radio />}
                  label={religion}
                />
              ))}
            </RadioGroup>

            {errors?.religion && <FormHelperText error>{errors.religion}</FormHelperText>}
          </Grid>


          <Grid size={{ xs: 12, md: 6 }}>
            <div className='flex max-sm:flex-col items-center gap-6 relative'>
              <div className="relative h-[100px] w-[100px]">
                {imageLoader && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                    <CircularProgress className="text-white" />
                  </div>
                )}
                <img
                  height={100}
                  width={100}
                  className="rounded object-cover"
                  src={formData.imgSrc || '/images/avatars/1.png'}
                  alt="Profile"
                  onLoad={() => setImageLoader(false)}
                  onError={() => setImageLoader(false)}
                />
              </div>

              <div className='flex flex-grow flex-col gap-4'>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload Photo
                    <TextField
                      type='file'
                      InputProps={{
                        accept: 'image/png, image/jpeg',
                        id: 'account-settings-upload-image',
                        style: { display: 'none' }
                      }}
                      onChange={handleFileChange}
                      sx={{ display: 'none' }}
                    />
                  </Button>

                  <Button variant='tonal' color='secondary' onClick={handleResetImage}>
                    Reset
                  </Button>
                </div>
                <Typography variant='body2'>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
              </div>
            </div>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }} className='flex'>
            <Typography color='text.primary flex item-start'>Gender</Typography>
            <RadioGroup row aria-label='controlled' name='controlled' value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
              {
                genders.map((gen, index) =>
                (
                  <FormControlLabel key={index} value={gen._id} control={<Radio />} label={gen?.name} />
                )
                )
              }
            </RadioGroup>
            {errors.gender && <Typography color='red'>{errors.gender}</Typography>}
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <CustomTextField
              type='date'
              fullWidth
              label='Date Of Birth'
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
              onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              select
              fullWidth
              label="Status"
              value={formData.status} // Always "ACTIVE" or "INACTIVE"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value }) // set directly
              }
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </CustomTextField>
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              fullWidth
              label='Password'
              type={formData.isPasswordShown ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowPassword} edge='end'>
                      <i className={formData.isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              fullWidth
              label='Confirm Password'
              type={formData.isConfirmPasswordShown ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleClickShowConfirmPassword} edge='end'>
                      <i className={formData.isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>


        </Grid>

        <Button variant='contained' sx={{ mt: 5 }} disabled={imageLoader} onClick={handleSubmit}>
          Submit
        </Button>
      </CardContent>

      <Dialog
        fullWidth
        open={isEmailOtpModalOpen}

        maxWidth='sm'
        scroll='body'
        setEditModalOpen={false}

        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleEmailCloseOtpModal} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center   sm:pli-16'>

          <EmailOtp email={formData?.email} getEmailOtp={getEmailOtp} onSuccess={setEmailOtpModalOpen} handleEmailOpenOtpModal={handleEmailOpenOtpModal} />

        </DialogTitle>

      </Dialog>

      <Dialog
        fullWidth
        open={MobileOtpModalOpen}

        maxWidth='sm'
        scroll='body'
        setEditModalOpen={false}

        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleMobileCloseOtpModal} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pli-16'>

          <MobileOtp Number={formData?.phone} onSuccess={setMobileOtpModalOpen} handleMobileOpenOtpModal={handleMobileOpenOtpModal} />

        </DialogTitle>

      </Dialog>
    </Card>
  )
}

export default EditUser
