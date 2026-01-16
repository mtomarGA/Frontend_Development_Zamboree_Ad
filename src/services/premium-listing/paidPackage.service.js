import axios from "axios"
import { toast } from "react-toastify"

const BASE_URL = process.env.NEXT_PUBLIC_URL
const token = sessionStorage.getItem('user_token');
const headers = {
    Authorization: `Bearer ${token}`,
};
const PaidPackage = {
    addPaidPackage: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/admin/paid-package/create`, data, { headers })
            return response.data

        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    getAllPaidPackage: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/paid-package/get`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    deletePaidPackage: async (packageId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/admin/paid-package/delete/${packageId}`, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    },
    updatePaidPackage: async (packageId, data) => {
        console.log(packageId, 'paidddd');
        console.log(data, 'paidddd');

        try {
            const response = await axios.put(`${BASE_URL}/admin/paid-package/update/${packageId}`, data, { headers })
            return response.data
        } catch (error) {
            console.error('Error adding post:', error);
            toast.error(error?.response?.data?.message || 'Failed to add post');
            throw error;
        }
    }
}

export default PaidPackage

