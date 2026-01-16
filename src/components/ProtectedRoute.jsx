// components/ProtectedRoute.tsx

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log(' has permission', hasPermission(permission));
    
    if (!hasPermission(permission)) {
      router.replace('/401')
    }
  }, [permission])

  return hasPermission(permission) ? children : null
}
