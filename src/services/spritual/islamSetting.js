import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/spritual/islam`


const IslamSettingService = {
    getSettings: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/settings`)
            return response.data
        } catch (error) {
            toast.error('Error fetching settings')
            throw error
        }
    },
    createSettings: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/settings`, data)
            toast.success('Settings created successfully')
            return response.data
        } catch (error) {
            toast.error('Error creating settings')
            throw error
        }
    },
    updateSettings: async (data) => {
        console.log('Updating settings with data:', data);
        
        try {
            const response = await axios.put(`${BASE_URL}/settings`, data)
            toast.success('Settings updated successfully')
            return response.data
        } catch (error) {
            toast.error('Error updating settings')
            throw error
        }
    }
}

export default IslamSettingService
