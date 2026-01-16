import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const manageBusinessService = {
    addBusiness: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/admin-business/`, requestBody, { headers })
            // console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    // put business function for this route update-business
    updateBusiness: async (businessId, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin-business/update-business/${businessId}`, requestBody, { headers })
            // console.log(response.data, 'response service business update')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getAllBusiness: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin-business/`, { headers })
            // console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    businessDropdown: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin-business/business-dropdown/`, { headers })
            // console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    getBusinessByNumber: async (phone) => {
        console.log(phone, 'phone number in service')
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }
            const response = await axios.get(`${BASE_URL}/admin-business/search?phone=${phone}`, { headers })
            // console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            // console.error('Error adding bank:', error.response?.data.errors || error.message)
            toast.error(error.response?.data.errors || error.message);
            throw error
        }
    },

    // get business list by area (countryId, statId, ciryId, areaId)
    getBusinessByLocation: async (searchTerm) => {
     
        
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            };

            const response = await axios.get(
                `${BASE_URL}/admin-business/location?q=${encodeURIComponent(searchTerm)}`,
                { headers }
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching businesses by location:', error);
            throw error;
        }
    },


    getBusinessById: async (id) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin-business/${id}`, { headers })
            // console.log(response.data, 'response service')
            return response.data
        } catch (error) {
            console.error('Error adding bank:', error)
            throw error
        }
    },

    checkUrlAvailability: async url => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin-business/check-url/`, { url }, { headers })
            return response.data
        } catch (error) {
            console.error('Error checking url:', error)
            throw error
        }
    },
    checkPresonalizedURL: async (url) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
                // 'Content-Type': 'application/json'
            }

            const response = await axios.post(`${BASE_URL}/admin-business/check-pursanalized-url`, { url }, { headers })
            return response.data
        } catch (error) {
            console.error('Error checking url:', error)
            throw error
        }

    },
  

    deleteBusinss: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin-business/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error delete admin-business:', error)
            throw error
        }
    },
    addBusinessBankDetails: async (id,data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.put(`${BASE_URL}/admin-business/add-bank/${id}`,data, { headers })
            return response.data
        } catch (error) {
            console.error('Error delete admin-business:', error)
            throw error
        }
    },
    getBusinessBankDetails: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin-business/get-business-bankDetails`, { headers })
            return response.data
        } catch (error) {
            console.error('Error delete admin-business:', error)
            throw error
        }
    },
    deleteBusinessBankDetails: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.delete(`${BASE_URL}/admin-business/delete-bank/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error delete admin-business:', error)
            throw error
        }
    },

}

export default manageBusinessService
