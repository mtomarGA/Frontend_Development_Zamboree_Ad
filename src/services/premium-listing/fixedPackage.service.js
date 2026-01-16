import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');
const headers = {
    Authorization: `Bearer ${token}`,
};

const fixedPackage = {
    addPackage: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/fixed-package/create`, data, { headers })
            return response.data

        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllFixedPackage: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/fixed-package/get`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deleteFixedListing: async (packageId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/fixed-package/delete/${packageId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getKeyWordDetails: async (name) => {
        try {
            const response = await axios.get(`${BASE_URL}/keyword/get-keydetails/${name}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getKeyWordDetailsByArea: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/keyword/get-details`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}


export default fixedPackage
