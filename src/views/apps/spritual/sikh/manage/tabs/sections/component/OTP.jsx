'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, Typography, Button, IconButton } from '@mui/material'
import { OTPInput } from 'input-otp'
import classnames from 'classnames'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'

// Styles
import styles from '@/libs/styles/inputOtp.module.css'
import { set } from 'react-hook-form'

const Slot = props => (
  <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
    {props.char !== null && <div>{props.char}</div>}
    {props.hasFakeCaret && <FakeCaret />}
  </div>
)

const FakeCaret = () => (
  <div className={styles.fakeCaret}>
    <div className='w-px h-5 bg-textPrimary' />
  </div>
)

const OtpVerificationModal = ({ open, onClose, onVerify, onResend, type, maskedValue, errorMessage }) => {
  const [otp, setOtp] = useState('')

  //mask the email or phone number
  const maskValue = (value) => {
    if (type === 'email') {
      const [localPart, domain] = value.split('@')
      const maskedLocalPart = localPart.slice(0, 2) + '****' + localPart.slice(-2)
      return `${maskedLocalPart}@${domain}`
    } else if (type === 'phone') {
      const maskedPhone = value.slice(0, 3) + '****' + value.slice(-2)
      return maskedPhone
    }
    return value
  }

  console.log("errorMessage", errorMessage);

  useEffect(() => {
    setOtp('')
  }, [onClose])
  

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.length === 6) onVerify(otp)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogContent className='relative p-8'>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 16, top: 16 }}
          aria-label='close'
        >
          <CloseIcon />
        </IconButton>

        <div className='flex justify-center mb-6'>
          <Image src='/images/MyLogo/SmallLogoHappening.png' alt='Logo' width={60} height={70} priority />
        </div>

        <Typography variant='h5' gutterBottom>
          Two Step Verification
        </Typography>
        <Typography sx={{ mb: 1 }}>
          We sent a verification code to your {type}. Enter the code in the field below.
        </Typography>
        <Typography className='font-medium' color='text.primary' gutterBottom>
          {maskedValue}
        </Typography>

        <form noValidate autoComplete='off' className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <Typography>Type your 6 digit security code</Typography>
            <OTPInput
              onChange={setOtp}
              value={otp}
              maxLength={6}
              containerClassName='flex items-center'
              render={({ slots }) => (
                <div className='flex items-center justify-between w-full gap-4'>
                  {slots.slice(0, 6).map((slot, idx) => (
                    <Slot key={idx} {...slot} />
                  ))}
                </div>
              )}
            />
          </div>
          {errorMessage && (
            <Typography color='error.main' textAlign={"center"} className='text-sm'>
              {errorMessage}
            </Typography>
          )}

          <Button fullWidth variant='contained' onClick={handleSubmit} disabled={otp.length !== 6}>
            Verify my account
          </Button>

          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>Didn't get the code?</Typography>
            <Typography
              color='primary.main'
              onClick={onResend}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            >
              Resend
            </Typography>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OtpVerificationModal
