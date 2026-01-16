import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL

const maritalStatus = {

    createMaritalStatus: async (data) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/marital-status/`, data, { headers });
            return response.data;

        } catch (error) {
            console.error('Error creating marital status:', error.response?.data || error.message);

            // Add this for better error message access in the frontend
            throw new Error(error.response?.data?.message || "Failed to create marital status");
        }

    },


    getMaritalStatus: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                // No need to manually set Content-Type for FormData
            }

            const response = await axios.get(`${BASE_URL}/marital-status/`,
                { headers }
            )

            return response.data
        } catch (error) {
            console.error('Error creating gender:', error.response?.data || error.message);
            throw error;
        }
    },

    getStatusMarital: async () => {
        const token = sessionStorage.getItem("user_token")
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            }
            const response = await axios.get(`${BASE_URL}/marital-status/status`,{ headers })
            return response.data
        } catch (error) {
            console.error('Error creating gender:', error.response?.data || error.message);
            throw error;
        }
    },

    updateMaritalStatus: async (data) => {
        const id = data._id

        const token = sessionStorage.getItem("user_token")
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            }

            const response = await axios.put(`${BASE_URL}/marital-status/${id}`, data, { headers })
            return response.data

        } catch (error) {
            console.error('Error creating gender:', error.response?.data || error.message);
            throw error;
        }
    },


    deleteMaritalStatus: async (rowId) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/marital-status/${rowId}`, { headers })
            return response.data
        } catch (error) {
            // console.error('Error creating gender:', error.response?.data || error.message);
            toast.error(error.response?.data.message || error.message)
            throw error;
        }
    }



}

export default maritalStatus
