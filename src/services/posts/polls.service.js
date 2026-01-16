
import axios from "axios";
import { get } from "react-hook-form";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_URL


const PollsService = {
    addPolls: async (data) => {

        // console.log(data, 'data to submit');

        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/post-data/polls`, data, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getPolls: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/post-data/polls`, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getPendingPolls: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/post-data/get-approvel-polls`, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updatepolls: async (payload, pollsId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.put(`${BASE_URL}/post-data/polls/${pollsId}`, payload, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deletePolls: async (id) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.delete(`${BASE_URL}/post-data/polls/${id}`, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getPollsById: async (id) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/post-data/polls/${id}`, { headers })
            console.log(response, 'response from polls');
            return response.data;

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    approvePolls: async (payload, pollsId) => {
        const token = sessionStorage.getItem('user_token');
        const data={
            status:payload?.status
        }
        console.log(data,'dddddddddddddddd')
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/post-data/polls-approve/${pollsId}`,data, { headers })
            console.log(response, 'response from polls');
            return response.data;
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }

    }
}

export default PollsService;
