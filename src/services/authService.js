import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const AuthService = {
  login: async requestBody => {
    try {
      // Send the POST request with the request body
      const response = await axios.post(`${BASE_URL}/users/login`, requestBody)
      // toast.success(response.data.message || 'Login successful!')
      return response.data
    } catch (error) {
      // toast.error(error.response?.data?.message || 'Login failed. Please try again.')
      console.error('Error fetching data:', error)
      throw error
    }
  },

  register: async values => {
    // const requestData = search ? { ...values, referral_id: search } : values;

    try {
      // Send the POST request with the request body
      const response = await axios.post(`${BASE_URL}/users/register`, values)

      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  },
  getUser: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/users/user`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('user_token') || token}`,
          // Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching user data.')
      //clear session storage if token is invalid
      if (error.response?.status === 401) {
        sessionStorage.removeItem('user_token')
        localStorage.removeItem('user_token')
        window.location.href = '/login'
      }
      console.error('Error fetching user data:', error)
      throw error
    }
  },
  logoutUser: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/logout`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error fetching user data:', error)
      throw error
    }
  },
  updateProfile:async (data) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/user`, data, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('user_token')}`,
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export default AuthService
