import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const manageHolidaysServices = {

    createHolidays: async (data) => {
            const token = sessionStorage.getItem('user_token')
    
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                }
    
                const response = await axios.post(`${BASE_URL}/admin/leaveManagement/createHolidays`, data, { headers })
                return response.data
            } catch (error) {
                console.error('Error adding reaction:', error)
                toast.error(error?.response?.data?.message || 'Failed to add reaction')
                throw error
            }
        },

    getAllHolidays: async () => {
            const token = sessionStorage.getItem('user_token')
    
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                }
    
                const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getAllHolidays`, { headers })
                return response.data
            } catch (error) {
                console.error('Error adding reaction:', error)
                toast.error(error?.response?.data?.message || 'Failed to add reaction')
                throw error
            }
        },

    updateHoliday: async (id, data) => {
            const token = sessionStorage.getItem('user_token')
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                }
                const response = await axios.put(`${BASE_URL}/admin/leaveManagement/updateHoliday/${id}`, data, { headers })
                return response.data
            } catch (error) {
                console.error('Error adding reaction:', error)
                toast.error(error?.response?.data?.message || 'Failed to add reaction')
                throw error
            }
        },
    deleteHoliday: async (id) => {
            const token = sessionStorage.getItem('user_token')
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                }
                const response = await axios.delete(`${BASE_URL}/admin/leaveManagement/deleteHoliday/${id}`, { headers })
                return response.data
            } catch (error) {
                console.error('Error adding reaction:', error)
                toast.error(error?.response?.data?.message || 'Failed to add reaction')
                throw error
            }
        },
}

export default manageHolidaysServices
