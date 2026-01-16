import React, { useState, useEffect } from 'react'
import { Button, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import CustomTextField from '@core/components/mui/TextField'
import EmailOtpService from "@/services/otp/EmailOtp"
import PhoneOtpService from '@/services/otp/SendOtp'
import { toast } from 'react-toastify'

const OtpVerification = ({
  label,
  placeholder,
  value,
  to,
  onChange,
  type = '',
  error,
  helperText,
  name,
  disabled = false,
  onVerified,
  verifyField
}) => {
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [errormsg, setErrormsg] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Determine field type if not explicitly provided
  const fieldType = type || (label.toLowerCase().includes('email') ? 'email' : 'mobile')

  const handleSendOtp = async () => {
    if (fieldType === 'mobile' && !/^\d{10}$/.test(value)) {
      setErrormsg('Enter a valid 10-digit mobile number')
      return
    }
    if (fieldType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrormsg('Enter a valid email address')
      return
    }

    try {
      setIsSending(true)
      setErrormsg('')
      let data;
      if (fieldType === 'email') {
        data = await EmailOtpService.sendOtp({ email: value, name: 'User' })
      } else {
        data = await PhoneOtpService.sendSignUpOtp(value, to)
      }
      setOtpSent(true)
      setCountdown(30)
      toast.success(data.message || "OTP sent successfully")
    } catch (error) {
      console.error("Error sending OTP:", error)
      setErrormsg(error.response?.data?.message || 'Failed to send OTP')
    } finally {
      setIsSending(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrormsg('OTP is required')
      return
    }

    try {
      setIsVerifying(true)
      setErrormsg('')
      let data;
      if (fieldType === 'email') {
        data = await EmailOtpService.verifyOtp({ email: value, otp })
      } else {
        data = await PhoneOtpService.verifyOtp(value, otp)
      }
      toast.success(data.message || "OTP verified successfully")
      if (onVerified && verifyField) {
        onVerified(verifyField, true)
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setErrormsg(error.response?.data?.message || 'OTP verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setIsSending(true)
      setErrormsg('')
      let data;
      if (fieldType === 'email') {
        data = await EmailOtpService.sendOtp({ email: value, name: 'User' })
      } else {
        data = await PhoneOtpService.sendSignUpOtp(value, to)
      }
      setCountdown(30)
      setOtp('')
      toast.success(data.message || "OTP resent successfully")
    } catch (error) {
      console.error("Error resending OTP:", error)
      setErrormsg(error.response?.data?.message || 'Failed to resend OTP')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Grid container spacing={4} alignItems='center'>
      <Grid size={{ xs: 12, sm: 4 }}>
        <CustomTextField
          fullWidth
          label={label}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          error={error}
          helperText={helperText}
        />
      </Grid>

      {!otpSent && !disabled && (
        <Grid size={{ xs: 12, sm: 2 }}>
          <Button
            fullWidth
            variant='contained'
            onClick={handleSendOtp}
            disabled={!value || isSending}
          >
            {isSending ? 'Sending...' : 'Send OTP'}
          </Button>
        </Grid>
      )}

      {otpSent && !disabled && (
        <>
          <Grid size={{ xs: 12, sm: 3 }}>
            <CustomTextField
              fullWidth
              label='Enter OTP'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isVerifying}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              variant='contained'
              onClick={handleVerifyOtp}
              disabled={isVerifying || !otp}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ mt: 5 }}>
            <Button
              fullWidth
              variant='outlined'
              onClick={handleResendOtp}
              disabled={countdown > 0 || isSending}
            >
              {isSending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
            </Button>
          </Grid>
        </>
      )}

      {disabled && (
        <Grid size={{ xs: 12, sm: 3 }} sx={{ my: 5 }}>
          <Typography color='success.main'>✅ Verified</Typography>
        </Grid>
      )}

      {errormsg && (
        <Grid item xs={12}>
          <Typography color='error'>{errormsg}</Typography>
        </Grid>
      )}
    </Grid>
  )
}

export default OtpVerification
