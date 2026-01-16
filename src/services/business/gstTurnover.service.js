import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const gstTurnoverService = {
  addGstTurnover: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/turnover/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding turnover:', error)
      throw error
    }
  },

  // return only active status records
  getGstTurnovers: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/turnover/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting turnover:', error)
      throw error
    }
  },

  // get all gst turnovers including inactive
  getAllGstTurnovers: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/turnover/all-turnover`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting turnover:', error)
      throw error
    }
  },

  updateGstTurnover: async (turnoverId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/turnover/${turnoverId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating turnover:', error)
      throw error
    }
  },

  deleteGstTurnover: async turnoverId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/turnover/${turnoverId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete turnover:', error)
      throw error
    }
  }
}

export default gstTurnoverService
