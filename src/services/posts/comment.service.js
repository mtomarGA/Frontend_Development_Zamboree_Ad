import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL


const CommentService = {
    addComment: async (postId, data) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/post-data/comment/${postId}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllComment: async () => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.get(`${BASE_URL}/post-data/comment`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updateComment: async (commentId, data) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.put(`${BASE_URL}/post-data/comment/${commentId}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }

    },
    deleteComment: async (commentId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/comment/${commentId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw erro
        }
    },








    deleteCommentAndReport: async (commentId) => {
        const token = sessionStorage.getItem('user_token');
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/post-data/del-comment-report/${commentId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}

export default CommentService
