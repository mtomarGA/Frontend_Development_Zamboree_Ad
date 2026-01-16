
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.NEXT_PUBLIC_URL

const adminService = {
  addAdmin: async (requestBody) => {
    const token = sessionStorage.getItem("user_token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Send the POST request with the request body
      const response = await axios.post(`${BASE_URL}/users/admin/register`, requestBody, { headers });


      return response.data;

    } catch (error) {
      console.error('Error fetching data:', error);
      
      throw error;
    }
  },

  getAdmins: async () => {
    const token = sessionStorage.getItem("user_token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Send the POST request with the request body
      const response = await axios.get(`${BASE_URL}/users/admin/getAdmin`, { headers });


      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },





}

export default adminService;
