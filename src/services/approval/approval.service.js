import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const approvalService = {
    listingApproval: async (businessId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/approval/status/${businessId}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    allImageApprove: async (businessId, requestBody) => {
        const token = sessionStorage.getItem('user_token')
        console.log(token, "token token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'application/json'
            };
            console.log(headers, "headers headers");

            const response = await axios.put(`${BASE_URL}/admin/approval/all-image/${businessId}`, requestBody, { headers })
            console.log(response.data, "response.data");

            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    updateBusinessImageStatus: async (imageId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/approval/image-status/${imageId}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    productApproval: async (productId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/approval/product-status/${productId}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    updateProductImageStatus: async (imageId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/approval/product-image-status/${imageId}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    getSingleBusinessImages: async (businessId) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/approval/business/${businessId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching business:', error)
            throw error
        }
    },

    getPendingImageBusiness: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/approval/pending-image-business`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching product:', error)
            throw error
        }
    },

    getPendingBusiness: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/approval/pending-business`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching product:', error)
            throw error
        }
    },

    getPendingProduct: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/approval/pending-product`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching product:', error)
            throw error
        }
    },

    allPoductImageApprove: async (productId, requestBody) => {
        const token = sessionStorage.getItem('user_token')
        console.log(token, "token token");

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                // 'Content-Type': 'application/json'
            };
            console.log(headers, "headers headers");

            const response = await axios.put(`${BASE_URL}/admin/approval/all-product-image/${productId}`, requestBody, { headers })
            console.log(response.data, "response.data");

            return response.data
        } catch (error) {
            console.error('Error adding category:', error)
            throw error
        }
    },

    // approve rating
    RatingApproval: async (ratingId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/approval/rating-status/${ratingId}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error updating rating status:', error)
            throw error
        }
    }

}

export default approvalService
