import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const fixedleaveNameService = {

    createfixedleaveName: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/leaveManagement/createfixedleaveName`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    getfixedLeaveName: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getfixedLeaveName`,  { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    updatefixedLeaveName: async (id,data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/leaveManagement/updatefixedLeaveName/${id}`, data,  { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    deletefixedLeaveName: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/leaveManagement/deletefixedLeaveName/${id}`,   { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    
}

export default fixedleaveNameService
