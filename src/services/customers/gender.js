import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const createUser = {
  createGender: async (requestBody) => {

    const token = sessionStorage.getItem("user_token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.post(`${BASE_URL}/gender/`, requestBody, {
        headers,
      });

      return response.data;
    } catch (error) {
      // Log for debugging
      console.error("API Error:", error.response?.data || error.message);

      // Re-throw the original error with full Axios structure
      throw error;
    }
  },


  getGender: async () => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.get(`${BASE_URL}/gender/`, { headers })
      return response.data
    } catch (error) {
      console.error("Error creating gender:", error.response?.data || error.message);
      throw error;
    }
  },

  getAllGender: async () => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.get(`${BASE_URL}/gender/all`, { headers })
      return response.data
    } catch (error) {
      toast.error(error.response?.data.message)
      console.error("Error creating gender:", error.response?.data || error.message);
      throw error;
    }
  },

  updategender: async (data) => {
    const id = data._id
    // console.log(id)
    // console.log(data)
    const token = sessionStorage.getItem("user_token")

    // const formData = new FormData()
    // formData.append('name', data.name)
    // formData.append('status', data.status)
    try {
      const headers = {
        Authorization: `Bearer ${token}`,

      };
      const response = await axios.put(`${BASE_URL}/gender/${id}`, data, { headers })
      console.log(response)
      return response.data
    } catch (error) {
      console.error("Error creating gender:", error.response?.data || error.message);
      throw error;
    }
  },


  deleteGender: async (id) => {
    const token = sessionStorage.getItem("user_token")
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
      const response = await axios.delete(`${BASE_URL}/gender/${id}`, { headers })
      return response.data

    } catch (error) {
      // console.error("Error creating gender:", error.response?.data || error.message);
      toast.error(error.response?.data.message || error.message)
      throw error;
    }
  }


};

export default createUser;
