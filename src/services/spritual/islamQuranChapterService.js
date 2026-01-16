import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam/quran`

// axios.defaults.withCredentials = true

const QuranChapterService = {
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/chapter`, data)
            toast.success(response.data.message || 'Quran chapter created successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error creating Quran chapter')
            throw error
        }
    },
    getAll: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/chapters`)
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching Quran chapters')
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/chapter/${id}`, data)
            toast.success(response.data.message || 'Quran chapter updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error updating Quran chapter')
            throw error
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/chapter/order`, data)
            toast.success(response.data.message || 'Quran chapter order updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error updating Quran chapter order')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/chapter/${id}`)
            toast.success(response.data.message || 'Quran chapter deleted successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error deleting Quran chapter')
            throw error
        }
    },
}

const QuranVerseService = {
    getAll: async (chapterId) => {
        try {
            const response = await axios.get(`${BASE_URL}/verse/${chapterId}`)
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error fetching Quran verses')
            throw error
        }
    },
    create: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/verse`, data, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            toast.success(response.data.message || 'Quran verse created successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error creating Quran verse')
            throw error
        }
    },
    update: async (id, data) => {
        try {
            const response = await axios.put(`${BASE_URL}/verse/${id}`, data, {
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            toast.success(response.data.message || 'Quran verse updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error updating Quran verse')
            throw error
        }
    },
    updateOrder: async (data) => {
        try {
            const response = await axios.put(`${BASE_URL}/verse/order`, data)
            toast.success(response.data.message || 'Quran verse order updated successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error updating Quran verse order')
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/verse/${id}`)
            toast.success(response.data.message || 'Quran verse deleted successfully')
            return response.data
        } catch (error) {
            toast.error(error.response.data.message || 'Error deleting Quran verse')
            throw error
        }
    },
}
export { QuranChapterService, QuranVerseService };
