// Component Imports
import AuthRedirect from '@/components/AuthRedirect'
import {auth} from '@/libs/auth'

export default async function AuthGuard({ children, locale }) {
  const session = await auth()
  

  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}
