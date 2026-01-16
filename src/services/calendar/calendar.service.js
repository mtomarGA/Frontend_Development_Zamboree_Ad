import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const calendarService = {
  createEvent: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
       
      }

      const response = await axios.post(`${BASE_URL}/admin/calender-event/create`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding event:', error)
      throw error
    }
  },

   deleteEvent: async id => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.delete(`${BASE_URL}/admin/calender-event/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },


  updateEvent: async (id, data) => {
    const token = sessionStorage.getItem('user_token');

    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await axios.put(`${BASE_URL}/admin/calender-event/update/${id}`, data, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

    getAllEvents: async () => {
        const token = sessionStorage.getItem('user_token')
    
        if (!token) {
        throw new Error('No authentication token found')
        }
    
        try {
        const headers = {
            Authorization: `Bearer ${token}`
        }
    
        const response = await axios.get(`${BASE_URL}/admin/calender-event/getAll`, { headers })
        return response.data
        } catch (error) {
        console.error('Error fetching events:', error)
        throw error
        }
    },

  getEventById: async (id) => {
    const token = sessionStorage.getItem('user_token')

    if (!token) {
      throw new Error('No authentication token found')
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/calender-event/getById/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error fetching event by ID:', error)
      throw error
    }
  },
}

export default calendarService
