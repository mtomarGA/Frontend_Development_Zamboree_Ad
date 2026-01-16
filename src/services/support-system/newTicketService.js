import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const ticketService = {
    newTicketsCreate: async requestBody => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
                
            }

            const response = await axios.post(`${BASE_URL}/ticket`, requestBody, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },
}

export default ticketService
