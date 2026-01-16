import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/sikh`


const SikhService = {
    createGurudwara: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/gurudwara`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating gurudwara')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    updateGurudwara: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/gurudwara/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating gurudwara')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getAllGurudwaras: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/gurudwaras`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getAllGurudwaraList: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/gurudwaratlist`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getGurudwaraById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/gurudwara/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    deleteGurudwara: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/gurudwara/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting gurudwara')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    sendMobileOTP: async (mobile) => {
        try {
            const response = await axios.post(`${BASE_URL}/send-otp`, { mobile })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending OTP')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    verifyMobileOTP: async (value) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-otp`,  value )
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying OTP')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    sendEMailOTP: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/email-otp`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error sending email OTP')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    verifyEmailOTP: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-email-otp`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying email OTP')
            console.error('Error fetching data:', error)
            throw error
        }
    }
}

export default SikhService
