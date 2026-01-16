import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const leaveManegmentService = {

    createLeaveApply: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/leaveManagement/createLeaveApply`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    getLeaveApply: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getleaveApply`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    updateLeaveApply: async (id, data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/leaveManagement/updateleaveApply/${id}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    deleteLeaveApply: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/leaveManagement/deleteleaveApply/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    isApprove: async (id, data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/admin/leaveManagement/approve/${id}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    getLeftLeave: async (employeeId, leaveTypeId) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(
                `${BASE_URL}/admin/leaveManagement/getLeftLeave/${employeeId}/${leaveTypeId}`,
                { headers }
            )

            return response.data
        } catch (error) {
            console.error('Error fetching leave balance:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch leave balance')
            throw error
        }
    },




}

export default leaveManegmentService
