import React, { useState } from 'react'
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

  // Determine field type if not explicitly provided
  const fieldType = type || (label.toLowerCase().includes('email') ? 'email' : 'mobile')

  const handleSendOtp = async () => {
    if (fieldType === 'mobile' && !/^\d{10}$/.test(value)) {
      setErrormsg('Enter a valid 10-digit mobile number')
      return
    }
    if (fieldType === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setErrormsg('Enter a valid email address')
      return
    }

    try {
      setErrormsg('')
      let data;
      if (fieldType === 'email') {
        data = await EmailOtpService.sendOtp({ email: value, name: 'User' })
      } else {
        data = await PhoneOtpService.sendSignUpOtp(value)
      }
      setOtpSent(true)
      toast.success(data.message || "OTP sent successfully")
    } catch (error) {
      console.error("Error sending OTP:", error)
      // setErrormsg(error.response?.data?.message || "Failed to send OTP")
      toast.error(error.response?.data?.message || "Failed to send OTP")
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
            disabled={!value}
          >
            Send OTP
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



// import React, { useState, useEffect } from 'react'
// import { Button, Typography } from '@mui/material'
// import Grid from '@mui/material/Grid2'
// import CustomTextField from '@core/components/mui/TextField'

// const OtpVerification = ({ label, placeholder, value, onChange, type = 'mobile', initialVerifiedStatus }) => {
//   const [otpSent, setOtpSent] = useState(false)
//   const [otp, setOtp] = useState('')
//   const [verified, setVerified] = useState(initialVerifiedStatus) // Initialize with the passed status
//   const [error, setError] = useState('')

//   const fieldType = type || (label.toLowerCase().includes('email') ? 'email' : 'mobile')
//   // Update the verified state if initialVerifiedStatus changes (e.g., when new data is fetched)
//   useEffect(() => {
//     setVerified(initialVerifiedStatus)
//   }, [initialVerifiedStatus])

//   const handleSendOtp = () => {
//     if (type === 'mobile' && !/^\d{10}$/.test(value)) {
//       setError('Enter a valid 10-digit mobile number')
//       return
//     }
//     if (type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
//       setError('Enter a valid email address')
//       return
//     }

//     setOtpSent(true)
//     setError('')
//     console.log(`Sending OTP to ${type}:`, value)
//     // In a real application, you would make an API call here to send the OTP
//   }

//   const handleVerifyOtp = () => {
//     // In a real application, you would make an API call here to verify the OTP
//     // For now, using a dummy OTP '123456'
//     if (otp === '123456') {
//       setVerified(true)
//       setError('')
//     } else {
//       setError('Invalid OTP')
//     }
//   }

//   return (
//     <Grid container spacing={4} alignItems='center'>
//       <Grid size={{ xs: 12, sm: 4 }}>
//         <CustomTextField
//           fullWidth
//           label={label}
//           value={value}
//           placeholder={placeholder}
//           disabled={verified} // Disable input if already verified
//           onChange={e => onChange(e.target.value)}
//         />
//       </Grid>

//       {/* Show send OTP button only if not verified */}
//       {!verified && !otpSent && (
//         <Grid size={{ xs: 12, sm: 2 }} sx={{ mt: 5 }}>
//           <Button fullWidth variant='contained' onClick={handleSendOtp}>
//             Send OTP
//           </Button>
//         </Grid>
//       )}

//       {/* Show OTP input and verify button if OTP sent and not yet verified */}
//       {otpSent && !verified && (
//         <>
//           <Grid size={{ xs: 12, sm: 3 }}>
//             <CustomTextField fullWidth label='Enter OTP' value={otp} onChange={e => setOtp(e.target.value)} />
//           </Grid>
//           <Grid size={{ xs: 12, sm: 2 }} sx={{ my: 5 }}>
//             <Button fullWidth variant='contained' onClick={handleVerifyOtp}>
//               Verify
//             </Button>
//           </Grid>
//         </>
//       )}

//       {/* Show verified tick mark if verified */}
//       {verified && (
//         <Grid size={{ xs: 12, sm: 3 }} sx={{ my: 5 }}>
//           <Typography color='success.main'>✅ Verified</Typography>
//         </Grid>
//       )}

//       {error && (
//         <Grid item xs={12}>
//           <Typography color='error'>{error}</Typography>
//         </Grid>
//       )}
//     </Grid>
//   )
// }

// export default OtpVerification
