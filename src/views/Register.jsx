'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'


// Form Imports
import { useForm } from 'react-hook-form';
import { ToastContainer ,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { valibotResolver } from '@hookform/resolvers/valibot'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import { email, object, minLength, string, pipe, nonEmpty } from 'valibot'


// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import AuthService from '@/services/authService'




const schema = object({
  fullName: pipe(string(), minLength(1, 'This field is required')),
  email: pipe(string(), minLength(1, 'This field is required'), email('Email is invalid')),
  password: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(5, 'Password must be at least 5 characters long')
  )
})

// Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 600,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 345,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Register = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors ,isValid }
  } = useForm({
    resolver: valibotResolver(schema)
  })

  // Hooks
  const { lang: locale } = useParams()
  const { settings } = useSettings();
  const router = useRouter();
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, '/images/pages/auth-mask-light.png', '/images/pages/auth-mask-dark.png')

  const characterIllustration = useImageVariant(
    mode,
    '/images/illustrations/auth/v2-register-light.png',
    '/images/illustrations/auth/v2-register-dark.png',
    '/images/illustrations/auth/v2-register-light-border.png',
    '/images/illustrations/auth/v2-register-dark-border.png'
  )

  const handleClickShowPassword = () => setIsPasswordShown(prev => !prev)

  // Form Submit Handler
  const onSubmit = async (data) => {
    if (!isValid) {
      console.error('Validation failed:', errors);

return; // Prevents API call if the form is invalid
    }

    console.log('Form Data:', data);

    try {
      const response = await AuthService.register(data);

      console.log("API Response:", response); // Debugging

      if (response.statusCode === 200) {
        toast.success(response?.message)

        setTimeout(() => {
          router.push(`/login`);
        }, 1000);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Error")
      console.error("Error during registration:", error);
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(null);


  useEffect(() => {
    // Check if the authentication cookie exists
    const token = sessionStorage.getItem("user_token");

    if (token) {
      setIsAuthenticated(true);
      router.push('/dashboards/crm');
    } else {
      setIsAuthenticated(false);

     // Redirect to login page if not authenticated
    }
  }, [router ,setIsAuthenticated]);


  return (
    <div className='flex bs-full justify-center'>
      <div
        className='flex bs-full items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden'
        style={{ borderInlineEnd: settings.skin === 'bordered' ? '1px solid #ddd' : 'none' }}
      >
        <RegisterIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && <MaskImg alt='mask' src={authBackground} />}
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href={getLocalizedUrl('/login', locale)} className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-8 sm:mbs-11 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Adventure starts here 🚀</Typography>
            <Typography>Make your app management easy and fun!</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            {/* Full Name Field */}
            <CustomTextField
              autoFocus
              fullWidth
              label='Full Name'
              placeholder='Enter your full name'
              {...register('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            {/* Email Field */}
            <CustomTextField
              fullWidth
              label='Email'
              placeholder='Enter your email'
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Password Field */}
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='············'
              type={isPasswordShown ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            {/* Submit Button */}
            <Button fullWidth variant='contained' type='submit'>
              Sign Up
            </Button>

            {/* Already have an account */}
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>Already have an account?</Typography>
              <Typography component={Link} href={getLocalizedUrl('/login', locale)} color='primary.main'>
                Sign in instead
              </Typography>
            </div>
          </form>
        </div>
      </div>
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

    </div>
  )
}

export default Register
