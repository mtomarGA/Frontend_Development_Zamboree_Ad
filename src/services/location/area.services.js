import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const areaService = {
  addArea: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/location/area`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding area:', error)
      throw error
    }
  },

  // Function to get all areas with active status
  getAreas: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/area`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting area:', error)
      throw error
    }
  },

  // Function to get all areas with active and inactive status
  getAllAreas: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/all-area`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting area:', error)
      throw error
    }
  },

  // get area by city id
  getAreaById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/area/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  },

  updateArea: async (areaId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/location/area/${areaId}`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating area:', error)
      throw error
    }
  },

  getSingleArea: async areaId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/single-area/${areaId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error get single state:', error)
      throw error
    }
  },

  deleteArea: async areaId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/location/area/${areaId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  }
}

export default areaService
