import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/follow-up`
const token = sessionStorage.getItem('user_token')
const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
}
axios.defaults.headers.common['Authorization'] = headers.Authorization

const FollowUpCallService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/call`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating follow-up')
            console.error('Error creating follow-up:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/call/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating follow-up')
            console.error('Error updating follow-up:', error)
            throw error
        }
    },
    getAll: async (paramsData) => {
        try {
            const response = await axios.get(`${BASE_URL}/call`, {
                params: { ...paramsData }
            })
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching follow-ups')
            console.error('Error fetching follow-ups:', error)
            throw error
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/call/${id}`)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching follow-up')
            console.error('Error fetching follow-up:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/call/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting follow-up')
            console.error('Error deleting follow-up:', error)
            throw error
        }
    },
}
export default FollowUpCallService;
