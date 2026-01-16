import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/bug`

const BugService = {
    
    getAllBugs: async () => {
        try {
            const response = await axios.get(`${BASE_URL}`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    addBug: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}`, values)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error adding bug')
            throw error
        }
    },
    updateBug: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, values)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error updating bug')
            throw error
        }
    },
    deleteBug: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error deleting bug')
            throw error
        }
    },
    bulkDelete: async (ids) => {
        try {
            const response = await axios.delete(`${BASE_URL}/bulk-delete`, { data: { ids } })
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error deleting bugs')
            throw error
        }
    },
    getAllBugCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/categories`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error fetching bug categories')
            throw error
        }
    },
    getAllMasterBugCategories: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/master/categories`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error fetching master bug categories')
            throw error
        }
    },
    createBugCategory: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/category`, values)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error creating bug category')
            throw error
        }
    },
    updateBugCategory: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/category/${id}`, values)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error updating bug category')
            throw error
        }
    },
    deleteBugCategory: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/category/${id}`)
             toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data?.message || 'Error deleting bug category')
            throw error
        }
    }
}

export default BugService
