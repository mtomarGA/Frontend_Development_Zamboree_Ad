import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const roleService = {
  getRoles: async () => {

    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      // Send the POST request with the request body
      const response = await axios.get(`${BASE_URL}/role/get-role`, { headers })
      console.log('Response:', response.data);
      

      return response.data
    } catch (error) {
      console.error('Error fetching data:', error)
      throw error
    }
  }
}

export default roleService
