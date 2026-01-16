import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/hindu`


const HinduFestivalService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/festival`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating festival:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/festival/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating festival:', error)
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/festivals`)
            return response.data
        } catch (error) {
            console.error('Error fetching festivals:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/festival/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching festival by ID:', error)
            throw error
        }
    },
}

export default HinduFestivalService
