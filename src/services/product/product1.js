import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const product1Service = {
    addProduct1: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin/product1/`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllProduct1: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product/`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllProductByBusiness1: async (businessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product1/byBusinessId/${businessId}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getProductById1: async (productId) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/product1/${productId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error :', error)
            throw error
        }
    },

    updateProduct1: async (docid, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/product1/${docid}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error updating country:', error)
            throw error
        }
    },

    deleteProduct1: async (docid) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin/product/${docid}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error dalete country:', error)
            throw error
        }
    },

    updateCoverImage: async (productId, imageId) => {
        const token = sessionStorage.getItem('user_token')
        console.log(productId, imageId, 'service')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/product1/cover-image/${productId}/${imageId}`, {}, { headers })
            return response.data
        } catch (error) {
            console.error('Error :', error)
            throw error
        }
    },

    // GET ALL REJECTED PRODUCTS
    getRejectedProduct1: async (businessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product/rejected-product/${businessId}`, { headers });
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    // get prodyct by getProductByNumber
    getProductByName1: async (name) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }
            const response = await axios.get(`${BASE_URL}/admin/product/search?name=${name}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error.response?.data.errors || error.message);
            throw error
        }
    },

    // get active group of vendor
    getActiveGroupByVendorId1: async (businessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product/get-group/${businessId}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },
    checkSlug: async (businessId, data) => {
        console.log(businessId);
        console.log(data);

        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
            const response = await axios.post(`${BASE_URL}/admin/product1/check-slug/${businessId}`, data, { headers })
            return response.data
        } catch (error) {
            console.error("error in slug check", error)
            throw error
        }
    }
}

export default product1Service
