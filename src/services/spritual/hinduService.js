import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/hindu`


const HinduService = {
    createTemple: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/temple`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating temple')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    updateTemple: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/temple/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating temple')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getAllTemple: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/temples`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getAllTempleList: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/templelist`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getTempleById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/temple/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    deleteTemple: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/temple/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting temple')
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
    verifyMobileOTP: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/verify-otp`, { mobile: values.mobile, otp: values.otp })
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
            const response = await axios.post(`${BASE_URL}/email-otp`, { email:values.email , name: values.name })
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
            const response = await axios.post(`${BASE_URL}/verify-email-otp`, { email: values.email, otp: values.otp })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error verifying email OTP')
            console.error('Error fetching data:', error)
            throw error
        }
    }
}

export default HinduService
