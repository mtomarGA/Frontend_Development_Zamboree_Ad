import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const discountCode = {

  createDiscount: async requestBody => {
    try {
      const token = sessionStorage.getItem('user_token')

      const response = await axios.post(`${BASE_URL}/admin/user-form/createDiscount`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (error) {
      throw error
    }
  },


   getDiscount: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/user-form/getAllDiscount`, { headers })
            return response.data
        } catch (error) {
            console.error('Error creating  new voucher:', error)
            throw error
        }
    },
    deleteDiscount: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/user-form/deleteDiscount/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error creating  new voucher:', error)
            throw error
        }
    },
       updateDiscount: async (id, requestBody) => {
  const token = sessionStorage.getItem('user_token')
  if (!token) throw new Error('No token found')

  try {
    const response = await axios.put(`${BASE_URL}/admin/user-form/updateDiscount/${id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {

    console.log('Update voucher failed:', error.response?.data)

   
    throw new Error(error.response?.data?.message || 'Failed to update voucher type')
  }
}
    




}

export default discountCode
