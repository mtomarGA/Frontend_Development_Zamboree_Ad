import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL


const ListingPackage = {
    post: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/listing-package/`, requestBody, {
                headers
            })

            return response.data
        } catch (error) {
            console.error('Error creating new meeting:', error)
            throw error?.response?.data || { message: 'Something went wrong while creating the meeting' }
        }
    },

    get: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/listing-package/`, {
                headers
            })

            return response.data
        } catch (error) {
            console.error('Error fetching live meetings:', error)
            throw error?.response?.data || { message: 'Something went wrong while fetching live meetings' }
        }
    },

    update: async (Id, requestBody) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/listing-package/${Id}`, requestBody, {
                headers
            })

            return response.data
        } catch (error) {
            console.error('Error updating live meeting:', error)
            throw error?.response?.data || { message: 'Something went wrong while updating the meeting' }
        }
    },

    delete: async Id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/listing-package/${Id}`, {
                headers
            })

            return response.data
        } catch (error) {
            console.error('Error deleting live meeting:', error)
            throw error?.response?.data || { message: 'Something went wrong while deleting the meeting' }
        }
    },

    getTransaction: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/listing-package/trans`, {
                headers
            })

            return response.data
        } catch (error) {
            // console.error('Error fetching live meetings:', error)
            return error.response.data
        }
    },

    deleteTrans: async Id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/listing-package/trans/${Id}`, {
                headers
            })

            return response.data
        } catch (error) {
            console.error('Error deleting live meeting:', error)
            throw error?.response?.data || { message: 'Something went wrong while deleting the meeting' }
        }
    },

}

export default ListingPackage
