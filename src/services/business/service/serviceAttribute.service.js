import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const serviceAttributeService = {
    // ATTRIBUTE SET
    addServiceAttributeSet: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/service-attribute`, requestBody, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getServiceAttributeSet: async () => {
        try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin/service-attribute`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    },

    updateServiceAttributeSet: async (blogId, formData) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/service-attribute/${blogId}`, formData, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteServiceAttributeSet: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/service-attribute/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // ATTRIBUTE 
    addServiceAttribute: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/service-attribute/add`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    getServiceAttribute: async () => {
        try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin/service-attribute/get`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    },

    updateServiceAttribute: async (blogId, formData) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/service-attribute/update/${blogId}`, formData, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    // GET ATTRIBUTE BY ATTRIBUTE ID
    getServiceSingleAttribute: async id => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/service-attribute/get/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // GET ATTRIBUTE BY CATEGORY ID
    getServiceAttributeByCatId: async id => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/service-attribute/getbyCat/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteServiceAttribute: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/service-attribute/delete/${id}`, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    }
}

export default serviceAttributeService
