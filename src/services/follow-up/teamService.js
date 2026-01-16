import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/follow-up`
const token = sessionStorage.getItem('user_token')
const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
}
axios.defaults.headers.common['Authorization'] = headers.Authorization

const TeamService = {
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/team`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data.message || 'Failed to fetch team')
            throw error
        }
    },
    
}

export default TeamService
