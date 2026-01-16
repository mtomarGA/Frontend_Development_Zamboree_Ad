import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const allTicketService = {
    newTicketsCreate: async (requestBody) => {
        try {
            const token = sessionStorage.getItem('user_token');

            const response = await axios.post(`${BASE_URL}/ticket`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {

            throw error;
        }
    },


getAllTickets: async (params = {}) => {
    const token = sessionStorage.getItem('user_token')

    if (!token) {
        throw new Error('No authentication token found')
    }

    try {
        const response = await axios.get(`${BASE_URL}/ticket`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                ...params,
                global_view: true 
            }
        })

    
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tickets')
    }
},

    deleteTicket: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/ticket/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },


    updateTicket: async (ticketId, formData) => {
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

            };

            const response = await axios.put(`${BASE_URL}/ticket/${ticketId}`, formData, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }

    },

    getEmployeeList: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/ticket/employee`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },

}

export default allTicketService
