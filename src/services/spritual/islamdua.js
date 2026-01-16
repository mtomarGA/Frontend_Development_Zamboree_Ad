import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const IslamDuaService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dua`)
            return response.data
        } catch (error) {
           toast.error(error.response?.data?.message || 'Error fetching Dua')
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/dua`, data)
            toast.success(response.data.message || 'Dua created successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating Dua')
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/dua/${id}`, data)
            toast.success(response.data.message || 'Dua updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Dua')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/dua/${id}`)
            toast.success(response.data.message || 'Dua deleted successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting Dua')
            throw error
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/dua/updateOrder`, data)
            toast.success(response.data.message || 'Dua order updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Dua order')
            throw error
        }
    }
}

export default IslamDuaService
