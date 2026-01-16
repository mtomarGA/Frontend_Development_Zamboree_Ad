import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/employee`


const DesignationService = {
  create: async values => {
    try {
      const response = await axios.post(`${BASE_URL}/designation`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
      // throw error
    }
  },
  get: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/designation`)
      // toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
      // throw error
    }
  },
  getMaster: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/master/designation`)
      // toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
      // throw error
    }
  },
  update: async (id, values) => {
    try {
      const response = await axios.put(`${BASE_URL}/designation/${id}`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
      // throw error
    }
  },
  delete: async id => {
    try {
      const response = await axios.delete(`${BASE_URL}/designation/${id}`)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
      // throw error
    }
  }
}

export default DesignationService
