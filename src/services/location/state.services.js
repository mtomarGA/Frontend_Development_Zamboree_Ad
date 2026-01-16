import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const stateService = {
  addState: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }

      const response = await axios.post(`${BASE_URL}/location/state`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding state:', error)
      throw error
    }
  },

  getStates: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/state`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting state:', error)
      throw error
    }
  },

  allStateGet: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/all-state`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting state:', error)
      throw error
    }
  },



  getIndiaState: async () => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/state-india`, { headers })
      return response.data
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },

  // get States By Country Id
  getStateById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/state/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  },

  // Get Single State
  getSingleState: async id => {
    const token = sessionStorage.getItem('user_token')
    console.log(id, "service id id id");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/location/single-state/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  },

  updateState: async (stateId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/location/state/${stateId}`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating state:', error)
      throw error
    }
  },

  deleteState: async stateId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/location/state/${stateId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete state:', error)
      throw error
    }
  }
}

export default stateService
