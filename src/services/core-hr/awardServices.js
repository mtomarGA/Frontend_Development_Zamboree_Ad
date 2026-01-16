import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const awardServices = {

    createAward: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/core-hr/createAward`, data, { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    getAllAward: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/core-hr/getAllAward`,  { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    updateAward: async (id,data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/core-hr/updateAward/${id}`, data,  { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    deleteAward: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/core-hr/deleteAward/${id}`,   { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    
}

export default awardServices
