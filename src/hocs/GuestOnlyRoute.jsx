// Next Imports
import { redirect } from 'next/navigation'

// Third-party Imports
import {auth} from '@/libs/auth'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const GuestOnlyRoute = async ({ children, lang }) => {
  const session = await auth()

  if (session) {
    console.log('User is authenticated, redirecting to home page via  GuestOnlyRoute');
    
    redirect(getLocalizedUrl(themeConfig.homePageUrl, lang))
  }

  return <>{children}</>
}

export default GuestOnlyRoute
