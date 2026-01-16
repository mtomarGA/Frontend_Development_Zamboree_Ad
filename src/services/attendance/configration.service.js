import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const configService = {
  // CREATE CONFIG

addConfig: async requestBody => {
    // const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/createConfig`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getConfig: async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/getConfigration`, { headers })
      return response.data
    } catch (error) {}
  },

   updateConfig: async (formData) => {
    // const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
       'Content-Type': 'application/json'
      }
      const response = await axios.put(`${BASE_URL}/admin/attendance/updateConfig`, formData, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
  // UPDATE CONFIG
 }

export default configService
