import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const blogService = {
  addBlog: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/blog`, requestBody, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },


  getBlog: async () => {
    try {
      // Get token from sessionStorage
      const token = sessionStorage.getItem('user_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${BASE_URL}/blog`, { headers });
      
      // Check if response has the expected structure
      if (response.data && response.data.data) {
        return response.data; // Return the full response with success status
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 'Server error occurred';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Network error - please check your connection');
      } else {
        // Other errors
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  },



  getSingleBlog: async id => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/blog/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateBlog: async (blogId, formData) => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(`${BASE_URL}/blog/${blogId}`, formData, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateStatus: async (id, data) => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.put(`${BASE_URL}/blog/approve/${id}`, data, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteBlog: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/blog/${id}`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default blogService
