import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL


const goalService = {
  createGoal: async values => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/goal/create-goal`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      
      toast.error(error.response?.data.message || 'Failed to create goal')
    }
  },
  getGoal: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/goals`, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error fetching live meetings:', error)
      throw error?.response?.data || { message: 'Something went wrong while fetching live meetings' }
    }
  },
  updateGoal: async (id, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(`${BASE_URL}/admin/goal/updategoal/${id}`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error?.response?.data || { message: 'Something went wrong while updating goal' }
    }
  },
  getGoalById: async Id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/getGoalById/${Id}`, {
        headers
      })

      return response.data
    } catch (error) {

    }
  },

  deleteGoal: async Id => {
    const token = sessionStorage.getItem('user_token')
    console.log('Deleting goal with token:', token) // debug

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/admin/goal/deleteGoal/${Id}`, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error?.response?.data || { message: 'Something went wrong while deleting the goal' }
    }
  },

  getFreshBusiness: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/getFreshBusiness`, {
        params: { start, end, employee },
        headers
      })

      
      

      return response.data
    } catch (error) {
      console.error('Error fetching goal:', error)
      throw error?.response?.data || { message: 'Something went wrong while fetching goal' }
    }
  },

  getUpdateBusiness: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/updatedBusiness`, {
        params: { start, end, employee },
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error fetching updated business:', error)
      throw error?.response?.data || { message: 'Something went wrong while fetching updated business' }
    }
  },

  getFreshTemple: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/getFreshTemple`, {
        params: { start, end, employee },
        headers
      })

      return response.data
    } catch (error) {
      // throw error?.response?.data || { message: 'Something went wrong while fetching fresh temple' }
    }
  },

  getGuruDwara: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/getGuruDwara`, {
        params: { start, end, employee },
        headers
      })
      console.log(response);
      

      return response.data
    } catch (error) {
      throw error?.response?.data || { message: 'Something went wrong while fetching guru dwara data' }
    }
  },

   getMosque: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/getMosque`, {
        params: { start, end, employee },
        headers
      })

      return response.data
    } catch (error) {
      throw error?.response?.data || { message: 'Something went wrong while fetching mosque data' }
    }
  },
   getPaidBannerListing: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/paidBannerListing`, {
        params: { start, end, employee },
        headers
      })

      return response.data
    } catch (error) {
      throw error?.response?.data || { message: 'Something went wrong while fetching paid Banner listing data' }
    }
  },

ConvertFreeBusinessToPaid: async ({ start, end, employee }) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/goal/ConvertFreeBusinessToPaid`, {
        params: { start, end, employee },
        headers
      })

      return response.data
    } catch (error) {
      throw error?.response?.data || { message: 'Something went wrong while fetching Convert Free Business To Paid' }
    }
  }
}
// /ConvertFreeBusinessToPaid

export default goalService
