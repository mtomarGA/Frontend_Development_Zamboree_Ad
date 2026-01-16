import axios from 'axios'
import { get } from 'react-hook-form'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/jain/setting`


const JainSettingService = {
    create: async (values) => {
        try {
            const response = await axios.post(BASE_URL, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating setting:', error)
            toast.error(error.response?.data?.message || 'Error creating setting')
            throw error
        }
    },
    update: async (values) => {
        try {
            const response = await axios.put(`${BASE_URL}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error updating setting:', error)
            toast.error(error.response?.data?.message || 'Error updating setting')
            throw error
        }
    },
    get: async () => {
        try {
            const response = await axios.get(BASE_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching settings:', error)
            toast.error(error.response?.data?.message || 'Error fetching settings')
            throw error
        }
    },
}
export default JainSettingService
