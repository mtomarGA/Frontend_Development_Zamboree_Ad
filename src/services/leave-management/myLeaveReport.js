import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const leaveManegmentService = {

    
    getMyLeaveReport: async () => {
        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/admin/leaveManagement/getMyLeaveReport`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding reaction:', error)
            toast.error(error?.response?.data?.message || 'Failed to add reaction')
            throw error
        }
    },

    

   

  

    

}

export default leaveManegmentService
