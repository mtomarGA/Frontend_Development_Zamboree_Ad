import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/applicationData`



const ApplicationDataService = {
    updateData: async (appName, pageName, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/${appName}/${pageName}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data.message || 'Failed to update application data')
        }
    },
    createData: async (appName, pageName, values) => {
        try {
            const response = await axios.post(`${BASE_URL}/${appName}/${pageName}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data.message || 'Failed to create application data')
        }
    },
    getData: async (appName, pageName) => {
        try {
            const response = await axios.get(`${BASE_URL}/${appName}/${pageName}`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response?.data.message || 'Failed to fetch application data')
        }
    }
}

export default ApplicationDataService
