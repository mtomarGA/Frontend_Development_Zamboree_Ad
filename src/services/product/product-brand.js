import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const productService = {
    addProductBrand: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin/product-brand/create-brand`, data, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    getProductBrand: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product-brand/get-brand`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    deleteProductBrand: async (_id) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin/product-brand/delete-brand/${_id}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    updateProductBrand: async (_id, data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/product-brand/update-brand/${_id}`, data, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            // toast.success(error.response?.data?.message)
            throw error
        }
    },
    getBRandByCategoryId: async (Id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product-brand/get-brand/${Id}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            // toast.success(error.response?.data?.message)
            throw error
        }
    }
}


export default productService
