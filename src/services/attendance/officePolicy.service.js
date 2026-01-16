import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const officePolicyService = {

  addPolicy: async requestBody => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/admin/attendance/createPolicy`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getPolicy: async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/getAllPolicies`, { headers })
      return response.data
    } catch (error) {}
  },

  policysGet: async () => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      }
      const response = await axios.get(`${BASE_URL}/admin/attendance/getpolicies`, { headers })
      return response.data
    } catch (error) {}
  },

   updatePolicy: async (id, data) => {
  try {
    const headers = { 'Content-Type': 'application/json' }
    const response = await axios.put(
      `${BASE_URL}/admin/attendance/updatePolicy/${id}`,
      data,
      { headers }
    )
    return response.data
  } catch (error) {
    throw error
  }
},

  deletePolicy: async (id) => {
    try { 
      const headers = {
       'Content-Type': 'application/json'
      }
      const response = await axios.delete(`${BASE_URL}/admin/attendance/deletePolicy/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  }

}

export default officePolicyService
