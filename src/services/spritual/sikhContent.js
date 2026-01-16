import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/sikh/content`


const sikhContentService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating content:', error)
            toast.error(error.response?.data?.message || 'Error creating content')
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating content:', error)
            toast.error(error.response?.data?.message || 'Error updating content')
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}`)
            return response.data
        } catch (error) {
            console.error('Error fetching contents:', error)
            toast.error(error.response?.data?.message || 'Error fetching contents')
            throw error
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching setting by ID:', error)
            toast.error(error.response?.data?.message || 'Error fetching content by ID')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error deleting content by ID:', error)
            toast.error(error.response?.data?.message || 'Error deleting content by ID')
            throw error
        }
    },
}

export default sikhContentService;
