// components/ProtectedRoute.tsx
'use client'
import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'

export const ProtectedRoute = ({ permission, children }) => {
  console.log('permission', permission);
  
  const { hasPermission } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('hasPermission(permission)', hasPermission(permission));
    
    if (!hasPermission(permission)) {
      router.replace('/401')
    }
  }, [permission])

  return hasPermission(permission) ? children : null
}
