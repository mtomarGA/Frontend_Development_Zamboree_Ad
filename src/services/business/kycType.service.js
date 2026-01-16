import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const kycTypeService = {
  addKycType: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/kyc-type/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding kyc type:', error)
      throw error
    }
  },

  // return only active status records
  getKycTypes: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/kyc-type/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting kyc type:', error)
      throw error
    }
  },

  // get all kyc types including inactive
  getAllKycTypes: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/kyc-type/all-types`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting kyc type:', error)
      throw error
    }
  },

  updateKycType: async (kycId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/kyc-type/${kycId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating kyc type:', error)
      throw error
    }
  },

  deleteKycType: async kycId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/kyc-type/${kycId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete kyc type:', error)
      throw error
    }
  }
}

export default kycTypeService
