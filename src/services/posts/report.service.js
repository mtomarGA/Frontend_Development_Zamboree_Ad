import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const reportService = {
    addPostReport: async (data) => {
        const token = sessionStorage.getItem('user_token');

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/post-data/report`, data, { headers })
            return response.data


        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getPostReport: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/report`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getSingleReportByPostId: async (postId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/report/${postId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deletePostReport: async (reportId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/report/${reportId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },








    // Post Comment Report Api Fetch

    createPostCommentReport: async (commentId, message) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/post-data/comment-report/${commentId}`, message, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getPostCommentReport: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/comment-report`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getSinglePostCommentReport: async (id) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/comment-report/${id}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deleteCommentReport: async (reportId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/comment-report/${reportId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },








    //Polls Report Service 

    addPollsReport: async (pollsId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/post-data/polls-report/${pollsId}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }

    },
    getPollsReport: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/polls-report`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    getSinglePollsReportByPollsId: async (id) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/polls-report/${id}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    deletePollsReport: async (reportId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/polls-report/${reportId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    InActivePollsAndDeleteAllCommentReport: async (pollsId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/reject-polls/${pollsId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },

    AddReportType: async (formData) => {
        const token = sessionStorage.getItem('user_token');

          try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.post(`${BASE_URL}/post-data/report-message-add`,formData,{ headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getReportType: async () => {
        const token = sessionStorage.getItem('user_token');

          try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/get-report-message-add`,{ headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    editReportType: async (data,_id) => {
        const token = sessionStorage.getItem('user_token');
          try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.put(`${BASE_URL}/post-data/report-type-edit/${_id}`,data,{ headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deleteReportType: async (_id) => {
        const token = sessionStorage.getItem('user_token');
          try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/delete-report-type/${_id}`,{ headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },


}

export default reportService
