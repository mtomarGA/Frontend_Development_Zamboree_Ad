'use client'

import React, { useState } from 'react'
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  MenuItem,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useTempleContext } from '@/contexts/TempleFormContext'
import OtpVerificationModal from './sections/component/OTP'
import EmailOtpService from '@/services/otp/EmailOtp'
import OtpService from '@/services/otp/SendOtp'
import HinduService from '@/services/spritual/hinduService'
import { useGurudwara } from '@/contexts/GurudwaraFormContext'
import SikhService from '@/services/spritual/sikhService'

const Security = ({ nextHandle, handleCancel }) => {
  const {
    handleSecurityChange,
    securityFormData,
    securityErrors,
    mobileVerified, setMobileVerified,
    emailVerified, setEmailVerified,
    handleSubmit, isEditMode, resetForm

  } = useGurudwara()

  const [passwordVisible, setPasswordVisible] = useState({
    showPassword: false,
    showConfirmPassword: false,
  })
  console.log("securityFormData", isEditMode);

  const [otpErrorMessage, setOtpErrorMessage] = useState('')


  const [otpModal, setOtpModal] = useState({
    open: false,
    type: 'email', // or 'mobile'
  })

  const handleSendOTP = async (type) => {
    if (type === 'email') {
      await SikhService.sendEMailOTP({ email: securityFormData.email, name: "Gahram User" })
    } else {
      await SikhService.sendMobileOTP(securityFormData.phoneNumber)
    }
    setOtpModal({ open: true, type })
  }

  const handleFinalSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
    // const validSecurity = validateSecurity()
    // if (!validSecurity) return
    // nextHandle()
  }


  const verifyOTP = async (otp, type) => {
    // Call your verification service here
    console.log(`Verifying OTP for ${type}: ${otp}`)
    if (type === 'email') {
      const res = await SikhService.verifyEmailOTP({ email: securityFormData.email, otp })
      console.log("email otp verification response", res);
      if (res.statusCode === 200) {
        setEmailVerified(true)
        setOtpModal({ ...otpModal, open: false })
        return
      }
      setOtpErrorMessage(res.message)
      setEmailVerified(res.statusCode === 200)
    } else {
      const res = await SikhService.verifyMobileOTP({ phoneNumber: securityFormData.phoneNumber, otp })
      console.log("mobile otp verification response", res);
      if (res.statusCode === 200) {
        setMobileVerified(true)
        setOtpModal({ ...otpModal, open: false })
        return
      }
      setOtpErrorMessage(res.message)
      setEmailVerified(res.statusCode === 200)
    }
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box component='form' onSubmit={handleFinalSubmit} noValidate>
        <Typography variant='h5' sx={{ mb: 4 }}>
          Security Details
        </Typography>

        <Grid container spacing={4}>
          {/* Registered Email */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' flexDirection='column' gap={1}>
              <CustomTextField
                fullWidth
                required
                label='Registered Email'
                name='email'
                placeholder='Enter email'
                value={securityFormData.email}
                onChange={handleSecurityChange('email')}
                error={!!securityErrors.email}
                helperText={securityErrors.email}
                disabled={emailVerified}
                type='email'
              />
              <Box display='flex' alignItems='center' gap={2}>
                <Chip
                  label={emailVerified ? 'Verified' : 'Not verified'}
                  color={emailVerified ? 'success' : 'error'}
                  size='small'
                />
                {!emailVerified ? (<Button
                  disabled={emailVerified}
                  onClick={() => handleSendOTP('email')}
                  variant='text'
                  sx={{ textTransform: 'none' }}
                >
                  Send OTP
                </Button>) : (
                  <Button
                    variant='text'
                    sx={{ textTransform: 'none', color: 'red' }}
                    onClick={() => {
                      setEmailVerified(false)
                    }}
                  >
                    Change
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Registered Mobile */}
          <Grid item xs={12} sm={6} md={4}>
            <Box display='flex' flexDirection='column' gap={1}>
              <CustomTextField
                fullWidth
                required
                label='Registered Mobile'
                name='mobile'
                placeholder='Enter mobile number'
                value={securityFormData.phoneNumber}
                onChange={handleSecurityChange('phoneNumber')}
                error={!!securityErrors.phoneNumber}
                helperText={securityErrors.phoneNumber}
                disabled={mobileVerified}
                type='number'
              />
              <Box display='flex' alignItems='center' gap={2}>
                <Chip
                  label={mobileVerified ? 'Verified' : 'Not verified'}
                  color={mobileVerified ? 'success' : 'error'}
                  size='small'
                />
                {!mobileVerified ? (
                  <Button
                    onClick={() => handleSendOTP('mobile')}
                    variant='text'
                    sx={{ textTransform: 'none' }}
                  >
                    Send OTP
                  </Button>
                ) : (
                  <Button
                    variant='text'
                    sx={{ textTransform: 'none', color: 'red' }}
                    onClick={() => {
                      setMobileVerified(false)
                    }}
                  >
                    Change
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextField select fullWidth label='Spiritual User Status' defaultValue={securityFormData.status}>
              <MenuItem value='PENDING'>Pending</MenuItem>
              <MenuItem value='ACTIVE' disabled={!isEditMode}>
                Active
              </MenuItem>
              <MenuItem value='INACTIVE' disabled={!isEditMode}>
                Inactive
              </MenuItem>
            </CustomTextField>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CustomTextField select onChange={handleSecurityChange('templeStatus')} fullWidth label='Gurudwara Status' defaultValue={securityFormData.templeStatus}>
              <MenuItem  value='ACTIVE'>
                Active
              </MenuItem>
              <MenuItem value='INACTIVE'>
                Inactive
              </MenuItem>
            </CustomTextField>
          </Grid>

          {/* Password */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextField
              fullWidth
              required
              label='Password'
              name='password'
              placeholder='Enter Password'
              type={passwordVisible.showPassword ? 'text' : 'password'}
              value={securityFormData.password}
              onChange={handleSecurityChange('password')}
              error={!!securityErrors.password}
              helperText={securityErrors.password}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() =>
                          setPasswordVisible(prev => ({
                            ...prev,
                            showPassword: !prev.showPassword,
                          }))
                        }
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i
                          className={
                            passwordVisible.showPassword
                              ? 'tabler-eye'
                              : 'tabler-eye-off'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          {/* Confirm Password */}
          <Grid item xs={12} sm={6} md={4}>
            <CustomTextField
              fullWidth
              required
              label='Confirm Password'
              name='confirmPassword'
              placeholder='Enter Confirm Password'
              type={passwordVisible.showConfirmPassword ? 'text' : 'password'}
              value={securityFormData.confirmPassword}
              onChange={handleSecurityChange('confirmPassword')}
              error={!!securityErrors.confirmPassword}
              helperText={securityErrors.confirmPassword}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() =>
                          setPasswordVisible(prev => ({
                            ...prev,
                            showConfirmPassword: !prev.showConfirmPassword,
                          }))
                        }
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i
                          className={
                            passwordVisible.showConfirmPassword
                              ? 'tabler-eye'
                              : 'tabler-eye-off'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>


        </Grid>

        {/* OTP Modal */}
        <OtpVerificationModal
          open={otpModal.open}
          onClose={() => { setOtpModal({ ...otpModal, open: false }); setOtpErrorMessage(''); }}
          onVerify={otp => {
            verifyOTP(otp, otpModal.type)
            setOtpErrorMessage('')
          }}
          onResend={() => handleSendOTP(otpModal.type)}
          type={otpModal.type}
          maskedValue={
            otpModal.type === 'email' ? securityFormData.email : securityFormData.phoneNumber
          }
          errorMessage={otpErrorMessage}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
          <Button
            onClick={() => {
              handleCancel()
              resetForm()
            }}
            variant='outlined'
            color='primary'
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        </Box>
      </Box>
      {/* add a submit button */}
      {/* <Button onClick={handleSubmit} variant='contained' color='primary'>
        Submit
      </Button> */}
    </Card>
  )
}

export default Security
