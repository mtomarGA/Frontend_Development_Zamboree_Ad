import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const leaveSetupService = {

    createLeaveSetup: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/leaveManagement/createLeaveSetup`, data, { headers })
            toast.success(response?.data?.message)
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')

        }
    },

    getAllLeaveSetups: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getAllLeaveSetups`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
        }
    },

    updateLeaveSetup: async (id, data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/leaveManagement/updateLeaveSetup/${id}`, data, { headers })
            toast.success(response?.data?.message)
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
        }
    },
    getLeaveSetupById: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getLeaveSetupById/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching leave setup:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch leave setup')
        }
    },
    deleteLeaveSetup: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/leaveManagement/deleteLeaveSetup/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
        }
    },


}

export default leaveSetupService
