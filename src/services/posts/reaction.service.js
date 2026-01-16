import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const reactionService = {
    addReaction: async (data) => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.post(`${BASE_URL}/post-data/reaction`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    getReactions: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/post-data/reaction`, { headers })
            return response.data
        } catch (error) {
            console.error('Error fetching reactions:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch reactions')
            throw error
        }
    },
    updatedReaction: async (reactionId, formData) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/post-data/reaction/${reactionId}`, formData, { headers })

            return response.data
        } catch (error) {
            console.error('Error fetching reactions:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch reactions')
            throw error
        }
    },
    deletereaction: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response=await axios.delete(`${BASE_URL}/post-data/reaction/${id}`,{headers})
            return response.data
        } catch (error) {
            console.error('Error fetching reactions:', error)
            toast.error(error?.response?.data?.message || 'Failed to fetch reactions')
            throw error
        }
    }
}
export default reactionService
