import axios from 'axios'
import { toast } from 'react-toastify'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/employee`

const DepartmentService = {
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/department`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
        }
    },
    getMaster: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/master/department`)
            // toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
        }
    },
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/department`)
            // toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
        }
    },
    getMaster: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/master/department`)
            // toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/department/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/department/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
        }
    },
}

export default DepartmentService;
