import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const IslamMosqueService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/mosque`)
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching mosques')
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/mosque`, data)
            toast.success(response.data.message || 'Mosque created successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error creating mosque')
            throw error
        }
    },
    update: async (id,data) => {
        try {
            const response = await axios.put(`${BASE_URL}/mosque/${id}`, data)
            toast.success(response.data.message || 'Mosque updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error updating mosque')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/mosque/${id}`)
            toast.success(response.data.message || 'Mosque deleted successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error deleting mosque')
            throw error
        }
    }
}

export default IslamMosqueService
