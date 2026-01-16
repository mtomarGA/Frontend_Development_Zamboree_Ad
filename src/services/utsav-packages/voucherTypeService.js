import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const vocherType = {
    createVocher: async requestBody => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.post(`${BASE_URL}/admin/user-form/createVoucherType`, requestBody, { headers })
            return response.data
        } catch (error) {
            console.error('Error in creating new voucher:', error)
            throw error
        }
    },
    getVocher: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/user-form/getAllVoucherTypes`, { headers })
            return response.data
        } catch (error) {
            console.error('Error creating  new voucher:', error)
            throw error
        }
    },
    deleteVocher: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/admin/user-form//deleteVoucherType/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error creating  new voucher:', error)
            throw error
        }
    },
   updateVoucher: async (id, requestBody) => {
  const token = sessionStorage.getItem('user_token')
  if (!token) throw new Error('No token found')

  try {
    const response = await axios.put(`${BASE_URL}/admin/user-form/updateVoucherType/${id}`,
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

   
    throw new Error(error.response?.data?.message || 'Failed to update voucher type')
  }
}


}

export default vocherType
