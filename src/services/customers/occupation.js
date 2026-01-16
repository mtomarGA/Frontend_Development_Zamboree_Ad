import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL

const occupation = {
  createOccupation: async (data, rowId) => {

    const token = sessionStorage.getItem('user_token');

    try {
      const headers = {
        Authorization: `Bearer ${token}`,

        // No need to manually set Content-Type for FormData
      };

      const response = await axios.post(`${BASE_URL}/occupation/`, data, {
        headers,
      });

      // console.log('Response:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error creating gender:', error.response?.data || error.message);
      throw error;
    }
  },

  getOccupation: async () => {
    const token = sessionStorage.getItem('user_token');

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${BASE_URL}/occupation/`, {
        headers,
      });

      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating gender:', error.response?.data || error.message);
      throw error;
    }
  },
  getAllOccupation: async () => {
    const token = sessionStorage.getItem('user_token');
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`${BASE_URL}/occupation/all`, {
        headers,
      });

      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },


  updateOccupation: async (data) => {
    console.log(data)
    const id = data._id
    const token = sessionStorage.getItem('user_token')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    const response = await axios.put(
      `${BASE_URL}/occupation/${id}`, // ✅ PUT request
      data, // ✅ Request body
      { headers } // ✅ Config object
    )

    return response.data
  },

  deleteOccupation: async (rowId) => {
    const token = sessionStorage.getItem('user_token');
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.delete(
        `${BASE_URL}/occupation/${rowId}`, // ✅ corrected path
        { headers }
      );

      return response.data;
    } catch (error) {
      toast.error(error.response.data.message)
    }
  },



};

export default occupation;

