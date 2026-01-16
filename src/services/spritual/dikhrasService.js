import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`



const DikhrasService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/dikhras`, values, { headers:{
                'Content-Type': 'multipart/form-data',
            } })
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating dikhras')
            console.error('Error fetching data:', error)
            throw error
        }
    },

    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/dikhras/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating dikhras')
            console.error('Error fetching data:', error)
            throw error
        }
    },

    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dikhras`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/dikhras/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting dikhras')
            console.error('Error fetching data:', error)
            throw error
        }
    },
    updateOrder:async (values) => {
        try {
            const response = await axios.put(`${BASE_URL}/dikhras/updateOrder`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating dikhras order')
            console.error('Error fetching data:', error)
            throw error
        }
    }
}

export default DikhrasService
