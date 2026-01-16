import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const workShiftService = {
  addWorkShift: async requestBody => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/create`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  
  getWorkShift: async (params = {}) => {
    const token = sessionStorage.getItem('user_token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const response = await axios.get(`${BASE_URL}/admin/attendance/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          ...params,
          global_view: true
        }
      })

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch work shifts')
    }
  },

  getSingleWorkShift: async id => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/get/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateShift: async (id, formData) => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.put(`${BASE_URL}/admin/attendance/updateShift/${id}`, formData, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
deleteShift: async id => {
  const token = sessionStorage.getItem('user_token')
  try {
    // const headers = { Authorization: `Bearer ${token}` }
    const response = await axios.delete(`${BASE_URL}/admin/attendance/deleteShift/${id}`)
    return response.data
  } catch (error) {
    // Throw a clean error message so frontend can show proper toast
    throw error.response?.data || error
  }
}

}

export default workShiftService
