import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/employee`

import { toast } from 'react-toastify'

const DocumentTypeService = {
  create: async values => {
    try {
      const response = await axios.post(`${BASE_URL}/documenttype`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    }
  },
  get: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/documenttype`)
      // toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    }
  },
  getMaster: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/master/documenttype`)
      // toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    }
  },
  update: async (id, values) => {
    try {
      const response = await axios.put(`${BASE_URL}/documenttype/${id}`, values)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    }
  },
  delete: async id => {
    try {
      const response = await axios.delete(`${BASE_URL}/documenttype/${id}`)
      toast.success(response.data.message)
      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error(error.response.data.message)
    }
  }
}

export default DocumentTypeService
