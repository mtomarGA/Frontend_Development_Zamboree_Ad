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
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import { Checkbox, CircularProgress, DialogTitle, FormGroup, FormHelperText, FormLabel } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import classnames from 'classnames'
import styles from '@/libs/styles/inputOtp.module.css'
import Dialog from '@mui/material/Dialog'
import MaritalStatus from '@/services/customers/maritalstatus'
import Interest from '@/services/customers/interestService'
import Occupation from '@/services/customers/occupation'
import CreateUser from '@/services/customers/createService.js'
import Gender from '@/services/customers/gender'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import EmailOtpService from '@/services/otp/EmailOtp'
import { toast } from 'react-toastify'
import CustomTextField from '@core/components/mui/TextField'
import MobileOtp from '@/components/coustomer/sendOtp/MobileOtp'
import EmailOtp from '@/components/coustomer/sendOtp/EmailOtp'
import Image from '@/services/imageService'

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    emailVerified: false,
    phone: '',
    phoneVerified: false,
    password: '',
    confirmPassword: '',
    isPasswordShown: false,
    isConfirmPasswordShown: false,
    firstName: '',
    lastName: '',
    occupation: '',
    maritalStatus: '',
    interest: [],
    gender: '',
    dateOfBirth: '',
    imgSrc: '',
    religion:'HINDUISM',
    image: '', // this will hold uploaded image if any
    referralCode: '',
    status: 'ACTIVE'
  })

  const router = useRouter()
  const { lang: locale } = useParams()

  const [isEmailOtpModalOpen, setEmailOtpModalOpen] = useState(false)
  const [MobileOtpModalOpen, setMobileOtpModalOpen] = useState(false)
  const [otpType, setOtpType] = useState('')
  const [otp, setOtp] = useState(null)

  const [errors, setErrors] = useState({})
  const [maritalStatus, setMaritalStatus] = useState()
  const [interest, setInterest] = useState([])
  const [occupation, setoccupation] = useState()
  const [getGender, setgetGender] = useState()
  const [imageLoader, setimageLoader] = useState(false)

  // === Fetch dropdown data ===
  const getmaritalStatus = async () => {
    const result = await MaritalStatus.getMaritalStatus()
    setMaritalStatus(result.data)
  }
  const getInterest = async () => {
    const result = await Interest.getInterest()
    setInterest(result.data)
  }
  const getoccupation = async () => {
    const result = await Occupation.getOccupation()
    setoccupation(result.data)
  }
  const gender = async () => {
    const result = await Gender.getGender()
    setgetGender(result.data)

    // pre-set default gender + image
    if (result?.data?.length) {
      setFormData(prev => ({
        ...prev,
        gender: result.data[0]._id,
        imgSrc: result.data[0].image
      }))
    }
  }

  useEffect(() => {
    getmaritalStatus()
    getInterest()
    getoccupation()
    gender()
  }, [])

  // === OTP Handlers ===
  const mobileVerified = (data) => {
    setFormData(prev => ({ ...prev, phoneVerified: data }))
  }
  const emailVerified = (data) => {


    setFormData(prev => ({ ...prev, emailVerified: data }))
  }
  const handleEmailOpenOtpModal = async () => {
    const data = { email: formData.email, name: formData.firstName }
    const response = await CreateUser.checkEmail(data)
    toast.success(response.message)
    if (response?.success) setEmailOtpModalOpen(true)
  }
  const handleEmailCloseOtpModal = () => setEmailOtpModalOpen(false)
  const handleMobileOpenOtpModal = async () => {
    const result = await CreateUser.checkPhone(formData?.phone)
    toast.success(result.message)
    if (result?.data.type === 'success') setMobileOtpModalOpen(true)
  }
  const handleMobileCloseOtpModal = () => setMobileOtpModalOpen(false)

  // === Password Toggle ===
  const handleClickShowPassword = () =>
    setFormData(prev => ({ ...prev, isPasswordShown: !prev.isPasswordShown }))
  const handleClickShowConfirmPassword = () =>
    setFormData(prev => ({ ...prev, isConfirmPasswordShown: !prev.isConfirmPasswordShown }))

  // === Image Upload ===
  const handleFileChange = async (e) => {
    try {
      setimageLoader(true)
      const file = e.target.files?.[0]
      const formDataImg = new FormData()
      formDataImg.append('image', file)
      const imageUrls = await Image.uploadImage(formDataImg)
      setFormData(prev => ({
        ...prev,
        imgSrc: imageUrls?.data?.url,
        image: imageUrls?.data?.url // mark as user uploaded
      }))
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
    } finally {
      setimageLoader(false)
    }
  }

  const handleResetImage = () => {
    setFormData(prev => ({
      ...prev,
      imgSrc: '/images/avatars/1.png',
      image: ''
    }))
  }

  // === Validation ===
  const validateForm = () => {
    const newErrors = {}
    const { email, phone, password, status, confirmPassword, firstName, lastName, maritalStatus, interest, occupation, gender, dateOfBirth } = formData

    if (!firstName) newErrors.firstName = 'First Name is required'
    if (!lastName) newErrors.lastName = 'Last Name is required'
    if (!email) newErrors.email = 'Email is required'
    if (!phone) newErrors.phone = 'Number is required'
    if (!password) newErrors.password = 'Password is required'
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm Password is required'
    if (password && confirmPassword && password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!maritalStatus) newErrors.maritalStatus = 'Marital Status is required'
    if (!interest.length) newErrors.interest = 'Interest is required'
    if (!occupation) newErrors.occupation = 'Occupation is required'
    if (!gender) newErrors.gender = 'Gender is required'
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date is required'
    if (!status) newErrors.status = "Status is Required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
   

    if (validateForm()) {
      try {
        const result = await CreateUser.createUser(formData)
        toast.success(result.message)
        router.push(`/apps/coustomers/alluser`)
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || "Something went wrong"
        toast.error(errorMessage)
      }
    } else {
      toast.error('Please fix the errors.')
    }
  }


  return (
    <Card>
      <CardContent>
        <Typography variant='h4' sx={{ mb: 4 }}>
          Create User
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
              disabled={formData.emailVerified === true}
            />

          </Grid>
          <Grid size={{ xs: 12, md: 3 }} className='h-10  flex gap-10 item-center '>
            <Button className='bg-[#7367E9] text-white w-55 h-10 mt-4' disabled={formData.emailVerified === true} onClick={() => handleEmailOpenOtpModal()}>
              Send OTP
            </Button>
            <Typography className={`${formData?.emailVerified ? "text-green-600" : "text-red-600"} mt-5`}>
              {formData?.emailVerified ? '✅ Verified' : '❌ Not verified'}
            </Typography>

          </Grid>
          <Grid item xs={12} md={3} className='flex items-center justify-center gap-4'>
            <CustomTextField
              fullWidth
              placeholder='Enter Number'
              label='Mobile Number'
              value={formData.phone}
              onChange={e => {
                const rawVal = e.target.value;
                const digitsOnly = rawVal.replace(/\D/g, '');

                // Limit to 10 digits
                if (digitsOnly.length <= 10) {
                  setFormData(prev => ({ ...prev, phone: digitsOnly }));

                  // Validation
                  if (digitsOnly.length > 0 && digitsOnly.length < 10) {
                    setErrors(prev => ({ ...prev, phone: 'Mobile number must be 10 digits' }));
                  } else {
                    setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }
              }}
              disabled={formData.phoneVerified === true}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>


          <Grid size={{ xs: 12, md: 3 }} className='h-10  flex gap-10 item-center '>
            <Button className='bg-[#7367E9] text-white w-55 h-10 mt-4' disabled={formData.phoneVerified === true} onClick={() => handleMobileOpenOtpModal()}>Send OTP</Button>
            <Typography className={`${formData?.phoneVerified ? "text-green-600" : "text-red-600"} mt-5`}>
              {formData?.phoneVerified ? '✅ Verified' : '❌ Not verified'}
            </Typography>

          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label='Marital Status'
              // placeholder="Enter Marital Status"
              value={formData.maritalStatus}
              onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}
              error={!!errors?.maritalStatus}
              helperText={errors?.maritalStatus}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: selected => {
                    if (selected === '') {
                      return <p>Select Marital Status</p>
                    }
                    const selectedItem = maritalStatus.find(item => item._id === selected)
                    return selectedItem ? selectedItem.name : ''
                  }
                }
              }}
            >
              <MenuItem value='' disabled>Select Marital Status</MenuItem>
              {
                Array.isArray(maritalStatus) && maritalStatus.map((marital) => (
                  <MenuItem key={marital._id} value={marital._id}>{marital.name}</MenuItem>
                ))
              }

            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Interest"
              value={formData.interest}
              onChange={e => setFormData({ ...formData, interest: e.target.value })}
              error={!!errors.interest}
              helperText={errors.interest}
              SelectProps={{
                multiple: true,
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected || selected.length === 0) {
                    return <span >Select Interest</span>;
                  }
                  return selected
                    .map((id) => {
                      const item = interest.find((i) => i._id === id);
                      return item?.name || '';
                    })
                    .join(', ');
                },
              }}
            >
              {
                Array.isArray(interest) && interest.map((int) => (
                  <MenuItem key={int._id} value={int._id}>
                    {int.name}
                  </MenuItem>
                ))
              }
            </CustomTextField>

          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Occupation Status"
              placeholder="Enter Status"
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
              }
              error={!!errors?.occupation}
              helperText={errors?.occupation}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected) {
                    return <span >Select Occupation</span>;
                  }
                  const selectedItem = occupation.find((item) => item._id === selected);
                  return selectedItem ? selectedItem.name : '';
                },
              }}
            >
              <MenuItem value="" disabled>
                Select Occupation
              </MenuItem>
              {Array.isArray(occupation) &&
                occupation.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                ))}
            </CustomTextField>

          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormLabel >Religion Preference</FormLabel>
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
                  src={formData.imgSrc}
                  alt="Profile"
                  onLoad={() => setimageLoader(false)}
                  onError={() => setimageLoader(false)}
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
          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              type='date'
              fullWidth
              label='Date Of Birth'
              value={formData.dateOfBirth}
              onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
          </Grid>
          {/* Gender */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography color='text.primary'>Gender</Typography>
            <RadioGroup
              row
              aria-label='controlled'
              name='controlled'
              value={formData.gender}
              onChange={e => {
                const selectedGenderId = e.target.value
                const selectedGender = getGender?.find(g => g._id === selectedGenderId)
                setFormData(prev => ({
                  ...prev,
                  gender: selectedGenderId,
                  // Only set image if user hasn't uploaded a custom image
                  imgSrc: prev.image ? prev.imgSrc : selectedGender?.image,
                  image: prev.image ? prev.image : selectedGender?.image
                }))
              }}
            >

              {Array.isArray(getGender) &&
                getGender.map(gender => (
                  <FormControlLabel key={gender._id} value={gender._id} control={<Radio />} label={gender.name} />
                ))}
            </RadioGroup>
            {errors.gender && <Typography color='red'>{errors.gender}</Typography>}
          </Grid>


          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              select
              fullWidth
              label='Status'
              placeholder="Enter  Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              error={!!errors?.status}
              helperText={errors?.status}
            >
              <MenuItem value='ACTIVE'>Active</MenuItem>
              <MenuItem value='INACTIVE'>In Active</MenuItem>
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
          <Grid size={{ xs: 12, md: 3 }}>
            <CustomTextField
              fullWidth
              label='Referral Code'
              placeholder="Enter Referral Code"
              value={formData.referralCode}
              onChange={e => setFormData({ ...formData, referralCode: e.target.value })}
            />
          </Grid>
        </Grid>


        <Button variant='contained' disabled={imageLoader} sx={{ mt: 5 }} onClick={handleSubmit}>
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

          <EmailOtp email={formData?.email} onSuccess={setEmailOtpModalOpen} emailOtp={emailVerified} handleEmailOpenOtpModal={handleEmailOpenOtpModal} />

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

          <MobileOtp Number={formData?.phone} onSuccess={setMobileOtpModalOpen} MobileOtp={mobileVerified} handleMobileOpenOtpModal={handleMobileOpenOtpModal} />

        </DialogTitle>

      </Dialog>

    </Card>
  )
}

export default CreateUserForm
