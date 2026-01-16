import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const HomeCategoryService = {
    addHomeCategory: async formattedData => {
        console.log(formattedData, 'formattedDataformattedData')

        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/home-cat/create`, formattedData, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },
    removeCategory: async (name, _id) => {
        
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            // ✅ Use DELETE instead of GET for deletion
            const response = await axios.delete(
                `${BASE_URL}/home-cat/remove-cat/${name}`,
                {
                    headers,
                    params: { homeCatId:_id  }, 
                }
            );

            console.log(response.data, 'response service');
            return response.data;
        } catch (error) {
            console.error('Error removing category:', error.response?.data || error.message);
            throw error;
        }
    },

    getHomeCategory: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/home-cat/get`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },
    DeleteHomeCategory: async (name) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/home-cat/delete/${name}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    }
}

export default HomeCategoryService
