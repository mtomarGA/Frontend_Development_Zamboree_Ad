import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const blogTagService = {
  addBlogTag: async requestBody => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.post(`${BASE_URL}/blog-tag/`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },
  getBlogTag: async () => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/blog-tag/`, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },

  getSingleBlogtag: async id => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.put(`${BASE_URL}/blog-tag/${id}`, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },

  deleteBlogTag: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/blog-tag/${id}`, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },

  updateTag: async (tagId, categoryUpdateData) => {
    // Handle both object and string formats
    const tagName = typeof categoryUpdateData === 'string'
      ? categoryUpdateData
      : categoryUpdateData.name

    const data = {
      name: tagName
    }

    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/blog-tag/${tagId}`, data, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating tags:', error.response?.data || error.message)
      throw error
    }
  }
}

export default blogTagService
