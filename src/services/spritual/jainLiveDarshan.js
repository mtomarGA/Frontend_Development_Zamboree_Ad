import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/jain`


const JainLiveDarshanService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/livedarshan`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating live darshan')
            console.error('Error creating live darshan:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/livedarshan/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating live darshan')
            console.error('Error updating live darshan:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/livedarshans`)
            return response.data
        } catch (error) {
            console.error('Error fetching live darshans:', error)
            toast.error(error.response?.data?.message || 'Error fetching live darshans')
            throw error
        }
    },
    getById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/livedarshan/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching live darshan by ID:', error)
            toast.error(error.response?.data?.message || 'Error fetching live darshan by ID')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/livedarshan/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting live darshan')
            console.error('Error deleting live darshan:', error)
            throw error
        }
    }
}

export default JainLiveDarshanService
