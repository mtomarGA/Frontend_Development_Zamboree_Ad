import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const categoryService = {
  addCategory: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/business-category/category`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  getCategories: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/categories`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  },

  // get all categories including inactive
  getAllCategory: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/all-category`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  },

  getCategoryById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/categoryById/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  },

  updateCategory: async (categoryId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/business-category/category/${categoryId}`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  deleteCategory: async categoryId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/business-category/category/${categoryId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete category:', error)
      throw error
    }
  }
}

export default categoryService
