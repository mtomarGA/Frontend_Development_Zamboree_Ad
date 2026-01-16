import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam/reciter`


const IslamReciterService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating reciter:', error)
            toast.error(error.response?.data?.message || 'Error creating reciter')
        }
    },
    getall: async () => {
        try {
            const response = await axios.get(`${BASE_URL}`)
            return response.data
        } catch (error) {
            console.error('Error fetching reciters:', error)
            toast.error(error.response?.data?.message || 'Error fetching reciters')
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating reciter:', error)
            toast.error(error.response?.data?.message || 'Error updating reciter')
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error deleting reciter:', error)
            toast.error(error.response?.data?.message || 'Error deleting reciter')
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/updateorder`,data)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating reciter order:', error)
            toast.error(error.response?.data?.message || 'Error updating reciter order')
        }
    }
}
export default IslamReciterService
