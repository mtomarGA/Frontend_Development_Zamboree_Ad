import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const employeeNoService = {
  addEmpoyeeNo: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/emp-number/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding employee no:', error)
      throw error
    }
  },

  getEmpoyeeNos: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/emp-number/`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting employee no:', error)
      throw error
    }
  },

  getAllEmpoyeeNos: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/emp-number/all-numbers`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting employee no:', error)
      throw error
    }
  },

  updateEmpoyeeNo: async (empId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/emp-number/${empId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating Employee number:', error)
      throw error
    }
  },

  deleteEmpoyeeNo: async empId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/emp-number/${empId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error delete employee no:', error)
      throw error
    }
  }
}

export default employeeNoService
