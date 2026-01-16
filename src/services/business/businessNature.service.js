import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const businessNatureService = {
  addBusinessNature: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/business-nature/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding business nature:', error)
      throw error
    }
  },

  // return only active status records
  getBusinessNatures: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-nature/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business nature:', error)
      throw error
    }
  },

  // get all business natures including inactive
  getAllBusinessNatures: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-nature/all-nature`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business nature:', error)
      throw error
    }
  },

  getBusinessNatureById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-nature/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting business nature:', error)
      throw error
    }
  },

  updateBusinessNature: async (natureId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/business-nature/${natureId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating business nature:', error)
      throw error
    }
  },

  deleteBusinessNature: async natureId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/business-nature/${natureId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete business nature:', error)
      throw error
    }
  }
}

export default businessNatureService
