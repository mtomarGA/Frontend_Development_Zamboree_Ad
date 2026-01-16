import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const blogCategoryService = {
  addBlogCategory: async requestBody => {
    console.log('requestBody', requestBody)

    const formData = new FormData()

    formData.append('name', requestBody?.categoryName)
    formData.append('sortingNo', requestBody?.sortingNo)
    formData.append('image', requestBody?.image)
    formData.append('status', requestBody.status)

    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }

      const response = await axios.post(`${BASE_URL}/blog-category/`, formData, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      toast.error(error?.response?.data?.message)
      throw error
    }
  },

  getBlogCategory: async () => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }

      const response = await axios.get(`${BASE_URL}/blog-category/`, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },
  getActiveBlogCategory: async () => {
  const token = sessionStorage.getItem("user_token");
  const res = await axios.get(`${BASE_URL}/blog-category/active`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
},


  deleteBlogCategory: async id => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.delete(`${BASE_URL}/blog-category/${id}`, { headers })
      return response.data
    } catch (error) {
      console.log(error, 'error')
      throw error
    }
  },

  updateCategory: async (categoryId, data) => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const formData = new FormData()
      formData.append('sortingNo', data.sortingNo)
      formData.append('categoryName', data.categoryName)
      formData.append('status', data.status)
      if (data.image) {
        formData.append('image', data.image)
      }
      const response = await axios.put(`${BASE_URL}/blog-category/${categoryId}`, data, { headers })

      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default blogCategoryService
