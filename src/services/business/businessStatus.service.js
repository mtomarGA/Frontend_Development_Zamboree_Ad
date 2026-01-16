import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const businessStatusService = {
  addBusinessStatus: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/business-status/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding business status:', error)
      throw error
    }
  },

  getBusinessStatuss: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-status/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business status:', error)
      throw error
    }
  },

  getAllBusinessStatuss: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-status/all-status`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business status:', error)
      throw error
    }
  },

  

  updateBusinessStatus: async (statusId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/business-status/${statusId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating business status:', error)
      throw error
    }
  },

  deleteBusinessStatus: async statusId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/business-status/${statusId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete business status:', error)
      throw error
    }
  },
  getBusinessDescription: async(data) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/admin-business/ai-description`,data, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business nature:', error)
      throw error
    }
  },
}

export default businessStatusService
