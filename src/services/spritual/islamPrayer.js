import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam/prayer`


const islamPrayerService = {
    getall: async ({ month, year }) => {
        try {
            const response = await axios.get(`${BASE_URL}`, {
                params: { month, year }
            })

            return response.data
        } catch (error) {
            console.error('Error fetching prayer times:', error)
            toast.error(error.response?.data?.message || 'Error fetching prayer time')
        }
    },
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating prayer time:', error)
            toast.error(error.response?.data?.message || 'Error creating prayer time')
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating prayer time:', error)
            toast.error(error.response?.data?.message || 'Error updating prayer time')
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error deleting prayer time by ID:', error)
            toast.error(error.response?.data?.message || 'Error deleting prayer time')
        }
    }
}

export default islamPrayerService
