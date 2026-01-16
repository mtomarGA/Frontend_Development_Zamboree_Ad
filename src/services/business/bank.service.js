import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const bankService = {
  addBank: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/bank/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding bank:', error)
      throw error
    }
  },

  // return only active status records
  getBanks: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/bank/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting bank:', error)
      throw error
    }
  },

  // return active and inactive records
  getAllBanks: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/bank/all-bank`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting bank:', error)
      throw error
    }
  },

  updateBank: async (bankId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/bank/${bankId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating bank:', error)
      throw error
    }
  },

  deleteBank: async bankId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/bank/${bankId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete bankId:', error)
      throw error
    }
  }
}

export default bankService
