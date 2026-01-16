import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_URL


const predefinedReply = {
    createReply: async (data) => {
        try {
            const token = sessionStorage.getItem('user_token');

            const response = await axios.post(`${BASE_URL}/ticket/reply`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error creating new ticket:', error);
            throw error;
        }
    },

    getReplies: async (params = {}) => {
        try {
            const token = sessionStorage.getItem("user_token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.get(`${BASE_URL}/ticket/reply`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params, 
            });

          
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Session expired. Please loged in again.");
            }

            console.error("Error fetching replies:", error);

            throw new Error(
                error.response?.data?.message || error.message || "Failed to fetch replies."
            );
        }
    },

    deleteReply: async (id) => {
        const token = sessionStorage.getItem('user_token')

        if (!token) {
            throw new Error('No authentication token found')
        }

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            }

            const response = await axios.delete(`${BASE_URL}/ticket/reply/${id}`, { headers })
            return response.data
        } catch (error) {
            throw error
        }
    },
    updateReply: async (id, data) => {
        const updatedData = {
            name: data,
        }

        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

            };

            const response = await axios.put(`${BASE_URL}/ticket/reply/${id}`, updatedData, { headers });
            return response.data;
        } catch (error) {
            throw error;
        }

    },


    searchPredefinedReply: async (searchTerm) => {
        try {
            const response = await axios.get(`${BASE_URL}/ticket/search?search=${searchTerm}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching predefined reply:', error);
            return null;
        }
    },







}


export default predefinedReply
