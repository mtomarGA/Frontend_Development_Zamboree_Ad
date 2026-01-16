import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const productCategoryService = {
    addProductCategory: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/category/`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllProductCategory: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/category/`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    updateProductCategory: async (docid, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/category/${docid}`, requestBody, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    deleteProductCategory: async docid => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin/category/${docid}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    searchCategory: async (query) => {
        const token = sessionStorage.getItem('user_token'); // Get token from session storage

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/admin/category/search`, {
                headers,
                params: {
                    name: query
                }
            });

            // console.log(response.data, 'response service searchCategory');
            return response.data; // This will return { data: [...categories], message: "..." }
        } catch (error) {
            console.error('Error searching categories:', error);
            throw error; // Re-throw the error for the calling component to handle
        }
    },

    getCategoryById: async (docid) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/category/${docid}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },
    searchCategorys: async (search) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/category/search-cat/${search}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    }
}

export default productCategoryService
