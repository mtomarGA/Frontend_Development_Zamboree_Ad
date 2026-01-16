import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');

const PackageService = {
    addPackage: async (data) => {   
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(`${BASE_URL}/admin/package/`, data, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllPackage: async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/admin/package`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deletePackage: async (packageId) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await axios.delete(`${BASE_URL}/admin/package/${packageId}`, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updatePackage: async (packageId, formData) => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
              const response = await axios.put(`${BASE_URL}/admin/package/${packageId}`,formData, { headers })
            return response.data
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}
export default PackageService
