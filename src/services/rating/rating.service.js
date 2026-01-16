import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_URL

const businessRating = {
    getRatingByType: async (type) => {
        console.log("runnoing askdjkasdjkasd");

        const token = sessionStorage.getItem('user_token')

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }

            const response = await axios.get(`${BASE_URL}/user/rating/dashboard/${type}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error getting area:', error)
            throw error
        }
    },
}

export default businessRating
