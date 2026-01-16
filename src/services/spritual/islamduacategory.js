import axios from 'axios'
import { get } from 'react-hook-form'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const IslamDuaCategoryService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/dua/category`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching Dua categories')
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/dua/category`, data)
            toast.success(response.data.message || 'Dua category created successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating Dua category')
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/dua/category/${id}`, data)
            toast.success(response.data.message || 'Dua category updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Dua category')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/dua/category/${id}`, {
                headers: {
                    'content-type': 'application/json'
                }
            })
            toast.success(response.data.message || 'Dua category deleted successfully')
        } catch (error) {
            console.log(error);
            
            toast.error(error.response?.data?.message || 'Error deleting Dua category')
            throw error
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/dua/category/updateOrder`, data)
            toast.success(response.data.message || 'Dua category order updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating Dua category order')
            throw error
        }
    }
};

export default IslamDuaCategoryService;
