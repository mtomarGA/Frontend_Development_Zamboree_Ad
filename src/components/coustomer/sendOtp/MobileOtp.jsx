'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Third-party Imports
import { OTPInput } from 'input-otp'
import classnames from 'classnames'

// Component Imports
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import OtpService from '@/services/otp/SendOtp'

// Style Imports
import styles from '@/libs/styles/inputOtp.module.css'
import Image from 'next/image'
import { toast } from 'react-toastify'

const Slot = props => {
  return (
    <div className={classnames(styles.slot, { [styles.slotActive]: props.isActive })}>
      {props.char !== null && <div>{props.char}</div>}
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

const FakeCaret = () => {
  return (
    <div className={styles.fakeCaret}>
      <div className='w-px h-5 bg-textPrimary' />
    </div>
  )
}

const MobileOtp = ({ Number, onSuccess, MobileOtp, handleMobileOpenOtpModal }) => {

  const mobileString = Number.toString();
  const masked = '*'.repeat(mobileString.length - 4) + mobileString.slice(-4);

  // States
  const [otp, setOtp] = useState(null)
  const HandleVerifyOtp = async () => {
    const result = await OtpService.verifyOtp(Number, otp)
    onSuccess(false)
    if (result.success === true) {
      MobileOtp(true)
    }
    toast.success(result.message)
  }

  const handleResendMobileOtp = async (e) => {
    e.preventDefault()
    handleMobileOpenOtpModal()
  }
  // Hooks
  const { lang: locale } = useParams()

  return (
    <Card className='flex flex-col sm:is-[450px] shadow-none'>
      <CardContent className='sm:!p-12'>
        <Link href={getLocalizedUrl('/', locale)} className='flex justify-center mbe-6'>
          <Image src='/images/MyLogo/SmallLogoHappening.png' alt='Logo' width={80} height={100} priority />
        </Link>
        <div className='flex flex-col gap-1 mbe-6'>
          <Typography variant='h4'>Enter Verification Code </Typography>
          <Typography>
             6 Digit OTP has been send to 
          </Typography>
          <Typography className='font-medium' color='text.primary'>
            {masked}
          </Typography>
        </div>
        <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
           
            <OTPInput
              onChange={setOtp}
              value={otp ?? ''}
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
          <Button fullWidth variant='contained' onClick={HandleVerifyOtp} type='submit'>
            Verify
          </Button>
          <div className='flex justify-center items-center flex-wrap gap-2'>
            <Typography>Didn&#39;t get the code?</Typography>
            <Typography color='primary.main' component={Link} href='/' onClick={e => handleResendMobileOtp(e)}>
              Resend
            </Typography>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MobileOtp
