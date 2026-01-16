import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const countryService = {
  addCountry: async requestBody => {
    const token = sessionStorage.getItem('user_token')
    console.log(requestBody, 'requestBody requestBody')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/location/country`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding country:', error)
      throw error
    }
  },

  // Function to get all countries with active status
  getCountries: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/country`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting country:', error)
      throw error
    }
  },

  // Function to get  countries with both status
  getAllCountries: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/all-country/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting country:', error)
      throw error
    }
  },

  updateCountry: async (countryId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/location/country/${countryId}`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating country:', error)
      throw error
    }
  },

  deleteCountry: async (countryId) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/location/country/${countryId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete country:', error)
      throw error
    }
  }
}

export default countryService
