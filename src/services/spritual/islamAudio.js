import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const IslamAudioService = {
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/audio`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Audio created successfully')
            return response.data
        } catch (error) {
            toast.error('Error creating audio')
            throw error
        }
    },
    getAll: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/audios/${id}`)
            return response.data
        } catch (error) {
            toast.error('Error fetching audios')
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/audio/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            toast.success('Audio updated successfully')
            return response.data
        } catch (error) {
            toast.error('Error updating audio')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/audio/${id}`)
            toast.success('Audio deleted successfully')
            return response.data
        } catch (error) {
            toast.error('Error deleting audio')
            throw error
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/reciteraudio/updateorder`, data)
            toast.success('Audio order updated successfully')
            return response.data
        } catch (error) {
            toast.error('Error updating audio order')
            throw error
        }
    }
};

export default IslamAudioService;
