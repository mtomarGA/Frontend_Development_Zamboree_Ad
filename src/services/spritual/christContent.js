import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/christ`


const ChristContentService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/content`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating content')
            console.error('Error creating content:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/content/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating content')
            console.error('Error updating content:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/contents`)
            return response.data
        } catch (error) {
            console.error('Error fetching contents:', error)
            toast.error(error.response?.data?.message || 'Error fetching contents')
            throw error
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/content/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching content by ID:', error)
            toast.error(error.response?.data?.message || 'Error fetching content by ID')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/content/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting content')
            console.error('Error deleting content:', error)
            throw error
        }
    }
}

export default ChristContentService
