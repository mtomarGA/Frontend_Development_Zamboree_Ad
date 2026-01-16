import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/sikh/livedarshan`

const SikhLiveDarshanService = {
    create: async (values) => {
        try {
            const response = await axios.post(BASE_URL, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating live darshan:', error)
            toast.error(error.response?.data?.message || 'Error creating live darshan')
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
            toast.error(error.response?.data?.message || 'Error updating live darshan')
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(BASE_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching live darshans:', error)
            toast.error(error.response?.data?.message || 'Error fetching live darshans')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error deleting live darshan:', error)
            toast.error(error.response?.data?.message || 'Error deleting live darshan')
            throw error
        }
    },
}
export default SikhLiveDarshanService
