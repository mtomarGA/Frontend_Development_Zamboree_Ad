import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const HSNCodeService = {
    addHSNCode: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin/hsn-code/create-hsn`, data, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    getHSNCode: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/hsn-code/get-hsn-code`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    updateHSNCode: async (_id, data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin/hsn-code/update-hsn/${_id}`, data, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    deleteHSNCode: async (_id) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }
            const response = await axios.delete(`${BASE_URL}/admin/hsn-code/delete-hsn/${_id}`, { headers })
            console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            toast.success(error.response?.data?.message)
            throw error
        }
    },
    searchHSNCode: async (searchTerm) => {
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(`${BASE_URL}/admin/hsn-code/search`, {
                headers,
                params: { search: searchTerm }  // <-- dynamically sending query
            });

            console.log(response.data, 'response service');
            return response.data;
        } catch (error) {
            console.error('Error fetching HSN code:', error);
            toast.error(error.response?.data?.message); // use error instead of success
            throw error;
        }
    }

}


export default HSNCodeService
