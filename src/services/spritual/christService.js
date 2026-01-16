import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/christ`


const ChristService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/temple`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating temple')
            console.error('Error creating temple:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/temple/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating temple')
            console.error('Error updating temple:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/temples`)
            return response.data
        } catch (error) {
            console.error('Error fetching temples:', error)
            toast.error(error.response?.data?.message || 'Error fetching temples')
            throw error
        }
    },
    getAllList: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/templelist`)
            return response.data
        } catch (error) {
            console.error('Error fetching temple list:', error)
            toast.error(error.response?.data?.message || 'Error fetching temple list')
            throw error
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/temple/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching temple by ID:', error)
            toast.error(error.response?.data?.message || 'Error fetching temple by ID')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/temple/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting temple')
            console.error('Error deleting temple:', error)
            throw error
        }
    },
    sendMobileOTP: async (mobile) => {
        try {
            const response = await axios.post(`${BASE_URL}/send-mobile-otp`, { mobile }, { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending mobile OTP')
            console.error('Error sending mobile OTP:', error)
            throw error
        }
    },
    verifyMobileOTP: async (value) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-mobile-otp`, { mobile: value.mobile, otp: value.otp }, { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying mobile OTP')
            console.error('Error verifying mobile OTP:', error)
            throw error
        }
    },
    sendEmailOTP: async (email) => {
        try {
            const response = await axios.post(`${BASE_URL}/send-email-otp`,  email , { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending email OTP')
            console.error('Error sending email OTP:', error)
            throw error
        }
    },
    verifyEmailOTP: async (value) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-email-otp`, { email: value.email, otp: value.otp }, { headers })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying email OTP')
            console.error('Error verifying email OTP:', error)
            throw error
        }
    }
}

export default ChristService
