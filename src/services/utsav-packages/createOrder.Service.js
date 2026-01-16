import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const createUtsavService = {
  createOrder: async requestBody => {
    const token = sessionStorage.getItem('user_token')

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }

      const response = await axios.post(`${BASE_URL}/admin/user-form/createOrder`, requestBody, {
        headers
      })

      return response.data
    } catch (error) {
      console.error('Error creating new utsav:', error)
      throw error?.response?.data || { message: 'Something went wrong while creating the order' }
    }
  },
  getAllOrder: async (memberShipCall = false) => {
    const token = sessionStorage.getItem('user_token')
    try {
      const headers = {   
        Authorization: `Bearer ${token}`
      }
      const response = await axios.get(`${BASE_URL}/admin/user-form/getAllOrder`, { headers, params: { memberShipCall } })
      return response.data
    } catch (error) {
      console.error('Error creating  new voucher:', error)
      throw error
    }
  },
  updateOrder: async (id, requestBody) => {
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.put(
        `${BASE_URL}/admin/user-form/updateOrder/${id}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating package:', error)
      throw error
    }
  },
  deleteOrder: async id => {
    const token = sessionStorage.getItem('user_token')
    if (!token) throw new Error('No token found')

    try {
      const response = await axios.delete(`${BASE_URL}/admin/user-form/deleteOrder/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting package:', error)
      throw error
    }
  }

}

export default createUtsavService
