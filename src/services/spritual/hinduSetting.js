import axios from 'axios'
import { get } from 'react-hook-form'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/hindu/setting`

const hinduSettingService = {
    create: async (values) => {
        try {
            const response = await axios.post(BASE_URL, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error creating setting:', error)
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
            throw error
        }
    },
    get:async () => {
        try {
            const response = await axios.get(BASE_URL)
            return response.data
        } catch (error) {
            console.error('Error fetching settings:', error)
            throw error
        }
    },
}
export default hinduSettingService
