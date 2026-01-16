import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL


const createLiveMeetingsService = {
createLiveMeeting: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/meetings/createMeeting`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error creating new meeting:', error)
      throw error?.response?.data || { message: 'Something went wrong while creating the meeting' }
    }
  },

  getLiveMeetings: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(`${BASE_URL}/admin/meetings/getMeetings`, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error fetching live meetings:', error)
      throw error?.response?.data || { message: 'Something went wrong while fetching live meetings' }
    }
  },

  updateLiveMeeting: async (meetingId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(`${BASE_URL}/admin/meetings/updateMeeting/${meetingId}`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error updating live meeting:', error)
      throw error?.response?.data || { message: 'Something went wrong while updating the meeting' }
    }
  },

  deleteLiveMeeting: async meetingId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/admin/meetings/deleteMeeting/${meetingId}`, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error deleting live meeting:', error)
      throw error?.response?.data || { message: 'Something went wrong while deleting the meeting' }
    }
  },
    }

export default createLiveMeetingsService
