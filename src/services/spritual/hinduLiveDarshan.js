import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/hindu/livedarshan`

const HinduLiveDarshanService = {
    create: async (values) => {
        try {
            const response = await axios.post(BASE_URL, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating live darshan:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating live darshan:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(BASE_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching live darshans:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
            return response.data
        } catch (error) {
            console.error('Error deleting live darshan:', error)
            throw error
        }
    },
}
export default HinduLiveDarshanService
