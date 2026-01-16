import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/sikh`


const SikhFestivalService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/festival`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating festival:', error)
            toast.error(error.response?.data?.message || 'Error creating festival')
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/festival/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating festival:', error)
            toast.error(error.response?.data?.message || 'Error updating festival')
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/festivals`)
            return response.data
        } catch (error) {
            console.error('Error fetching festivals:', error)
            toast.error(error.response?.data?.message || 'Error fetching festivals')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/festival/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching festival by ID:', error)
            toast.error(error.response?.data?.message || 'Error deleting festival')
            throw error
        }
    },
}

export default SikhFestivalService
