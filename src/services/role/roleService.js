import axios from 'axios'
import { get } from 'react-hook-form'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/role`

import { toast } from 'react-toastify'

const RoleService = {
    create: async values => {
        try {
            const response = await axios.post(`${BASE_URL}/add-role`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            toast.error(error.response.data.message)
            console.error('Error fetching data:', error)
            throw error
        }
    },
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/get-role`)
            // toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
            throw error
        }
    },
    getById: async id => {
        try {
            const response = await axios.get(`${BASE_URL}/get-role/${id}`)
            // toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/update-role/${id}`, values)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error(error.response.data.message)
            throw error
        }
    },
    delete: async id => {
        try {
            const response = await axios.delete(`${BASE_URL}/delete-role/${id}`)
            toast.success(response.data.message)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.success(error.response.data.message)
            throw error
        }
    }
}

export default RoleService;
