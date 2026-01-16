import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL

const KeywordService = {
    addKeyword: async (data) => {
        console.log('data', data)
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.post(`${BASE_URL}/keyword/`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },

    getKeyword: async () => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/keyword/`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },

    getSingleKeyword: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/keyword/${id}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },

    deleteKeyword: async (id) => {
        console.log(id, 'sssss')
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.delete(`${BASE_URL}/keyword/${id}`, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    updateKeyword: async (keywordId, formData) => {

        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.put(`${BASE_URL}/keyword/${keywordId}`, formData, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding Keyword:', error)
            toast.error(error?.response?.data?.message)
            throw error
        }

    },
    getKeywordByCategoryId: async (id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await axios.get(`${BASE_URL}/keyword/categoty-keyword/${id}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    updatePrice: async (id, data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/keyword/update-price/${id}`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    getKeywordPrice: async (_id) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/keyword/price/${_id}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    getStateLavelHites: async (id,data) => {
        const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/keyword/get-hits-at-single-key/${id}`,data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }
    },
    getCityLavelHites:async(id,data)=>{
       const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/keyword/get-city-hits/${id}`,data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }  
    },
    getAreaLavelHites:async(id,data)=>{
       const token = sessionStorage.getItem('user_token')
        try {
            const headers = {
                Authorization: `Bearer ${token}`
            }
            const response = await axios.put(`${BASE_URL}/keyword/get-area-hits/${id}`,data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message)
            throw error
        }  
    }
}



export default KeywordService
