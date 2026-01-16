import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const businessEnquiry = {
    getAllEnquiry: async (BusinessId) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/enquiry/${BusinessId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error getting area:', error)
            throw error
        }
    },
    getDoneEnquiry: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/enquiry/done`, { headers })
            return response.data
        } catch (error) {
            console.error('Error getting area:', error)
            throw error
        }
    },
    AllDoneEnquiry: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/enquiry/all-enq`, { headers })
            return response.data
        } catch (error) {
            console.error('Error getting area:', error)
            throw error
        }
    },
    getPendingEnquiry: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/admin/enquiry/pending`, { headers })
            return response.data
        } catch (error) {
            console.error('Error getting area:', error)
            throw error
        }
    },
    
}

export default businessEnquiry
