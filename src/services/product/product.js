import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const productService = {
    addProduct: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin/product/`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllProduct: async () => {
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

    getAllProductByBusiness: async (businessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/product/byBusinessId/${businessId}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getProductById: async (productId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/product/${productId}`, { headers })
            console.log(response.data, 'ffffffffffffffffff')
            return response.data
        } catch (error) {
            console.error('Error :', error)
            throw error
        }
    },

    updateProduct: async (docid, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/product/${docid}`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error updating country:', error)
            throw error
        }
    },

    deleteProduct: async (businessId, docid) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.delete(
                `${BASE_URL}/admin/product1/${docid}`, // docid in URL path
                {
                    headers,
                    params: { businessId } // businessId as query param
                }
            )
            return response.data
        } catch (error) {
            console.error('Error delete product:', error)
            throw error
        }
    },


    // GET ALL REJECTED PRODUCTS
    getRejectedProduct: async (businessId) => {
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
    getProductByName: async (name) => {
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
    getActiveGroupByVendorId: async (businessId) => {
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
}

export default productService
