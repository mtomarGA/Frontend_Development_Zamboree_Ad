import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const productGroupService = {
    addProductGroup: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin/product-group/`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllProductGroup: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product-group/`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getApproveGroupByBusiness: async (businessId) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }
            const response = await axios.get(`${BASE_URL}/admin/product-group/get-group-product-approve/${businessId}`, { headers })
         
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getProductGroupById: async (docid) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product-group/${docid}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getGroupByVendorId: async (businessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product-group/get-group/${businessId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    updateProductGroup: async (docid, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/product-group/${docid}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error updating country:', error)
            throw error
        }
    },

    deleteProductGroup: async (docid) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin/product-group/${docid}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error.response?.data?.message)
            throw error
        }
    }
}

export default productGroupService
