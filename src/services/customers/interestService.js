import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL;

const interest = {
  createInterest: async (data) => {
    const token = sessionStorage.getItem("user_token");
    try {

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      }
      const response = await axios.post(`${BASE_URL}/interest/`, data, { headers })
      return response.data

    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);

      // Re-throw the original error with full Axios structure
      throw error;
    }
  },

  getInterest: async () => {

    const token = sessionStorage.getItem("user_token");

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const response = await axios.get(`${BASE_URL}/interest/`, { headers })
      return response.data
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);

      // Re-throw the original error with full Axios structure
      throw error;
    }

  },
  getAllInterest: async () => {

    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }

      const response = await axios.get(`${BASE_URL}/interest/all`, { headers })
      return response.data
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  },

  deleteInterest: async (id) => {
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }


      const response = await axios.delete(`${BASE_URL}/interest/${id}`, { headers })
      return response.data

    } catch (error) {
      toast.error(error.response.data.message)
      // Re-throw the original error with full Axios structure
      throw error;
    }
  },

  updateInterest: async (data) => {
    const id = data._id
    const token = sessionStorage.getItem("user_token");
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      }
      const response = await axios.put(`${BASE_URL}/interest/${id}`, data, { headers })

      return response.data

    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      // Re-throw the original error with full Axios structure
      throw error;
    }
  }



}

export default interest
