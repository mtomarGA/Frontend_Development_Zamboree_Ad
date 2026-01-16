import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const benefitsService = {
  createBenefits: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/user-form/createBenefit`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error creating new benefit:', error)
      throw error?.response?.data || { message: 'Something went wrong while creating the benefit' }
    }
  },
  getBenefits: async () => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/admin/user-form/getBenefits`, { headers })
      return response.data
    } catch (error) {
      throw error
    }
  },
  updateBenefits: async (id, requestBody) => {
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.put(
        `${BASE_URL}/admin/user-form/updateBenefit/${id}`,
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
  deleteBenefits: async id => {
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.delete(`${BASE_URL}/admin/user-form/deleteBenefit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting benefit:', error)
      throw error
    }
  }

}

export default benefitsService
