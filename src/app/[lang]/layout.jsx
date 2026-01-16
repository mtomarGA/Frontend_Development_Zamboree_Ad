// Next Imports
import { headers } from 'next/headers'

// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Component Imports

// HOC Imports
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
// import { ToastContainer } from 'react-toastify'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import SetUserCheck from './SetUserCheck'
import { ToastContainer } from 'react-toastify'
import { NextAuthProvider } from '@/contexts/nextAuthProvider'


export const metadata = {
  title: 'Zamboree Techvision LLP - Connecting Brands with consumers',
  description:
    'Zamboree Techvision LLP - Connecting Brands with consumers'
}

const RootLayout = async props => {
  const params = await props.params
  const { children } = props

  // Vars
  const headersList = await headers()
  const systemMode = await getSystemMode()
  const direction = i18n.langDirection[params.lang];



  return (
    <NextAuthProvider>
      <TranslationWrapper headersList={headersList} lang={params.lang}>
        <html id='__next' lang={params.lang} dir={direction} suppressHydrationWarning>
          <body className='flex is-full min-bs-full flex-auto flex-col'>
            <SetUserCheck >
              <AuthProvider>
                <ToastContainer position='top-right' autoClose={3000} />
                <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
                {children}
              </AuthProvider>
            </SetUserCheck>
            {/* <ToastContainer position='top-right' autoClose={3000} /> */}
          </body>
        </html>
      </TranslationWrapper>
    </NextAuthProvider>
  )
}

export default RootLayout
