import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const createUtsavPackage = {
  createPackage: async requestBody => {
    try {
      const token = sessionStorage.getItem('user_token')

      const response = await axios.post(`${BASE_URL}/admin/user-form/createPackage`, requestBody, {
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
  getPackage: async () => {
  const token = sessionStorage.getItem('user_token')
  if (!token) throw new Error('No token found')

  try {
    const response = await axios.get(`${BASE_URL}/admin/user-form/getPackage`, {
    
      
      headers: { Authorization: `Bearer ${token}` }
    })
      console.log(response);

    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch packages")
  }
},
deletePackage: async (id) => {
  const token = sessionStorage.getItem('user_token')
  if (!token) throw new Error('No token found')

  try {
    const response = await axios.delete(`${BASE_URL}/admin/user-form/deletePackage/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete package")
  }
},


updatePackage: async (id, requestBody) => {
  const token = sessionStorage.getItem('user_token')
  if (!token) throw new Error('No token found')

  try {
    const response = await axios.put(
      `${BASE_URL}/admin/user-form/updatePackage/${id}`,
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
    

   
    throw new Error(error.response?.data?.message || "Failed to update package")
  }
}



}

export default createUtsavPackage
