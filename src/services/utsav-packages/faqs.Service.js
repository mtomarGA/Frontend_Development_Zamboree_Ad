import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const faqsService = {
  createFaqs: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/user-form/createFaqs`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error creating new benefit:', error)
      throw error?.response?.data || { message: 'Something went wrong while creating the benefit' }
    }
  },
  getFaqs: async () => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/admin/user-form/getFaqs`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
  updateFaqs: async (id, requestBody) => {
    

    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.put(
        `${BASE_URL}/admin/user-form/updateFaqs/${id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating benefit:', error)
      throw error
    }
  },
  deleteFaqs: async id => {
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.delete(`${BASE_URL}/admin/user-form/deleteFaqs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting benefit:', error)
      throw error
    }
  },

  updateFaq: async (id, requestBody) => {
    
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.put(
        `${BASE_URL}/admin/user-form/updateFaqDetail/${id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating benefit:', error)
      throw error
    }
  },

}

export default faqsService
