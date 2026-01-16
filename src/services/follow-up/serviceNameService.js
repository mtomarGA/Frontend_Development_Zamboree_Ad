import axios from 'axios'

const BASE_URL = `${process.env.NEXT_PUBLIC_URL}/follow-up`
const token = sessionStorage.getItem('user_token')
const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
}
axios.defaults.headers.common['Authorization'] = headers.Authorization

const ServiceNameService = {
    get: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/services`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    create: async (values) => {
        try {
            const response = await axios.post(`${BASE_URL}/service`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    update: async (id, values) => {
        try {
            const response = await axios.put(`${BASE_URL}/service/${id}`, values)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
    delete: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/service/${id}`)
            return response.data
        } catch (error) {
            console.error('Error fetching data:', error)
            throw error
        }
    },
}

export default ServiceNameService
