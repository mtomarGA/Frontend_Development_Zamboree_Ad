import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const subCategoryService = {
  addSubCategory: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.post(`${BASE_URL}/business-category/subcategory`, requestBody, { headers })
      return response.data
    } catch (error) {
      console.error('Error adding sub category:', error)
      throw error
    }
  },

  // return only active status records
  getSubCategories: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/subcategories`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting sub category:', error)
      throw error
    }
  },

  // get all sub categories including inactive
  getAllSubCategory: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/all-subcategory`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting sub category:', error)
      throw error
    }
  },

  getSubCategoryById: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/subcategoryById/${id}`, { headers })
      console.log(response)
      return response.data

    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  },

  getByCategoryId: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.get(`${BASE_URL}/business-category/bycategoryId/${id}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  },

  updateSubCategory: async (subCategoryId, requestBody) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
        // 'Content-Type': 'application/json'
      }

      const response = await axios.put(`${BASE_URL}/business-category/subcategory/${subCategoryId}`, requestBody, {
        headers
      })
      return response.data
    } catch (error) {
      console.error('Error updating sub category:', error)
      throw error
    }
  },

  deleteSubCategory: async subCategoryId => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }

      const response = await axios.delete(`${BASE_URL}/business-category/subcategory/${subCategoryId}`, { headers })
      return response.data
    } catch (error) {
      console.error('Error dalete sub category:', error)
      throw error
    }
  }
}

export default subCategoryService
