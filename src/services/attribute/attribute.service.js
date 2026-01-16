import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const attributeService = {
    // ATTRIBUTE SET
    addAttributeSet: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/attribute`, requestBody, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    getAttributeSet: async () => {
        try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin/attribute`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    },

    // getSingleBlog: async id => {
    //     const token = sessionStorage.getItem('user_token')
    //     try {
    //         const headers = {
    //             Authorization: `Bearer ${token}`
    //         }
    //         const response = await axios.get(`${BASE_URL}/blog/${id}`, { headers })
    //         return response.data
    //     } catch (error) {
    //         throw error
    //     }
    // },

    updateAttributeSet: async (blogId, formData) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/attribute/${blogId}`, formData, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // updateStatus: async (id, data) => {
    //     const token = sessionStorage.getItem('user_token')
    //     try {
    //         const headers = {
    //             Authorization: `Bearer ${token}`
    //         }
    //         const response = await axios.put(`${BASE_URL}/blog/approve/${id}`, data, { headers })
    //         return response.data
    //     } catch (error) {
    //         throw error
    //     }
    // },

    deleteAttributeSet: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/attribute/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // ATTRIBUTE 
    addAttribute: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin/attribute/add`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    getAttribute: async () => {
        try {
            const token = sessionStorage.getItem('user_token');

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await axios.get(`${BASE_URL}/admin/attribute/get`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
        }
    },

    updateAttribute: async (blogId, formData) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/admin/attribute/update/${blogId}`, formData, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },

    // GET ATTRIBUTE BY ATTRIBUTE ID
    getSingleAttribute: async id => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/attribute/get/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    // GET ATTRIBUTE BY CATEGORY ID
    getAttributeByCatId: async id => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/attribute/getbyCat/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

    deleteAttribute: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/attribute/delete/${id}`, { headers })
            return response.data
        } catch (error) {
            console.log('Error adding attribute:', error);
        }
    },
}

export default attributeService
