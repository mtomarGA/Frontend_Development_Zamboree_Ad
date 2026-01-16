'use client'

import { Card, CardHeader, CardContent, MenuItem, Button, Box, Grid, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import userRegister from '@/services/customers/createService'
import createUtsavPackage from '@/services/utsav-packages/utsavPackageService'
import discountCode from '@/services/utsav-packages/discountCode.service'
import { useAuth } from '@/contexts/AuthContext'
import createUtsavService from '@/services/utsav-packages/createOrder.Service'

const CreateOrder = () => {
  const router = useRouter()
  const { user } = useAuth()

  const [packageList, setPackageList] = useState([])
  const [discountList, setDiscountList] = useState([])
  const [selectedUser, setSelectedUser] = useState([])
  const [query, setQuery] = useState('')

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = useForm({
    defaultValues: {
      selectedUser: '',
      selectedPackage: '',
      currentDate: new Date().toISOString().split('T')[0],
      expireDate: '',
      totalAmount: '',
      discountCode: '',
      payableAmount: '',
      paymentStatus: 'PENDING',
      orderCreatedBy: ''
    }
  })

  const selectedPackage = watch('selectedPackage')

  const formatDateForInput = dateStr => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toISOString().split('T')[0]
  }

  useEffect(() => {
    const fetchPackages = async () => {
      const res = await createUtsavPackage.getPackage()
      setPackageList(Array.isArray(res?.data) ? res.data : [])
    }

    const fetchDiscounts = async () => {
      try {
        const res = await discountCode.getDiscount()
        setDiscountList(Array.isArray(res?.data) ? res.data : [])
      } catch {
        toast.error('Failed to fetch discount codes')
      }
    }

    fetchPackages()
    fetchDiscounts()
  }, [])

  useEffect(() => {
    const pkg = packageList.find(p => p._id === selectedPackage)

    if (pkg) {
      const baseAmount = pkg?.price || ''
      setValue('totalAmount', baseAmount)
      setValue('payableAmount', baseAmount)

      if (pkg.packageValiditydays) {
        const today = new Date()
        const validityInDays = parseInt(pkg.packageValiditydays, 10)
        const expiryDate = new Date(today.setDate(today.getDate() + validityInDays))
        setValue('packageValiditydays', formatDateForInput(expiryDate))
        setValue('expireDate', formatDateForInput(expiryDate))
      }

      setValue('discountCode', '')
    } else {
      setValue('totalAmount', '')
      setValue('payableAmount', '')
      setValue('expireDate', '')
      setValue('packageValiditydays', '')
    }
  }, [selectedPackage, packageList, setValue])

  const handleApplyDiscount = () => {
    const discountId = getValues('discountCode')
    const selectedPkgId = getValues('selectedPackage')

    if (!selectedPkgId) return toast.error('Please select a package first')

    const pkg = packageList.find(p => p._id === selectedPkgId)
    if (!pkg) return toast.error('Invalid package selected')

    const baseAmount = parseFloat(pkg.price || 0)

    if (!discountId) {
      setValue('totalAmount', baseAmount.toFixed(2))
      setValue('payableAmount', baseAmount.toFixed(2))
      toast.info('Discount removed')
      return
    }

    const discount = discountList.find(d => d._id === discountId)
    if (!discount) return toast.error('Invalid discount code')

    const discountValue = parseFloat(discount.discount || 0)
    const voucherType = discount.voucherType?.toUpperCase()
    let finalAmount = baseAmount

    if (voucherType === 'AMOUNT') {
      finalAmount = Math.max(0, baseAmount - discountValue)
      toast.success(`₹${discountValue} discount applied`)
    } else if (voucherType === 'PERCENTAGE') {
      finalAmount = Math.max(0, baseAmount - (baseAmount * discountValue) / 100)
      toast.success(`${discountValue}% discount applied`)
    } else {
      return toast.error('Invalid voucher type')
    }

    setValue('totalAmount', baseAmount.toFixed(2))
    setValue('payableAmount', finalAmount.toFixed(2))
  }

  const handleSearch = async value => {
    setQuery(value)
    if (value.length > 3) {
      const result = await userRegister.getSerchUser(value)
      setSelectedUser(result.data || [])
    } else {
      setSelectedUser([])
    }
  }

  const onSubmit = async formData => {
    try {
      const payload = {
        userId: formData.selectedUser,
        choosePackage: formData.selectedPackage,
        validDate: formData.packageValiditydays,
        totalAmount: Number(formData.totalAmount),
        payableAmount: Number(formData.payableAmount),
        paymentStatus: formData.paymentStatus,
        orderCreatedBy: formData.orderCreatedBy
      }

      const response = await createUtsavService.createOrder(payload)
      toast.success(response.message)
      reset()
      router.push('/en/apps/utsav-package/all-order')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || 'Order creation failed')
    }
  }

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0]
    reset({
      selectedUser: '',
      selectedPackage: '',
      currentDate: today,
      expireDate: '',
      totalAmount: '',
      discountCode: '',
      payableAmount: '',
      paymentStatus: 'PENDING',
      orderCreatedBy: ''
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 4 }}>
        <CardHeader title={<Typography variant='h4'>Create Order</Typography>} />
        <CardContent>
          <Grid container spacing={4}>
            {/* User selection */}
            <Grid item xs={12}>
              <Controller
                name='selectedUser'
                control={control}
                rules={{ required: 'User is required' }}
                render={({ field }) => (
                  <>
                    <CustomTextField
                      {...field}
                      value={query}
                      fullWidth
                      label='User Email or Mobile'
                      error={!!errors.selectedUser}
                      helperText={errors.selectedUser?.message}
                      onChange={e => {
                        const val = e.target.value
                        setQuery(val)
                        handleSearch(val)
                      }}
                    />
                    {selectedUser.length > 0 && (
                      <Box sx={{ border: '1px solid #ccc', borderRadius: 1, mt: 1, maxHeight: 250, overflowY: 'auto' }}>
                        {selectedUser.map(item => (
                          <MenuItem
                            key={item._id}
                            onClick={() => {
                              const displayValue =
                                `${item.firstName || ''} ${item.lastName || ''} ${item.phone || ''} ${item.userId || ''}`.trim()
                              setQuery(displayValue)
                              field.onChange(item._id)
                              setSelectedUser([])
                            }}
                          >
                            {(item.firstName || 'No Name') + ' ' + (item.lastName || '')} - {item.userId || 'No ID'} -{' '}
                            {item.phone || 'No Phone'}
                          </MenuItem>
                        ))}
                      </Box>
                    )}
                  </>
                )}
              />
            </Grid>

            {/* Package selection */}
            <Grid item xs={12}>
              <Controller
                name='selectedPackage'
                control={control}
                rules={{ required: 'Package is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Choose Package'
                    error={!!errors.selectedPackage}
                    helperText={errors.selectedPackage?.message}
                  >
                    <MenuItem value='' disabled>
                      Select a package
                    </MenuItem>
                    {packageList.map(pkg => (
                      <MenuItem key={pkg._id} value={pkg._id}>
                        {pkg.title}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Dates */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='currentDate'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Current Date'
                    type='date'
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name='packageValiditydays'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Valid Until'
                    type='date'
                    disabled
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            {/* Amounts */}
            <Grid item xs={12}>
              <Controller
                name='totalAmount'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Total Amount'
                    type='number'
                    disabled
                    sx={{ '& .MuiInputBase-input': { color: 'red', fontWeight: 'bold' } }}
                  />
                )}
              />
            </Grid>

            {/* Discount */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Controller
                    name='discountCode'
                    control={control}
                    render={({ field }) => (
                      <CustomTextField {...field} select fullWidth label='Discount Code (Optional)'>
                        <MenuItem value=''>No Discount</MenuItem>
                        {discountList.map(discount => (
                          <MenuItem key={discount._id} value={discount._id}>
                            {discount.couponCode} (
                            {discount.voucherType === 'AMOUNT' ? `₹${discount.discount}` : `${discount.discount}%`})
                          </MenuItem>
                        ))}
                      </CustomTextField>
                    )}
                  />
                </Grid>
                <Grid item xs={3} display='flex' alignItems='center'>
                  <Button
                    variant='contained'
                    size='small'
                    fullWidth
                    sx={{ mt: '12px', minHeight: '38px', textTransform: 'uppercase' }}
                    onClick={handleApplyDiscount}
                  >
                    APPLY
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='payableAmount'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Payable Amount'
                    type='number'
                    disabled
                    sx={{ '& .MuiInputBase-input': { fontWeight: 'bold' } }}
                  />
                )}
              />
            </Grid>

            {/* Payment Status */}
            <Grid item xs={12}>
              <Controller
                name='paymentStatus'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Payment Status' disabled>
                    <MenuItem value='PENDING'>PENDING</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Order Created By */}
            <Grid item xs={12}>
              <Controller
                name='orderCreatedBy'
                control={control}
                render={({ field }) => {
                  const orderCreatedByValue = user?.userType === 'ADMIN' ? 'ADMIN' : user?.userId?.employee_id || ''
                  return (
                    <CustomTextField
                      {...field}
                      fullWidth
                      value={orderCreatedByValue}
                      label='Order Created By'
                      disabled
                    />
                  )
                }}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end' gap={2}>
                <Button type='submit' variant='contained'>
                  Create
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  )
}

export default CreateOrder
