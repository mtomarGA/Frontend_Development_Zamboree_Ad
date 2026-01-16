import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const AllahNameService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/allahname`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating Allah name')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/allahname/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Allah name')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/allahname`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/allahname/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting Allah name')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    updateOrder: async (order) => {
        try {
            const response = await axios.put(`${BASE_URL}/allahname/updateOrder`,order)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Allah name order')
            console.error('Error fetching data:', error)
            throw error
        }
    }
}

export default AllahNameService;
