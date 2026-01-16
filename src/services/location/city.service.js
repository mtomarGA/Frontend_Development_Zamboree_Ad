import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const CityService = {
  addCity: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/location/city`, requestBody, { headers })

      return response.data
    } catch (error) {
      console.error('Error adding city:', error)
      throw error
    }
  },

  // Function to get all cities with active status
  getCities: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/city`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting city:', error)
      throw error
    }
  },

  // Function to get all cities with active and inactive status
  getAllCities: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/all-city`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting city:', error)
      throw error
    }
  },

  // get city by state id
  getCityById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/city/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  },

  // Get Single City Detail
  getSingleCity: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/single-city/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  },

  updateCity: async (countryId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/location/city/${countryId}`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating city:', error)
      throw error
    }
  },

  deleteCity: async cityId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/location/city/${cityId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  }
}

export default CityService
