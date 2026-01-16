"use client"
import AuthService from '@/services/authService'
import { useSession } from 'next-auth/react'
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export const flattenPermissions = (permissionsObj) => {

  const set = new Set()
  for (const [resource, actions] of Object.entries(permissionsObj || {})) {
    actions.forEach(action => set.add(`${resource}:${action}`))
  }
  return set
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const { data, status } = useSession()
  const [permissions, setPermissions] = useState(new Set())

  const hasPermission = (key) => {

    if (data?.user?.userType === "ADMIN") {
      return true
    }

    return permissions.has(key)
  }
  // In AuthContext.jsx
  const [isLoading, setIsLoading] = useState(false)

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const response = await AuthService.getUser()
      setUser(response.data)

      setPermissions(flattenPermissions(response?.data?.role?.permissions))
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (status === "authenticated") {
      sessionStorage.setItem("user_token", data?.accessToken)
      // setUser(data?.user)
      // setPermissions(flattenPermissions(data?.user?.role?.permissions))
      fetchUser()
    }
  }, [status,data])


  return (
    <AuthContext.Provider value={{
      user: user,
      access_token: data?.accessToken,
      permissions: permissions,
      hasPermission,
      fetchUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthContext must be used within an AuthContextProvider');
  }
  return context;
};
